import { publicMenu } from "@/lib/menu-store";
import { formatPrice } from "@/lib/format";
import CircleArrowButton from "@/components/ui/CircleArrowButton";
import Eyebrow from "@/components/ui/Eyebrow";
import Photo from "@/components/ui/Photo";
import ParallaxLayer from "./ParallaxLayer";
export default function SeasonalBanner() {
  const category = publicMenu().find(category => category.groups.some(group => group.items.some(item => item.seasonal)));
  const item = category?.groups.flatMap(group => group.items).find(item => item.seasonal);
  if (!item || !category) return null;
  return (
    <section
      className="seasonal-section container"
      aria-labelledby="seasonal-title"
    >
      <div className="seasonal-banner">
        <div className="seasonal-visual">
          <ParallaxLayer>
            <Photo
              src={item.image!}
              alt={item.name}
              sizes="(max-width: 767px) 100vw, 65vw"
            />
          </ParallaxLayer>
        </div>
        <div className="seasonal-content">
          <Eyebrow>СЕЗОННОЕ</Eyebrow>
          <h2 id="seasonal-title">{item.name}</h2>
          <p>{item.description}</p>
          <div className="seasonal-price">
            <span>{formatPrice(item.price)}</span>
            <CircleArrowButton
              label="Смотреть сезонное меню"
              href={`/menu#${category.id}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
