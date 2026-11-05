import type { GalleryPhoto } from "@/lib/types";
export const site = {
  name: "Choco Dips",
  city: "Нальчик",
  address: "Нальчик, ул. Пушкина, 85а",
  hours: "10:00 – 23:00",
  kitchen: "Кухня до 22:15",
  phone: "",
  socials: { instagram: "https://www.instagram.com/chocodips.ru/" },
  navigation: [
    { href: "/menu", label: "Меню" },
    { href: "/#about", label: "О нас" },
    { href: "/#contacts", label: "Контакты" },
  ],
};
export const menuNavigation = [
  { href: "/menu#breakfast", label: "Завтраки" },
  { href: "/menu#coffee", label: "Кофе" },
  { href: "/menu#desserts", label: "Десерты" },
  { href: "/menu#main", label: "Основное" },
  { href: "/menu#drinks", label: "Напитки" },
  { href: "/menu#seasonal", label: "Сезонное" },
];
export const gallery: GalleryPhoto[] = [
  {
    src: "/images/gallery-1.jpg",
    alt: "Девушка за столиком с бургером и ягодным напитком",
  },
  {
    src: "/images/gallery-2.jpg",
    alt: "Десерт со сливками и крамблом в карамельном соусе",
  },
  {
    src: "/images/gallery-3.jpg",
    alt: "Стеклянная дверь кофейни с логотипом и зелёными растениями",
  },
  {
    src: "/images/gallery-4.jpg",
    alt: "Латте-арт в оранжевых стаканах Choco Dips",
  },
  {
    src: "/images/gallery-5.jpg",
    alt: "Гостья в солнцезащитных очках с подносом десертов",
  },
];
