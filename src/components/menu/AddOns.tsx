import type { AddOn } from "@/lib/types";
import { formatPrice } from "@/lib/format";
export default function AddOns({ items }: { items: AddOn[] }) {
  return (
    <div className="add-ons">
      <h3>+ можем добавить</h3>
      <dl>
        {items.map((item) => (
          <div key={item.id}>
            <dt>
              {item.name}
              <span>{item.size}</span>
            </dt>
            <dd>{formatPrice(item.price)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
