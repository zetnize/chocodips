import type { MenuCategory } from "./types";

type ObjectValue = Record<string, unknown>;
function object(value: unknown): ObjectValue {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Некорректная структура меню.");
  return value as ObjectValue;
}
function text(value: unknown, max: number, required = false) {
  if (value === undefined && !required) return;
  if (typeof value !== "string" || value.length > max || (required && !value.trim())) throw new Error("Проверьте название и длину текстовых полей.");
}
function image(value: unknown, required = false) {
  text(value, 300, required);
  if (value && (typeof value !== "string" || !/^\/(images\/[a-zA-Z0-9/_-]+\.(jpg|jpeg|png|webp)|api\/media\/[a-f0-9-]+\.webp)$/.test(value))) throw new Error("Выберите фотографию из библиотеки или загрузите новую.");
}
function list(value: unknown, max: number): unknown[] {
  if (!Array.isArray(value) || value.length > max) throw new Error("Слишком много элементов или некорректный список.");
  return value;
}
function identifier(value: unknown, seen: Set<string>) {
  if (typeof value !== "string" || !/^[a-z0-9][a-z0-9-]{0,79}$/.test(value) || seen.has(value)) throw new Error("Идентификаторы должны быть уникальными.");
  seen.add(value);
}
function price(value: unknown) {
  const prices = Array.isArray(value) ? value : [value];
  if (prices.length < 1 || prices.length > 2 || prices.some(p => typeof p !== "number" || !Number.isFinite(p) || p < 0 || p > 1_000_000)) throw new Error("Укажите корректную цену от 0 до 1 000 000 ₽.");
}
function flags(value: ObjectValue, keys: string[]) {
  for (const key of keys) if (value[key] !== undefined && typeof value[key] !== "boolean") throw new Error("Некорректное состояние переключателя.");
}

export function validateMenu(value: unknown): MenuCategory[] {
  const categoryIds = new Set<string>();
  const itemIds = new Set<string>();
  let seasonalCount = 0;
  for (const entry of list(value, 40)) {
    const category = object(entry);
    identifier(category.id, categoryIds);
    text(category.title, 100, true);
    text(category.availability, 150);
    image(category.image, true);
    flags(category, ["hidden"]);
    if (category.layout !== undefined && !["cards", "rows"].includes(String(category.layout))) throw new Error("Неизвестный вид категории.");
    const groupIds = new Set<string>();
    for (const entry of list(category.groups, 50)) {
      const group = object(entry);
      identifier(group.id, groupIds);
      text(group.title, 100);
      for (const entry of list(group.items, 300)) {
        const item = object(entry);
        identifier(item.id, itemIds);
        text(item.name, 150, true);
        text(item.size, 100, true);
        text(item.description, 2000);
        text(item.composition, 2000);
        price(item.price);
        image(item.image);
        flags(item, ["hidden", "seasonal"]);
        if (item.tags !== undefined) for (const tag of list(item.tags, 4)) if (!["hit", "new", "veg", "spicy"].includes(String(tag))) throw new Error("Неизвестная отметка блюда.");
        if (item.allergens !== undefined) for (const allergen of list(item.allergens, 30)) text(allergen, 100, true);
        if (item.seasonal) {
          seasonalCount++;
          if (!item.image) throw new Error("Для сезонного баннера нужна фотография.");
        }
      }
    }
    const addOnIds = new Set<string>();
    if (category.addOns !== undefined) for (const entry of list(category.addOns, 100)) {
      const addon = object(entry);
      identifier(addon.id, addOnIds);
      text(addon.name, 150, true);
      text(addon.size, 100, true);
      price(addon.price);
      if (Array.isArray(addon.price)) throw new Error("У добавки должна быть одна цена.");
    }
  }
  if (seasonalCount > 1) throw new Error("Для сезонного баннера можно выбрать только одно блюдо.");
  return value as MenuCategory[];
}
