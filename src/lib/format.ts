const rubles = new Intl.NumberFormat("ru-RU");
export function formatPrice(price: number | [number, number]) {
  return `${Array.isArray(price) ? price.map((value) => rubles.format(value)).join(" / ") : rubles.format(price)}\u00a0₽`;
}
export function normalizeSearch(value: string) {
  return value.toLocaleLowerCase("ru-RU").replace(/ё/g, "е").trim();
}
