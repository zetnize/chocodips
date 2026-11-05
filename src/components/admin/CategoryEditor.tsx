import type { MenuCategory } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import ImageField from "./ImageField";

export function moveEntry<T>(entries: T[], index: number, direction: number) {
  const target = index + direction;
  if (target < 0 || target >= entries.length) return;
  [entries[index], entries[target]] = [entries[target], entries[index]];
}

export function OrderButtons({ index, length, onMove, label }: { index: number; length: number; onMove: (direction: number) => void; label: string }) {
  return <span className="admin-order"><button disabled={index === 0} aria-label={`${label} — выше`} onClick={() => onMove(-1)}>↑</button><button disabled={index === length - 1} aria-label={`${label} — ниже`} onClick={() => onMove(1)}>↓</button></span>;
}

export default function CategoryEditor({ category, images, edit, onClose, onDelete }: {
  category: MenuCategory; images: string[]; edit: (change: (category: MenuCategory) => void) => void; onClose: () => void; onDelete: () => void;
}) {
  return (
    <Modal className="admin-dialog" labelledBy="category-editor-title" onClose={onClose}>
      <div className="admin-editor-heading"><p>Настройки категории</p><h2 id="category-editor-title">{category.title || "Новая категория"}</h2></div>
      <div className="admin-fields">
        <label>Название<input value={category.title} maxLength={100} onChange={e => edit(value => { value.title = e.target.value; })} /></label>
        <label>Время подачи<input value={category.availability ?? ""} placeholder="с 10:00 до 14:00" maxLength={150} onChange={e => edit(value => { value.availability = e.target.value; })} /></label>
        <label>Вид позиций<select value={category.layout ?? (["breakfast", "desserts", "main"].includes(category.id) ? "cards" : "rows")} onChange={e => edit(value => { value.layout = e.target.value as "cards" | "rows"; })}><option value="cards">Карточки с фотографиями</option><option value="rows">Компактный список</option></select></label>
        <label className="admin-check"><input type="checkbox" checked={!category.hidden} onChange={e => edit(value => { value.hidden = !e.target.checked; })} />Показывать категорию</label>
        <ImageField value={category.image} images={images} onChange={image => edit(value => { value.image = image; })} />
        <section className="admin-settings-section"><h3>Группы блюд</h3>
          {category.groups.map((group, index) => <div className="admin-settings-row" key={group.id}>
            <input aria-label={`Название группы ${index + 1}`} value={group.title ?? ""} placeholder="Без названия" onChange={e => edit(value => { value.groups[index].title = e.target.value; })} />
            <OrderButtons index={index} length={category.groups.length} label={group.title || "Группа"} onMove={direction => edit(value => moveEntry(value.groups, index, direction))} />
            <button aria-label={`Удалить группу ${group.title || index + 1}`} onClick={() => { if (confirm(`Удалить группу и все её блюда (${group.items.length})? Изменение вступит в силу после сохранения.`)) edit(value => { value.groups.splice(index, 1); }); }}>×</button>
          </div>)}
          <button className="admin-text-button" onClick={() => edit(value => { value.groups.push({ id: `group-${crypto.randomUUID()}`, title: "Новая группа", items: [] }); })}>+ Добавить группу</button>
        </section>
        <section className="admin-settings-section"><h3>Добавки</h3>
          {category.addOns?.map((addon, index) => <div className="admin-addon-row" key={addon.id}>
            <input aria-label={`Название добавки ${index + 1}`} placeholder="Название" value={addon.name} onChange={e => edit(value => { value.addOns![index].name = e.target.value; })} />
            <input aria-label={`Вес добавки ${index + 1}`} placeholder="Вес" value={addon.size} onChange={e => edit(value => { value.addOns![index].size = e.target.value; })} />
            <input aria-label={`Цена добавки ${index + 1}`} type="number" min="0" step="0.01" placeholder="₽" value={addon.price} onChange={e => edit(value => { value.addOns![index].price = Number(e.target.value); })} />
            <OrderButtons index={index} length={category.addOns?.length ?? 0} label={addon.name || "Добавка"} onMove={direction => edit(value => moveEntry(value.addOns!, index, direction))} />
            <button aria-label={`Удалить добавку ${addon.name}`} onClick={() => { if (confirm("Удалить добавку?")) edit(value => { value.addOns!.splice(index, 1); }); }}>×</button>
          </div>)}
          <button className="admin-text-button" onClick={() => edit(value => { value.addOns ??= []; value.addOns.push({ id: `addon-${crypto.randomUUID()}`, name: "Новая добавка", size: "1 порция", price: 0 }); })}>+ Добавить добавку</button>
        </section>
        <button className="admin-danger" onClick={onDelete}>Удалить категорию</button>
      </div>
      <div className="admin-editor-bottom"><button className="admin-primary" onClick={onClose}>Готово</button><small>Затем нажмите «Сохранить изменения».</small></div>
    </Modal>
  );
}
