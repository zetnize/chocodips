import { NextResponse } from "next/server";
import { validateLead } from "@/lib/validation";
export const runtime = "nodejs";
const MAX_BODY = 4096;
// This per-instance limit is best-effort. Use shared Upstash/Redis for production.
const requests = new Map<string, { count: number; expires: number }>();
export async function POST(request: Request) {
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  )
    return NextResponse.json({ ok: false }, { status: 400 });
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      // Next may construct request.url with an internal hostname behind a proxy.
      const originUrl = new URL(origin);
      const host = request.headers.get("host") || new URL(request.url).host;
      if (!/^https?:$/.test(originUrl.protocol) || originUrl.host !== host)
        return NextResponse.json({ ok: false }, { status: 400 });
    } catch {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
  }
  const now = Date.now();
  for (const [key, entry] of requests)
    if (entry.expires < now) requests.delete(key);
  const ip = (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  ).slice(0, 100);
  const entry = requests.get(ip) || { count: 0, expires: now + 60000 };
  if (entry.count >= 5)
    return NextResponse.json(
      { ok: false, message: "Попробуйте через минуту." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  if (requests.size >= 10000 && !requests.has(ip))
    return NextResponse.json({ ok: false }, { status: 429 });
  entry.count++;
  requests.set(ip, entry);
  if (Number(request.headers.get("content-length")) > MAX_BODY)
    return NextResponse.json({ ok: false }, { status: 400 });
  let value: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return NextResponse.json({ ok: false }, { status: 400 });
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value: chunk } = await reader.read();
      if (done) break;
      size += chunk.byteLength;
      if (size > MAX_BODY) {
        await reader.cancel();
        return NextResponse.json({ ok: false }, { status: 400 });
      }
      chunks.push(chunk);
    }
    const buffer = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      buffer.set(chunk, offset);
      offset += chunk.byteLength;
    }
    value = JSON.parse(new TextDecoder().decode(buffer));
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const { data, errors } = validateLead(value);
  if (!data) return NextResponse.json({ ok: false, errors }, { status: 400 });
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token && !chatId) {
    console.log(
      "[lead:demo] Valid booking request received; Telegram is not configured.",
    );
    return NextResponse.json({ ok: true, demo: true });
  }
  if (!token || !chatId)
    return NextResponse.json({ ok: false }, { status: 500 });
  try {
    const text = [
      `Бронь Choco Dips`,
      `Имя: ${data.name}`,
      `Телефон: +${data.phone}`,
      `Дата: ${data.date || "уточнить"}`,
      `Время: ${data.time || "уточнить"}`,
      `Гостей: ${data.guests || "уточнить"}`,
    ].join("\n");
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      },
    );
    const result: { ok?: boolean } = await response.json();
    if (!response.ok || !result.ok)
      return NextResponse.json({ ok: false }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
