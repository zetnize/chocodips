import { publicMenu } from "@/lib/menu-store";
import { formatPrice } from "@/lib/format";
import CircleArrowButton from "@/components/ui/CircleArrowButton";
import Eyebrow from "@/components/ui/Eyebrow";
import Photo from "@/components/ui/Photo";
import ParallaxLayer from "./ParallaxLayer";
export default async function SeasonalBanner() {
  const categories = await publicMenu();
  const category = categories.find(category => category.groups.some(group => group.items.some(item => item.seasonal)));
  const item = category?.groups.flatMap(group => group.items).find(item => item.seasonal);
  if (!item || !category) return null;
  const dishes = ["pumpkin-soup", "apple-crumble"].flatMap(id =>
    categories.flatMap(category => category.groups.flatMap(group =>
      group.items.filter(dish => dish.id === id && dish.id !== item.id).map(dish => ({ categoryId: category.id, dish })),
    )),
  );
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
      {dishes.length > 0 && (
        <div className="seasonal-dishes">
          {dishes.map(({ categoryId, dish }) => (
            <article className="seasonal-dish" key={dish.id}>
              {dish.image && <div className="seasonal-dish-photo">
                <Photo
                  src={dish.id === "pumpkin-soup" && dish.image === "/images/menu/pumpkin-soup.jpg" ? "/images/pumpkin-soup-seasonal.webp" : dish.image}
                  alt={dish.name}
                  sizes="(max-width: 640px) 90vw, (max-width: 1023px) 38vw, 280px"
                />
              </div>}
              <div className="seasonal-dish-copy">
                <h3>{dish.name}</h3>
                {dish.description && <p>{dish.description}</p>}
                <div className="seasonal-dish-meta">
                  <div><small>{dish.size}</small><span>{formatPrice(dish.price)}</span></div>
                  <CircleArrowButton label={`Смотреть в меню: ${dish.name}`} href={`/menu#${categoryId}`} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
