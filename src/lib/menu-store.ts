import "server-only";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { menu as initialMenu } from "@/data/menu";
import type { MenuCategory } from "./types";
import { cache } from "react";
import { getSupabase, requireSupabaseSuccess, supabaseConfigured } from "./supabase-server";

export const dataDirectory = process.env.CHOCO_DATA_DIRECTORY || path.join(process.cwd(), "data");
let database: DatabaseSync | undefined;

export class MenuStorageUnavailableError extends Error {
  constructor() {
    super("Хранилище меню недоступно. Для этого хостинга нужна внешняя база и хранилище фотографий. На сервере с постоянным диском задайте доступный для записи CHOCO_DATA_DIRECTORY.");
    this.name = "MenuStorageUnavailableError";
  }
}

function storageAccessError(error: unknown) {
  return error instanceof Error && "code" in error &&
    ["EROFS", "EACCES", "EPERM", "ENOENT", "ENOTDIR"].includes(String(error.code));
}

export function getDatabase() {
  if (process.env.VERCEL === "1") throw new MenuStorageUnavailableError();
  if (database) return database;
  let opened: DatabaseSync | undefined;
  try {
    mkdirSync(dataDirectory, { recursive: true });
    opened = new DatabaseSync(path.join(dataDirectory, "choco-dips.sqlite"));
    opened.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY CHECK(id = 1), revision INTEGER NOT NULL, content TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS login_attempts (id INTEGER PRIMARY KEY CHECK(id = 1), count INTEGER NOT NULL, reset_at INTEGER NOT NULL);
  `);
    opened.prepare("INSERT OR IGNORE INTO menu VALUES (1, 1, ?)").run(JSON.stringify(initialMenu));
    database = opened;
    return database;
  } catch (error) {
    opened?.close();
    if (storageAccessError(error)) throw new MenuStorageUnavailableError();
    throw error;
  }
}

export function menuStorageAvailable() {
  if (supabaseConfigured()) return true;
  try {
    getDatabase();
    return true;
  } catch (error) {
    if (error instanceof MenuStorageUnavailableError) return false;
    throw error;
  }
}

export async function readMenu(): Promise<{ categories: MenuCategory[]; revision: number }> {
  if (supabaseConfigured()) {
    const client = getSupabase();
    let result = await client.from("choco_menu").select("categories, revision").eq("id", 1).maybeSingle();
    requireSupabaseSuccess(result.error);
    if (!result.data) {
      const seeded = await client.from("choco_menu").upsert({ id: 1, revision: 1, categories: initialMenu }, { onConflict: "id", ignoreDuplicates: true });
      requireSupabaseSuccess(seeded.error);
      result = await client.from("choco_menu").select("categories, revision").eq("id", 1).single();
      requireSupabaseSuccess(result.error);
    }
    if (!result.data) throw new Error("Меню не найдено в Supabase.");
    return result.data as { categories: MenuCategory[]; revision: number };
  }
  const row = getDatabase().prepare("SELECT revision, content FROM menu WHERE id = 1").get() as { revision: number; content: string };
  return { categories: JSON.parse(row.content), revision: row.revision };
}

export async function saveMenu(categories: MenuCategory[], revision: number) {
  if (supabaseConfigured()) {
    const result = await getSupabase().from("choco_menu").update({ categories, revision: revision + 1 }).eq("id", 1).eq("revision", revision).select("revision");
    requireSupabaseSuccess(result.error);
    return result.data?.length === 1;
  }
  return getDatabase().prepare("UPDATE menu SET content = ?, revision = revision + 1 WHERE id = 1 AND revision = ?")
    .run(JSON.stringify(categories), revision).changes === 1;
}

export const publicMenu = cache(async () => {
  let categories: MenuCategory[];
  try {
    categories = (await readMenu()).categories;
  } catch (error) {
    if (!(error instanceof MenuStorageUnavailableError)) throw error;
    categories = initialMenu;
  }
  return categories.filter(category => !category.hidden).map(category => ({
    ...category,
    groups: category.groups.map(group => ({ ...group, items: group.items.filter(item => !item.hidden) })),
  }));
});
