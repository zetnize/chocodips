import Link from "next/link";
import Photo from "@/components/ui/Photo";
import { ArrowIcon } from "@/components/ui/icons";
import { publicMenu } from "@/lib/menu-store";

export default function HeroDishGallery() {
  const categories = publicMenu();
  const preferred = ["desserts", "breakfast", "main"];
  const featured = preferred.flatMap(id => categories.filter(category => category.id === id));
  const dishes = [...featured, ...categories.filter(category => !preferred.includes(category.id))].slice(0, 3);
  if (!dishes.length) return null;
  return (
    <div className="intro-dish-gallery">
      <p className="eyebrow">Загляните в меню</p>
      <div className="intro-dish-grid">
        {dishes.map((dish) => (
          <Link key={dish.id} href={`/menu#${dish.id}`} className="intro-dish">
            <Photo
              src={dish.image}
              alt={dish.title}
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
