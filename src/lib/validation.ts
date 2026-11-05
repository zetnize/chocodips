import type { Lead, LeadErrors } from "./types";
import { normalizePhone } from "./phone";
export function validateLead(value: unknown): {
  data?: Lead;
  errors: LeadErrors;
} {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return { errors: { name: "Проверьте заполнение формы." } };
  const raw = value as Record<string, unknown>;
  const errors: LeadErrors = {};
  const data: Lead = {
    name: typeof raw.name === "string" ? raw.name.trim() : "",
    phone: typeof raw.phone === "string" ? normalizePhone(raw.phone) : "",
    date: typeof raw.date === "string" ? raw.date : "",
    time: typeof raw.time === "string" ? raw.time : "",
    guests: typeof raw.guests === "string" ? raw.guests : "",
    website: typeof raw.website === "string" ? raw.website : "",
    consent: raw.consent === true,
  };
  if (data.name.length < 2 || data.name.length > 60)
    errors.name = "Укажите имя от 2 до 60 символов.";
  if (
    typeof raw.phone !== "string" ||
    raw.phone.length > 32 ||
    !/^7\d{10}$/.test(data.phone)
  )
    errors.phone = "Введите российский номер из 11 цифр, начиная с +7.";
  if (!data.consent)
    errors.consent = "Нужно согласие на обработку персональных данных.";
  if (
    data.date &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
      Number.isNaN(Date.parse(data.date)) ||
      new Date(`${data.date}T12:00:00Z`).toISOString().slice(0, 10) !==
        data.date)
  )
    errors.date = "Выберите корректную дату.";
  if (data.time && !/^(1\d|2[0-2]):[0-5]\d$/.test(data.time))
    errors.time = "Выберите время с 10:00 до 22:59.";
  if (data.guests && !/^([1-9]|1[0-2])$/.test(data.guests))
    errors.guests = "Укажите от 1 до 12 гостей.";
  if (
    raw.website !== undefined &&
    (typeof raw.website !== "string" || data.website.length > 0)
  )
    errors.website = "Не удалось отправить форму.";
  for (const key of ["date", "time", "guests"] as const)
    if (raw[key] !== undefined && typeof raw[key] !== "string")
      errors[key] = "Проверьте значение.";
  return { data: Object.keys(errors).length ? undefined : data, errors };
}
