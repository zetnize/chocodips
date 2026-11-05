"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Photo from "@/components/ui/Photo";
import { useReducedMotion } from "@/hooks/useReducedMotion";
const slides = [
  {
    src: "/images/hero-1.jpg",
    alt: "Шоколадные крепы с мраморной глазурью, орехами и брауни на керамической тарелке",
  },
  {
    src: "/images/hero-2.jpg",
    alt: "Чашка капучино с латте-артом в тёплом свете кофейни",
  },
  { src: "/images/hero-3.jpg", alt: "Завтрак с яйцом и свежей зеленью у окна" },
];
function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}
export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const hidden = useSyncExternalStore(
    subscribeVisibility,
    () => document.hidden,
    () => false,
  );
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const stopped = reduced || hidden || hovered || focused || paused;
  useEffect(() => {
    if (stopped) return;
    const timer = setInterval(
      () => setActive((index) => (index + 1) % slides.length),
      6500,
    );
    return () => clearInterval(timer);
  }, [stopped, active]);
  const move = (direction: number) =>
    setActive((index) => (index + direction + slides.length) % slides.length);
  return (
    <div
      className={`hero-slider ${stopped ? "paused" : ""}`}
      role="region"
      aria-label="Вкус Choco Dips"
      aria-roledescription="carousel"
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          move(1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          move(-1);
        }
      }}
      onPointerDown={(event) => {
        if (event.pointerType === "touch")
          pointerStart.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerUp={(event) => {
        const start = pointerStart.current;
        if (
          start &&
          Math.abs(event.clientX - start.x) > 45 &&
          Math.abs(event.clientX - start.x) > Math.abs(event.clientY - start.y)
        )
          move(event.clientX < start.x ? 1 : -1);
        pointerStart.current = null;
      }}
      onPointerCancel={() => {
        pointerStart.current = null;
      }}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          className={`hero-slide ${active === index ? "active" : ""}`}
          role="group"
          aria-roledescription="слайд"
          aria-label={`${index + 1} из 3`}
          aria-hidden={active !== index}
        >
          <Photo
            src={slide.src}
            alt={slide.alt}
            sizes="100vw"
            priority={index === 0}
          />
        </div>
      ))}
      <div className="hero-shade" />
      <div className="slide-controls">
        <div className="slide-numbers">
          {slides.map((_, index) => (
            <button
              key={index}
              aria-label={`Показать слайд 0${index + 1}`}
              aria-pressed={active === index}
              className={active === index ? "active" : ""}
              onClick={() => setActive(index)}
            >
              0{index + 1}
            </button>
          ))}
        </div>
        <div className="slide-progress" key={active}>
          <span />
        </div>
        <button
          className="slider-pause"
          onClick={() => setPaused((value) => !value)}
          aria-label={
            paused ? "Включить смену слайдов" : "Приостановить смену слайдов"
          }
          aria-pressed={paused}
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            aria-hidden="true"
          >
            {paused ? <path d="m6 4 9 6-9 6Z" /> : <path d="M7 4v12M13 4v12" />}
          </svg>
        </button>
      </div>
    </div>
  );
}
