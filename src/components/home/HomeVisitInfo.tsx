import Link from "next/link";
import { site } from "@/data/site";
import { routeUrl } from "@/lib/config";
import { publicMenu } from "@/lib/menu-store";
import { ArrowIcon } from "@/components/ui/icons";

export default async function HomeVisitInfo() {
  const breakfast = (await publicMenu()).find(category => category.id === "breakfast");
  return (
    <div className="home-visit-band">
    <section className="home-visit container" aria-labelledby="visit-title">
      <h2 id="visit-title">Перед визитом</h2>
      <div className="home-visit-questions">
        <details name="visit-questions">
          <summary>Во сколько открываетесь?<span aria-hidden="true" /></summary>
          <div className="home-visit-answer">
            <p>Ждём вас каждый день, {site.hours}. {site.kitchen}.</p>
          </div>
        </details>
        <details name="visit-questions">
          <summary>{breakfast?.availability ? "Когда можно позавтракать?" : "Где посмотреть меню?"}<span aria-hidden="true" /></summary>
          <div className="home-visit-answer">
            {breakfast?.availability
              ? <p>Завтраки подаём {breakfast.availability}. Выберите, с чего начнётся ваше утро.</p>
              : <p>Блюда, напитки, размеры порций и актуальные цены собраны в нашем меню.</p>}
            <Link href={breakfast?.availability ? `/menu#${breakfast.id}` : "/menu"}>
              {breakfast?.availability ? "Посмотреть завтраки" : "Открыть меню"}<ArrowIcon />
            </Link>
          </div>
        </details>
        <details name="visit-questions">
          <summary>Как вас найти?<span aria-hidden="true" /></summary>
          <div className="home-visit-answer">
            <p>{site.address}.</p>
            <a href={routeUrl} target="_blank" rel="noopener noreferrer">Построить маршрут<ArrowIcon /></a>
          </div>
        </details>
      </div>
    </section>
    </div>
  );
}
