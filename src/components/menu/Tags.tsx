import type { MenuTag } from "@/lib/types";
const labels: Record<MenuTag, string> = {
  hit: "хит",
  new: "новинка",
  veg: "V",
  spicy: "острое",
};
export default function Tags({ tags }: { tags?: MenuTag[] }) {
  return tags?.length ? (
    <span className="menu-tags">
      {tags.map((tag) => (
        <span
          key={tag}
          className={`menu-tag tag-${tag}`}
          title={tag === "veg" ? "Вегетарианское блюдо" : undefined}
        >
          {labels[tag]}
        </span>
      ))}
    </span>
  ) : null;
}
