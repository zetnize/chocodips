export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");
export const routeUrl =
  process.env.NEXT_PUBLIC_ROUTE_URL ||
  "https://yandex.ru/maps/?text=Нальчик%20Пушкина%2085а";
export const imageBlur =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjNEEyQTFCIi8+PC9zdmc+";
