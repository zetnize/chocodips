import { credentialsConfigured, endSession, loginAllowed, recordFailure, sameOrigin, startSession, verifyPassword } from "@/lib/admin-auth";
import { apiError, limitedBody } from "@/lib/admin-http";
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return apiError("Недопустимый источник запроса.", 403);
  try {
    const body = JSON.parse((await limitedBody(request, 2048)).toString());
    if (body.action === "logout") {
      await endSession();
      return Response.json({ ok: true });
    }
    if (!loginAllowed()) return apiError("Слишком много попыток. Повторите через 15 минут.", 429);
    if (!credentialsConfigured()) return apiError("Настройте ADMIN_LOGIN и ADMIN_PASSWORD на сервере и перезапустите приложение.", 503);
    if (typeof body.username !== "string" || !/^[a-zA-Z0-9_-]{3,80}$/.test(body.username)) return apiError("Укажите логин от 3 до 80 символов: латинские буквы, цифры, _ или -.");
    if (typeof body.password !== "string" || body.password.length < 12 || body.password.length > 128) return apiError("Пароль должен содержать от 12 до 128 символов.");
    if (body.action === "login") {
      if (!verifyPassword(body.username, body.password)) {
        recordFailure();
        return apiError("Неверный логин или пароль.", 401);
      }
    } else return apiError("Неизвестное действие.");
    await startSession(request);
    return Response.json({ ok: true });
  } catch {
    return apiError("Не удалось выполнить вход. Проверьте данные и повторите.");
  }
}
