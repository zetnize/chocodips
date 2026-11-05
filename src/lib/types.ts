export type CategoryId = string;
export type MenuTag = "hit" | "new" | "veg" | "spicy";
export interface MenuItem {
  hidden?: boolean;
  id: string;
  name: string;
  description?: string;
  composition?: string;
  size: string;
  price: number | [number, number];
  tags?: MenuTag[];
  image?: string;
  allergens?: string[];
  seasonal?: boolean;
}
export interface AddOn {
  id: string;
  name: string;
  size: string;
  price: number;
}
export interface MenuGroup {
  id: string;
  title?: string;
  items: MenuItem[];
}
export interface MenuCategory {
  hidden?: boolean;
  layout?: "cards" | "rows";
  id: CategoryId;
  title: string;
  availability?: string;
  image: string;
  groups: MenuGroup[];
  addOns?: AddOn[];
}
export interface GalleryPhoto {
  src: string;
  alt: string;
}
export interface Lead {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  consent: boolean;
  website: string;
}
export type LeadErrors = Partial<Record<keyof Lead, string>>;
