import Photo from "@/components/ui/Photo";
import { ArrowIcon } from "@/components/ui/icons";
import { routeUrl } from "@/lib/config";

export default function AboutSection() {
  return (
    <section className="cafe-postcard container" id="about" aria-labelledby="postcard-title">
      <figure>
        <div className="cafe-postcard-image">
          <Photo
            src="/images/about-interior.jpg"
            alt="Зал Choco Dips с деревянными столами и креслами у больших окон"
            sizes="(max-width: 1439px) 90vw, 1320px"
          />
        </div>
        <figcaption className="cafe-postcard-caption">
          <div>
            <p>Choco Dips · Нальчик</p>
            <h2 id="postcard-title">На Пушкина, 85а</h2>
          </div>
          <a href={routeUrl} target="_blank" rel="noopener noreferrer">
            Как добраться <ArrowIcon />
          </a>
        </figcaption>
      </figure>
    </section>
  );
}
