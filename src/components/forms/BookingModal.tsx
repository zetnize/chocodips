"use client";
import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import Eyebrow from "@/components/ui/Eyebrow";
import { ArrowIcon } from "@/components/ui/icons";
import { maskPhone } from "@/lib/phone";
import { validateLead } from "@/lib/validation";
import type { LeadErrors } from "@/lib/types";
const failure =
  "Не получилось отправить. Позвоните нам или попробуйте ещё раз.";
export default function BookingModal({ onClose }: { onClose: () => void }) {
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [demo, setDemo] = useState(false);
  const inFlight = useRef(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const raw = {
      name: fields.get("name"),
      phone,
      date: fields.get("date"),
      time: fields.get("time"),
      guests: fields.get("guests"),
      consent: fields.get("consent") === "on",
      website: fields.get("website"),
    };
    const validation = validateLead(raw);
    setErrors(validation.errors);
    if (!validation.data) {
      const first = Object.keys(validation.errors)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    inFlight.current = true;
    setStatus("loading");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
        signal: AbortSignal.timeout(15000),
      });
      const result: { ok?: boolean; demo?: boolean; errors?: LeadErrors } =
        await response.json();
      if (!response.ok || !result.ok) {
        if (result.errors) setErrors(result.errors);
        setStatus("error");
      } else {
        setDemo(Boolean(result.demo));
        setStatus("success");
      }
    } catch {
      setStatus("error");
    } finally {
      inFlight.current = false;
    }
  }
  const errorFor = (key: keyof LeadErrors) =>
    errors[key] ? (
      <span className="field-error" id={`booking-${key}-error`}>
        {errors[key]}
      </span>
    ) : null;
  return (
    <Modal
      onClose={onClose}
      labelledBy="booking-title"
      className="booking-backdrop"
    >
      <div className="booking-content">
        <Eyebrow>ЖДЁМ В ГОСТИ</Eyebrow>
        <h2 id="booking-title">
          Ваш столик
          <br />в Choco Dips
        </h2>
        {status === "success" ? (
          <div className="booking-result" role="status">
            <p>
              {demo
                ? "Форма работает в деморежиме. Заявка не передана в кофейню."
                : "Спасибо! Мы свяжемся с вами в ближайшее время."}
            </p>
            {!demo && (
              <p className="muted">Бронь будет подтверждена после звонка.</p>
            )}
            <button className="pill solid-ink" onClick={onClose}>
              Закрыть
              <ArrowIcon />
            </button>
          </div>
        ) : (
          <>
            <p className="muted booking-intro">
              Оставьте номер — мы перезвоним и уточним детали.
            </p>
            <form onSubmit={submit} noValidate>
              <div className="form-grid">
                <label className="full">
                  Ваше имя
                  <input
                    name="name"
                    autoComplete="given-name"
                    maxLength={60}
                    required
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={
                      errors.name ? "booking-name-error" : undefined
                    }
                  />
                  {errorFor("name")}
                </label>
                <label className="full">
                  Телефон
                  <input
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={(event) =>
                      setPhone(maskPhone(event.target.value))
                    }
                    required
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={
                      errors.phone ? "booking-phone-error" : undefined
                    }
                  />
                  {errorFor("phone")}
                </label>
                <label>
                  Дата <span className="optional">необязательно</span>
                  <input
                    name="date"
                    type="date"
                    aria-invalid={Boolean(errors.date)}
                    aria-describedby={
                      errors.date ? "booking-date-error" : undefined
                    }
                  />
                  {errorFor("date")}
                </label>
                <label>
                  Время <span className="optional">необязательно</span>
                  <input
                    name="time"
                    type="time"
                    min="10:00"
                    max="22:59"
                    aria-invalid={Boolean(errors.time)}
                    aria-describedby={
                      errors.time ? "booking-time-error" : undefined
                    }
                  />
                  {errorFor("time")}
                </label>
                <label className="full">
                  Количество гостей{" "}
                  <span className="optional">необязательно</span>
                  <select
                    name="guests"
                    defaultValue=""
                    aria-invalid={Boolean(errors.guests)}
                    aria-describedby={
                      errors.guests ? "booking-guests-error" : undefined
                    }
                  >
                    <option value="">Выберите</option>
                    {Array.from({ length: 12 }, (_, index) => (
                      <option key={index} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                  {errorFor("guests")}
                </label>
              </div>
              <div className="honeypot" aria-hidden="true">
                <label>
                  Ваш сайт
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <label className="consent">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={
                    errors.consent ? "booking-consent-error" : undefined
                  }
                />
                <span>
                  Согласен на обработку персональных данных по{" "}
                  <Link
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    политике конфиденциальности
                  </Link>
                  .
                </span>
              </label>
              {errorFor("consent")}
              {status === "error" && (
                <p role="alert" className="field-error">
                  {failure}
                </p>
              )}
              <button
                className="pill solid-ink submit-booking"
                type="submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Отправляем…" : "Жду звонка"}
                <ArrowIcon />
              </button>
              <p className="form-note">Заявка — ещё не подтверждение брони.</p>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}
