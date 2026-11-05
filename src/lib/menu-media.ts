import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { dataDirectory } from "./menu-store";
import { getSupabase, mediaBucket, requireSupabaseSuccess, supabaseConfigured } from "./supabase-server";

export async function saveMenuImage(name: string, image: Buffer) {
  if (supabaseConfigured()) {
    const result = await getSupabase().storage.from(mediaBucket).upload(`menu/${name}`, image, { contentType: "image/webp", upsert: false, cacheControl: "31536000" });
    requireSupabaseSuccess(result.error);
    return;
  }
  const directory = path.join(dataDirectory, "uploads");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, name), image, { flag: "wx" });
}

export async function readMenuImage(name: string): Promise<Uint8Array | null> {
  if (supabaseConfigured()) {
    const result = await getSupabase().storage.from(mediaBucket).download(`menu/${name}`);
    if (result.error && "statusCode" in result.error && ["400", "404"].includes(String(result.error.statusCode))) return null;
    requireSupabaseSuccess(result.error);
    if (!result.data) return null;
    return new Uint8Array(await result.data.arrayBuffer());
  }
  try {
    return await readFile(path.join(dataDirectory, "uploads", name));
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return null;
    throw error;
  }
}
