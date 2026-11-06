"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "login", username: form.get("username"), password: form.get("password") }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Не удалось подключиться. Повторите вход.");
    } finally { setBusy(false); }
  }
  return (
    <div className="admin-shell admin-login">
      <form onSubmit={submit} className="admin-login-form">
        <Link href="/" className="admin-brand">Choco Dips</Link>
        <h1>Управление меню</h1>
        <label>Логин<input name="username" minLength={3} maxLength={80} pattern="[a-zA-Z0-9_-]+" autoComplete="username" required /></label>
        <label>Пароль<input name="password" type="password" minLength={12} maxLength={128} autoComplete="current-password" required /></label>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <button className="admin-primary" disabled={busy || !configured}>{busy ? "Подождите…" : "Войти"}</button>
        <Link className="admin-muted" href="/">Вернуться на сайт</Link>
      </form>
    </div>
  );
}
