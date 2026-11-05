"use client";
import { useEffect, useRef } from "react";
import type { MenuCategory } from "@/lib/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";
export default function CategoryBar({
  categories,
  active,
}: {
  categories: MenuCategory[];
  active: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const track = ref.current;
    const item = track?.querySelector<HTMLElement>(
      `[data-category="${active}"]`,
    );
    if (!track || !item) return;
    const delta =
      item.offsetLeft -
      track.offsetLeft -
      track.clientWidth / 2 +
      item.offsetWidth / 2;
    track.scrollTo({ left: delta, behavior: reduced ? "instant" : "smooth" });
  }, [active, reduced]);
  return (
    <div className="category-bar">
      <nav
        ref={ref}
        className="container category-chips"
        aria-label="Разделы меню"
      >
        {categories.map((category) => (
          <a
            key={category.id}
            data-category={category.id}
            href={`#${category.id}`}
            className={`pill ${active === category.id ? "solid-ink" : ""}`}
            aria-current={active === category.id ? "location" : undefined}
            onClick={(event) => {
              const target = document.getElementById(category.id);
              if (target) {
                event.preventDefault();
                history.replaceState(null, "", `#${category.id}`);
                target.scrollIntoView({
                  behavior: reduced ? "instant" : "smooth",
                  block: "start",
                });
              }
            }}
          >
            {category.title}
          </a>
        ))}
      </nav>
    </div>
  );
}
