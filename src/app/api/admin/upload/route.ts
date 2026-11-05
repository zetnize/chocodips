import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { authenticated, sameOrigin } from "@/lib/admin-auth";
import { apiError, limitedBody } from "@/lib/admin-http";
import { menuStorageAvailable } from "@/lib/menu-store";
import { saveMenuImage } from "@/lib/menu-media";
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return apiError("Недопустимый источник запроса.", 403);
  if (!menuStorageAvailable()) return apiError("Подключите постоянное хранилище фотографий.", 503);
  if (!await authenticated()) return apiError("Сессия завершилась. Войдите снова.", 401);
  try {
    const bytes = await limitedBody(request, 8 * 1024 * 1024);
    const form = await new Response(bytes, { headers: { "Content-Type": request.headers.get("content-type") ?? "" } }).formData();
    const file = form.get("file");
    if (!(file instanceof File) || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) return apiError("Выберите JPG, PNG или WebP размером до 8 МБ.");
    const image = sharp(await file.arrayBuffer(), { limitInputPixels: 40_000_000, animated: false });
    const metadata = await image.metadata();
    if (!["jpeg", "png", "webp"].includes(metadata.format)) return apiError("Неподдерживаемый формат фотографии.");
    const output = await image.rotate().resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
    const name = `${randomUUID()}.webp`;
    await saveMenuImage(name, output);
    return Response.json({ src: `/api/media/${name}` });
  } catch {
    return apiError("Не удалось загрузить фотографию. Используйте JPG, PNG или WebP до 8 МБ.");
  }
}
