import { readFile } from "node:fs/promises";
import path from "node:path";
import { dataDirectory } from "@/lib/menu-store";
export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ file: string }> }) {
  const { file } = await context.params;
  if (!/^[a-f0-9-]{36}\.webp$/.test(file)) return new Response(null, { status: 404 });
  try {
    const image = await readFile(path.join(dataDirectory, "uploads", file));
    return new Response(image, { headers: { "Content-Type": "image/webp", "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
  } catch {
    return new Response(null, { status: 404 });
  }
}
