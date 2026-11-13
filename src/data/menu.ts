import type { MenuCategory } from "@/lib/types";

export const menu: MenuCategory[] = [
  {
    "id": "breakfast",
    "title": "Завтраки",
    "availability": "с 10:00 до 14:00",
    "image": "/images/cat-breakfast.jpg",
    "groups": []
  },
  {
    "id": "coffee",
    "title": "Кофе",
    "image": "/images/cat-coffee.jpg",
    "groups": []
  },
  {
    "id": "desserts",
    "title": "Десерты",
    "image": "/images/cat-desserts.jpg",
    "groups": []
  },
  {
    "id": "main",
    "title": "Основное",
    "availability": "кухня до 22:15",
    "image": "/images/cat-main.jpg",
    "groups": []
  },
  {
    "id": "drinks",
    "title": "Напитки",
    "image": "/images/hero-2.jpg",
    "groups": []
  },
  {
    "id": "seasonal",
    "title": "Сезонное",
    "availability": "согреваем этой осенью",
    "image": "/images/seasonal-apple.jpg",
    "groups": []
  }
];
