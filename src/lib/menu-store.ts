import "server-only";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { menu as initialMenu } from "@/data/menu";
import type { MenuCategory } from "./types";

export const dataDirectory = process.env.CHOCO_DATA_DIRECTORY || path.join(process.cwd(), "data");
let database: DatabaseSync | undefined;

export function getDatabase() {
  if (database) return database;
  mkdirSync(dataDirectory, { recursive: true });
  database = new DatabaseSync(path.join(dataDirectory, "choco-dips.sqlite"));
  database.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY CHECK(id = 1), revision INTEGER NOT NULL, content TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS login_attempts (id INTEGER PRIMARY KEY CHECK(id = 1), count INTEGER NOT NULL, reset_at INTEGER NOT NULL);
  `);
  database.prepare("INSERT OR IGNORE INTO menu VALUES (1, 1, ?)").run(JSON.stringify(initialMenu));
  return database;
}

export function readMenu(): { categories: MenuCategory[]; revision: number } {
  const row = getDatabase().prepare("SELECT revision, content FROM menu WHERE id = 1").get() as { revision: number; content: string };
  return { categories: JSON.parse(row.content), revision: row.revision };
}

export function saveMenu(categories: MenuCategory[], revision: number) {
  return getDatabase().prepare("UPDATE menu SET content = ?, revision = revision + 1 WHERE id = 1 AND revision = ?")
    .run(JSON.stringify(categories), revision).changes === 1;
}

export function publicMenu() {
  return readMenu().categories.filter(category => !category.hidden).map(category => ({
    ...category,
    groups: category.groups.map(group => ({ ...group, items: group.items.filter(item => !item.hidden) })),
  }));
}
