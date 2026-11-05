import Eyebrow from "@/components/ui/Eyebrow";
import Photo from "@/components/ui/Photo";
import CircleArrowButton from "@/components/ui/CircleArrowButton";
import Reveal from "@/components/ui/Reveal";
import Wave from "@/components/ui/Wave";
export default function AboutSection() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="about-visual">
        <Reveal className="about-photo-reveal">
          <Photo
            src="/images/about-interior.jpg"
            alt="Солнечный зал кофейни: деревянные столы, коричневые кресла и цветы у больших окон"
            sizes="(max-width: 1023px) 100vw, 55vw"
          />
        </Reveal>
        <Wave variant="soft" flip />
      </div>
      <Reveal className="about-copy" delay={100}>
        <Eyebrow>О НАС</Eyebrow>
        <h2 id="about-title">
          Больше,
          <br />
          чем кофе
        </h2>
        <div className="about-text">
          <p>
            Уютное место в центре Нальчика для встреч, работы и маленьких
            удовольствий.
          </p>
          <CircleArrowButton
            label="Контакты кофейни"
            href="/#contacts"
          />
        </div>
      </Reveal>
    </section>
  );
}
