import Link from "next/link";
import Photo from "@/components/ui/Photo";
import { ArrowIcon } from "@/components/ui/icons";

const dishes = [
  {
    href: "/menu#desserts",
    image: "/images/hero-1.jpg",
    title: "Десерты",
    alt: "Шоколадные крепы с орехами и мраморной глазурью",
  },
  {
    href: "/menu#breakfast",
    image: "/images/cat-breakfast.jpg",
    title: "Завтраки",
    alt: "Тост с креветками, авокадо и жареным яйцом",
  },
  {
    href: "/menu#main",
    image: "/images/cat-main.jpg",
    title: "Основное",
    alt: "Брускетта с овощами, зеленью и пармезаном",
  },
];

export default function HeroDishGallery() {
  return (
    <div className="intro-dish-gallery">
      <p className="eyebrow">Загляните в меню</p>
      <div className="intro-dish-grid">
        {dishes.map((dish) => (
          <Link key={dish.href} href={dish.href} className="intro-dish">
            <Photo
              src={dish.image}
              alt={dish.alt}
              sizes="(max-width: 767px) 60vw, (max-width: 1023px) 40vw, 30vw"
            />
            <span className="intro-dish-caption">
              {dish.title}
              <ArrowIcon />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
