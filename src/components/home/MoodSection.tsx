"use client";
import { useEffect, useState } from "react";

const localTime = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Europe/Moscow", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});

export default function MoodSection() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const update = () => setTime(localTime.format(new Date()));
    const initialUpdate = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 1000);
    return () => {
      window.clearTimeout(initialUpdate);
      window.clearInterval(interval);
    };
  }, []);
  const hour = time ? Number(time.slice(0, 2)) : null;
  const isOpen = hour !== null && hour >= 10 && hour < 23;
  return (
    <section className="local-moment container" aria-labelledby="moment-title">
      <h2 id="moment-title">Сейчас <span>в Нальчике</span></h2>
      <time className="local-moment-time" aria-label={time ? `Местное время ${time}` : "Местное время загружается"}>
        {time ?? "—:—"}
      </time>
      <p className="local-moment-status">
        {hour === null ? "Каждый день" : isOpen ? "Заходите, мы открыты" : "Увидимся утром"}
        <span>{hour === null ? "10:00 — 23:00" : isOpen ? "До 23:00" : "Откроемся в 10:00"}</span>
      </p>
    </section>
  );
}
