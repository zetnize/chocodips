import Hero from "@/components/home/Hero";
import MoodSection from "@/components/home/MoodSection";
import SeasonalBanner from "@/components/home/SeasonalBanner";
import AboutSection from "@/components/home/AboutSection";
import Wave from "@/components/ui/Wave";
export default function HomePage() {
  return (
    <>
      <Hero />
      <MoodSection />
      <div className="chocolate-chapter">
        <div className="chocolate-chapter-wave" aria-hidden="true">
          <Wave variant="chocolate" fill="var(--chocolate-chapter)" />
        </div>
        <SeasonalBanner />
        <AboutSection />
        <div className="chocolate-chapter-wave chocolate-chapter-wave-end" aria-hidden="true">
          <Wave variant="soft" fill="var(--chocolate-chapter)" flip />
        </div>
      </div>
    </>
  );
}
