import CategoryCarousel from "./CategoryCarousel";
import Eyebrow from "@/components/ui/Eyebrow";
export default function MoodSection() {
  return (
    <section className="mood-section container" aria-labelledby="mood-title">
      <div className="mood-heading">
        <Eyebrow>МЕНЮ</Eyebrow>
        <h2 id="mood-title">
          Выберите
          <br />
          настроение
        </h2>
      </div>
      <CategoryCarousel />
    </section>
  );
}
