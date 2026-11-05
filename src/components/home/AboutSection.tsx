import { ArrowIcon } from "@/components/ui/icons";
import { routeUrl } from "@/lib/config";

export default function AboutSection() {
  return (
    <section className="cafe-postcard container" id="about" aria-labelledby="postcard-title">
        <div className="cafe-postcard-caption">
          <div>
            <p>Choco Dips · Нальчик</p>
            <h2 id="postcard-title">На Пушкина, 85а</h2>
          </div>
          <a href={routeUrl} target="_blank" rel="noopener noreferrer">
            Как добраться <ArrowIcon />
          </a>
        </div>
    </section>
  );
}
