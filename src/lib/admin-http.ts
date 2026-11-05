export async function limitedBody(request: Request, limit: number) {
  if (Number(request.headers.get("content-length")) > limit) throw new Error("Файл или данные слишком большие.");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Пустой запрос.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > limit) {
      await reader.cancel();
      throw new Error("Файл или данные слишком большие.");
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export function apiError(message: string, status = 400) {
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}
