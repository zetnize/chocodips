"use client";
import { useRef } from "react";
import Link from "next/link";
import Photo from "@/components/ui/Photo";
import CircleArrowButton from "@/components/ui/CircleArrowButton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
const categories = [
  {
    id: "breakfast",
    title: "Завтраки",
    alt: "Тост с яйцом, креветками и помидорами черри",
  },
  { id: "coffee", title: "Кофе", alt: "Капучино с сердечком из молочной пены" },
  {
    id: "desserts",
    title: "Десерты",
    alt: "Шоколадный торт на тёмной тарелке",
  },
  {
    id: "main",
    title: "Основное",
    alt: "Брускетта со свежей зеленью и овощами",
  },
];
export default function CategoryCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  return (
    <div className="category-carousel">
      <div className="category-track" ref={ref}>
        {categories.map((category, index) => (
          <Link
            className={`category-card blob-${index + 1}`}
            href={`/menu#${category.id}`}
            key={category.id}
          >
            <Photo
              src={`/images/cat-${category.id}.jpg`}
              alt={category.alt}
              sizes="(max-width: 767px) 40vw, (max-width: 1023px) 24vw, 18vw"
            />
            <span className="category-caption">{category.title}</span>
          </Link>
        ))}
      </div>
      <CircleArrowButton
        className="category-menu-arrow"
        label="Открыть всё меню"
        href="/menu"
      />
      <CircleArrowButton
        className="category-scroll-arrow"
        label="Следующие категории меню"
        onClick={() => {
          const track = ref.current;
          if (track)
            track.scrollTo({
              left:
                track.scrollLeft + track.clientWidth >= track.scrollWidth - 5
                  ? 0
                  : track.scrollLeft +
                    (track.firstElementChild?.clientWidth || 200) +
                    16,
              behavior: reduced ? "instant" : "smooth",
            });
        }}
      />
    </div>
  );
}
