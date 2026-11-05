"use client";
import Modal from "@/components/ui/Modal";
import Photo from "@/components/ui/Photo";
import Eyebrow from "@/components/ui/Eyebrow";
import Tags from "./Tags";
import { formatPrice } from "@/lib/format";
import type { MenuItem } from "@/lib/types";
export default function MenuItemModal({
  item,
  onClose,
}: {
  item: MenuItem;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose} labelledBy="dish-title" className="dish-backdrop">
      {item.image && (
        <div className="dish-photo">
          <Photo
            src={item.image}
            alt={item.name}
            sizes="(max-width: 767px) 95vw, 620px"
          />
        </div>
      )}
      <div className="dish-content">
        <Eyebrow>МЕНЮ CHOCO DIPS</Eyebrow>
        <h2 id="dish-title">{item.name}</h2>
        <Tags tags={item.tags} />
        {item.description && <p>{item.description}</p>}
        {item.composition && (
          <div className="dish-composition">
            <h3>Состав</h3>
            <p>{item.composition}</p>
          </div>
        )}
        <div className="dish-meta">
          <span>{item.size}</span>
          <strong>{formatPrice(item.price)}</strong>
        </div>
        <p className="allergens">
          {item.allergens?.length
            ? `Аллергены: ${item.allergens.join(", ")}.`
            : "Если у вас есть аллергия, уточните состав у официанта."}
        </p>
      </div>
    </Modal>
  );
}
