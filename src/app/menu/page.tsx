import type { Metadata } from "next";
import { menu } from "@/data/menu";
import MenuHero from "@/components/menu/MenuHero";
import MenuExplorer from "@/components/menu/MenuExplorer";
import Disclaimer from "@/components/menu/Disclaimer";
export const metadata: Metadata = {
  title: "Меню",
  description:
    "Завтраки, авторский кофе, десерты и основное меню Choco Dips в Нальчике. Состав, объёмы и цены.",
  alternates: { canonical: "/menu" },
  openGraph: {
    title: "Меню — Choco Dips",
    description: "Завтраки, кофе и десерты в центре Нальчика.",
    url: "/menu",
  },
};
export default function MenuPage() {
  return (
    <div className="menu-catalog">
      <MenuHero />
      <MenuExplorer categories={menu} />
      <div className="container menu-bottom-note">
        <Disclaimer />
      </div>
    </div>
  );
}
