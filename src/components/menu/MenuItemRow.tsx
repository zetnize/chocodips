import type { MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import Tags from "./Tags";
export default function MenuItemRow({
  item,
  onSelect,
}: {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}) {
  return (
    <button
      className="menu-item menu-item-row"
      onClick={() => onSelect(item)}
      aria-haspopup="dialog"
    >
      <span className="menu-item-copy">
        <span className="menu-item-name">
          {item.name}
          <Tags tags={item.tags} />
        </span>
        {item.description && (
          <span className="menu-item-description">{item.description}</span>
        )}
        <span className="menu-item-meta">
          <span>{item.size}</span>
          <strong>{formatPrice(item.price)}</strong>
        </span>
      </span>
    </button>
  );
}
