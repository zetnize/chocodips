"use client";
import { useState } from "react";
import Image from "next/image";

export default function ImageField({ value, onChange, images, optional = false }: {
  value?: string; onChange: (src: string) => void; images: string[]; optional?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function upload(file?: File) {
    if (!file) return;
    setError("");
    if (file.size > 8 * 1024 * 1024) { setError("Фотография должна быть меньше 8 МБ."); return; }
    setBusy(true);
    try {
      const data = new FormData();
      data.set("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      onChange(result.src);
    } catch (error) { setError(error instanceof Error ? error.message : "Не удалось загрузить фотографию."); }
    finally { setBusy(false); }
  }
  return (
    <div className="admin-image-field">
      {value && <Image src={value} width={520} height={260} alt="Фотография в меню" unoptimized />}
      <label>Фотография из библиотеки<select value={value ?? ""} onChange={e => onChange(e.target.value)}>
        <option value="">{optional ? "Без фотографии" : "Выберите фотографию"}</option>
        {value && !images.includes(value) && <option value={value}>Загруженная фотография</option>}
        {images.map(src => <option value={src} key={src}>{src.replace("/images/", "")}</option>)}
      </select></label>
      <label className="admin-upload">{busy ? "Загружаем…" : "Загрузить фотографию"}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e => { void upload(e.target.files?.[0]); e.target.value = ""; }} /></label>
      <small>JPG, PNG или WebP · до 8 МБ</small>
      {error && <p role="alert" className="admin-error">{error}</p>}
    </div>
  );
}
