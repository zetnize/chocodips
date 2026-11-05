import type { Metadata } from "next";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { authenticated, credentialsConfigured } from "@/lib/admin-auth";
import { readMenu } from "@/lib/menu-store";
import AdminPanel from "@/components/admin/AdminPanel";
import AdminLogin from "@/components/admin/AdminLogin";
import "./admin.css";

export const metadata: Metadata = { title: "Управление меню", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!await authenticated()) return <AdminLogin configured={credentialsConfigured()} />;
  const files = await readdir(path.join(process.cwd(), "public/images"), { recursive: true });
  const images = files.filter(file => /\.(jpg|jpeg|png|webp)$/.test(file)).map(file => `/images/${file.replaceAll("\\", "/")}`);
  return <AdminPanel initial={readMenu()} images={images} />;
}
