import "server-only";
import { createClient } from "@supabase/supabase-js";

export function supabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY));
}

export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Задайте SUPABASE_URL и SUPABASE_SECRET_KEY в настройках хостинга.");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store", signal: AbortSignal.timeout(15_000) }) },
  });
}

export const mediaBucket = process.env.SUPABASE_STORAGE_BUCKET || "menu-images";

export function requireSupabaseSuccess(error: unknown) {
  if (error) throw new Error("Не удалось обратиться к Supabase. Проверьте настройки подключения и выполните SQL из supabase/setup.sql.");
}
