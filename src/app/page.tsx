import Hero from "@/components/home/Hero";
import MoodSection from "@/components/home/MoodSection";
import SeasonalBanner from "@/components/home/SeasonalBanner";
import AboutSection from "@/components/home/AboutSection";
export default function HomePage() {
  return (
    <>
      <Hero />
      <MoodSection />
      <SeasonalBanner />
      <AboutSection />
    </>
  );
}
