import { authenticated, sameOrigin } from "@/lib/admin-auth";
import { apiError, limitedBody } from "@/lib/admin-http";
import { readMenu, saveMenu, menuStorageAvailable } from "@/lib/menu-store";
import { validateMenu } from "@/lib/menu-validation";
export const runtime = "nodejs";

export async function GET() {
  if (!menuStorageAvailable()) return apiError("Подключите постоянное хранилище для работы админки.", 503);
  if (!await authenticated()) return apiError("Войдите в панель.", 401);
  return Response.json(await readMenu(), { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request) {
  if (!sameOrigin(request)) return apiError("Недопустимый источник запроса.", 403);
  if (!menuStorageAvailable()) return apiError("Подключите постоянное хранилище для работы админки.", 503);
  if (!await authenticated()) return apiError("Сессия завершилась. Войдите снова.", 401);
  try {
    const body = JSON.parse((await limitedBody(request, 2_000_000)).toString());
    if (!Number.isSafeInteger(body.revision) || body.revision < 1) return apiError("Некорректная версия меню.");
    const categories = validateMenu(body.categories);
    if (!await saveMenu(categories, body.revision)) return apiError("Меню изменилось в другом окне. Скопируйте нужные правки и обновите страницу.", 409);
    return Response.json({ revision: body.revision + 1 });
  } catch (error) {
    return apiError(error instanceof Error ? error.message : "Не удалось сохранить меню.");
  }
}
