import "server-only";
import { cookies } from "next/headers";
import { randomBytes, timingSafeEqual, createHash } from "node:crypto";
import { getDatabase } from "./menu-store";

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

export function loginAllowed() {
  const row = getDatabase().prepare("SELECT count, reset_at FROM login_attempts WHERE id = 1").get() as { count: number; reset_at: number } | undefined;
  return !row || row.reset_at < Date.now() || row.count < 10;
}

export function recordFailure() {
  getDatabase().prepare(`INSERT INTO login_attempts VALUES (1, 1, ?) ON CONFLICT(id) DO UPDATE SET
    count = CASE WHEN reset_at < ? THEN 1 ELSE count + 1 END,
    reset_at = CASE WHEN reset_at < ? THEN excluded.reset_at ELSE reset_at END`)
    .run(Date.now() + 15 * 60_000, Date.now(), Date.now());
}

export async function authenticated() {
  if (!credentialsConfigured()) return false;
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return false;
  return Boolean(getDatabase().prepare("SELECT token FROM sessions WHERE token = ? AND expires > ?").get(sessionDigest(token), Date.now()));
}

export async function startSession(request: Request) {
  const token = randomBytes(32).toString("hex");
  const db = getDatabase();
  db.prepare("DELETE FROM sessions WHERE expires <= ?").run(Date.now());
  db.prepare("INSERT INTO sessions VALUES (?, ?)").run(sessionDigest(token), Date.now() + lifetime * 1000);
  db.exec("DELETE FROM login_attempts");
  (await cookies()).set(cookieName, token, {
    httpOnly: true, sameSite: "strict", secure: new URL(request.url).protocol === "https:",
    path: "/", maxAge: lifetime,
  });
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (token) getDatabase().prepare("DELETE FROM sessions WHERE token = ?").run(sessionDigest(token));
  jar.delete(cookieName);
}

export function sameOrigin(request: Request) {
  return request.headers.get("origin") === new URL(request.url).origin;
}

