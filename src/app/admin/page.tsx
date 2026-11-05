import type { Metadata } from "next";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { authenticated, credentialsConfigured } from "@/lib/admin-auth";
import { readMenu, menuStorageAvailable } from "@/lib/menu-store";
import AdminPanel from "@/components/admin/AdminPanel";
import AdminLogin from "@/components/admin/AdminLogin";
import "./admin.css";

export const metadata: Metadata = { title: "Управление меню", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!menuStorageAvailable()) return (
    <div className="admin-shell admin-login">
      <div className="admin-login-form">
        <h1>Настройте хранилище меню</h1>
        <p>Публичный сайт показывает исходное меню. Для работы редактора на этом хостинге подключите внешнюю базу данных и хранилище фотографий.</p>
        <p>Для Supabase выполните supabase/setup.sql и задайте SUPABASE_URL и SUPABASE_SECRET_KEY в переменных окружения хостинга.</p>
      </div>
    </div>
  );
  if (!await authenticated()) return <AdminLogin configured={credentialsConfigured()} />;
  const files = await readdir(path.join(process.cwd(), "public/images"), { recursive: true });
  const images = files.filter(file => /\.(jpg|jpeg|png|webp)$/.test(file)).map(file => `/images/${file.replaceAll("\\", "/")}`);
  return <AdminPanel initial={await readMenu()} images={images} />;
}
