import { getSeasonalItem } from "@/data/menu";
import { formatPrice } from "@/lib/format";
import CircleArrowButton from "@/components/ui/CircleArrowButton";
import Eyebrow from "@/components/ui/Eyebrow";
import Photo from "@/components/ui/Photo";
import ParallaxLayer from "./ParallaxLayer";
export default function SeasonalBanner() {
  const item = getSeasonalItem();
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
              alt="Пряный напиток Apple + в гранёном стакане с воздушной пеной и лепестками роз"
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
              href="/menu#seasonal"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
