import "server-only";
import { cookies } from "next/headers";
import { randomBytes, timingSafeEqual, createHash } from "node:crypto";
import { getDatabase, menuStorageAvailable } from "./menu-store";
import { getSupabase, requireSupabaseSuccess, supabaseConfigured } from "./supabase-server";

const cookieName = "choco_admin";
const lifetime = 60 * 60 * 12;
const digest = (value: string) => createHash("sha256").update(value).digest("hex");

export function credentialsConfigured() {
  return /^[a-zA-Z0-9_-]{3,80}$/.test(process.env.ADMIN_LOGIN ?? "") &&
    (process.env.ADMIN_PASSWORD?.length ?? 0) >= 12 &&
    (process.env.ADMIN_PASSWORD?.length ?? 0) <= 128;
}

export function verifyPassword(username: string, password: string) {
  if (!credentialsConfigured()) return false;
  const loginMatches = timingSafeEqual(Buffer.from(digest(username), "hex"), Buffer.from(digest(process.env.ADMIN_LOGIN!), "hex"));
  const passwordMatches = timingSafeEqual(Buffer.from(digest(password), "hex"), Buffer.from(digest(process.env.ADMIN_PASSWORD!), "hex"));
  return loginMatches && passwordMatches;
}

function sessionDigest(token: string) {
  return digest(`${token}\0${process.env.ADMIN_LOGIN}\0${process.env.ADMIN_PASSWORD}`);
}

export async function loginAllowed() {
  if (supabaseConfigured()) {
    const result = await getSupabase().from("choco_login_attempts").select("count, reset_at").eq("id", 1).maybeSingle();
    requireSupabaseSuccess(result.error);
    return !result.data || Number(result.data.reset_at) < Date.now() || result.data.count < 10;
  }
  const row = getDatabase().prepare("SELECT count, reset_at FROM login_attempts WHERE id = 1").get() as { count: number; reset_at: number } | undefined;
  return !row || row.reset_at < Date.now() || row.count < 10;
}

export async function recordFailure() {
  if (supabaseConfigured()) {
    const result = await getSupabase().rpc("choco_record_login_failure");
    requireSupabaseSuccess(result.error);
    return;
  }
  getDatabase().prepare(`INSERT INTO login_attempts VALUES (1, 1, ?) ON CONFLICT(id) DO UPDATE SET
    count = CASE WHEN reset_at < ? THEN 1 ELSE count + 1 END,
    reset_at = CASE WHEN reset_at < ? THEN excluded.reset_at ELSE reset_at END`)
    .run(Date.now() + 15 * 60_000, Date.now(), Date.now());
}

export async function authenticated() {
  if (!credentialsConfigured() || !menuStorageAvailable()) return false;
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return false;
  if (supabaseConfigured()) {
    const result = await getSupabase().from("choco_admin_sessions").select("token").eq("token", sessionDigest(token)).gt("expires", Date.now()).maybeSingle();
    requireSupabaseSuccess(result.error);
    return Boolean(result.data);
  }
  return Boolean(getDatabase().prepare("SELECT token FROM sessions WHERE token = ? AND expires > ?").get(sessionDigest(token), Date.now()));
}

export async function startSession(request: Request) {
  const token = randomBytes(32).toString("hex");
  if (supabaseConfigured()) {
    const client = getSupabase();
    const expired = await client.from("choco_admin_sessions").delete().lte("expires", Date.now());
    requireSupabaseSuccess(expired.error);
    const session = await client.from("choco_admin_sessions").insert({ token: sessionDigest(token), expires: Date.now() + lifetime * 1000 });
    requireSupabaseSuccess(session.error);
    const attempts = await client.from("choco_login_attempts").delete().eq("id", 1);
    requireSupabaseSuccess(attempts.error);
  } else {
    const db = getDatabase();
    db.prepare("DELETE FROM sessions WHERE expires <= ?").run(Date.now());
    db.prepare("INSERT INTO sessions VALUES (?, ?)").run(sessionDigest(token), Date.now() + lifetime * 1000);
    db.exec("DELETE FROM login_attempts");
  }
  (await cookies()).set(cookieName, token, {
    httpOnly: true, sameSite: "strict", secure: request.headers.get("origin")?.startsWith("https://") === true,
    path: "/", maxAge: lifetime,
  });
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (token && supabaseConfigured()) {
    const result = await getSupabase().from("choco_admin_sessions").delete().eq("token", sessionDigest(token));
    requireSupabaseSuccess(result.error);
  } else if (token) getDatabase().prepare("DELETE FROM sessions WHERE token = ?").run(sessionDigest(token));
  jar.delete(cookieName);
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin === "null") return false;
  if (origin === new URL(request.url).origin) return true;

  // Behind a reverse proxy, Next.js may build request.url from the internal listener.
  const publicUrl = URL.parse(process.env.NEXT_PUBLIC_SITE_URL ?? "");
  return (publicUrl?.protocol === "https:" || publicUrl?.protocol === "http:") &&
    origin === publicUrl.origin;
}

