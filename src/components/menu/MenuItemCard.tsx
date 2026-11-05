import Photo from "@/components/ui/Photo";
import type { MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import Tags from "./Tags";
export default function MenuItemCard({
  item,
  onSelect,
}: {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}) {
  return (
    <button
      className="menu-item menu-item-card"
      onClick={() => onSelect(item)}
      aria-haspopup="dialog"
    >
      <span className="menu-item-photo">
        {item.image && <Photo
          src={item.image}
          alt=""
          sizes="(max-width: 767px) 44vw, (max-width: 1023px) 28vw, 280px"
        />}
      </span>
      <span className="menu-item-copy">
        <span className="menu-item-name">
          {item.name}
          <Tags tags={item.tags} />
        </span>
        <span className="menu-item-meta">
          <span>{item.size}</span>
          <strong>{formatPrice(item.price)}</strong>
        </span>
      </span>
    </button>
  );
}
