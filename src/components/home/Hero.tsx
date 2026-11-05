import ChocolateButton from "@/components/ui/ChocolateButton";
import IntroHero from "./IntroHero";
import HeroDishGallery from "./HeroDishGallery";
export default function Hero() {
  return (
    <IntroHero menuAction={<ChocolateButton />} gallery={<HeroDishGallery />} />
  );
}
