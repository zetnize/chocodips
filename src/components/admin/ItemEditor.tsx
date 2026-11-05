import type { MenuCategory, MenuItem, MenuTag } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import ImageField from "./ImageField";

const tags: [MenuTag, string][] = [["hit", "Хит"], ["new", "Новинка"], ["veg", "Вегетарианское"], ["spicy", "Острое"]];

export default function ItemEditor({ item, category, groupId, categories, images, onChange, onMove, onClose }: {
  item: MenuItem; category: MenuCategory; groupId: string; categories: MenuCategory[]; images: string[];
  onChange: (patch: Partial<MenuItem>) => void; onMove: (categoryId: string, groupId: string) => void; onClose: () => void;
}) {
  return (
    <Modal className="admin-dialog" labelledBy="item-editor-title" onClose={onClose}>
      <div className="admin-editor-heading"><p>Карточка блюда</p><h2 id="item-editor-title">{item.name || "Новое блюдо"}</h2></div>
      <div className="admin-fields">
        <label>Название<input value={item.name} maxLength={150} onChange={e => onChange({ name: e.target.value })} /></label>
        <div className="admin-field-row">
          <label>Вес / объём<input value={item.size} placeholder="220 г" maxLength={100} onChange={e => onChange({ size: e.target.value })} /></label>
          <label>Цена, ₽<input type="number" min="0" max="1000000" step="0.01" value={Array.isArray(item.price) ? item.price[0] : item.price} onChange={e => onChange({ price: Array.isArray(item.price) ? [Number(e.target.value), item.price[1]] : Number(e.target.value) })} /></label>
        </div>
        <label className="admin-check"><input type="checkbox" checked={Array.isArray(item.price)} onChange={e => onChange({ price: e.target.checked ? [typeof item.price === "number" ? item.price : item.price[0], 0] : Array.isArray(item.price) ? item.price[0] : item.price })} />Две цены для разных размеров</label>
        {Array.isArray(item.price) && <label>Цена второго размера, ₽<input type="number" min="0" max="1000000" step="0.01" value={item.price[1]} onChange={e => onChange({ price: [Array.isArray(item.price) ? item.price[0] : item.price, Number(e.target.value)] })} /><small>Укажите оба размера через / в поле веса или объёма.</small></label>}
        <label>Описание<textarea rows={3} value={item.description ?? ""} maxLength={2000} onChange={e => onChange({ description: e.target.value })} /></label>
        <label>Состав<textarea rows={3} value={item.composition ?? ""} maxLength={2000} onChange={e => onChange({ composition: e.target.value })} /></label>
        <label>Аллергены<input value={(item.allergens ?? []).join(",")} placeholder="молоко, яйца, глютен" onChange={e => onChange({ allergens: e.target.value.split(",") })} /><small>Разделяйте запятыми.</small></label>
        <fieldset className="admin-tag-fields"><legend>Отметки</legend>{tags.map(([tag, title]) => <label className="admin-check" key={tag}><input type="checkbox" checked={item.tags?.includes(tag) ?? false} onChange={e => onChange({ tags: e.target.checked ? [...(item.tags ?? []), tag] : item.tags?.filter(value => value !== tag) })} />{title}</label>)}</fieldset>
        <label className="admin-check"><input type="checkbox" checked={!item.hidden} onChange={e => onChange({ hidden: !e.target.checked })} />Показывать в меню</label>
        <label className="admin-check"><input type="checkbox" checked={item.seasonal ?? false} onChange={e => onChange({ seasonal: e.target.checked })} />В сезонном баннере на главной</label>
        <small>Выбор заменит прежнее блюдо в баннере. Нужна фотография.</small>
        <div className="admin-field-row">
          <label>Категория<select value={category.id} onChange={e => { const next = categories.find(value => value.id === e.target.value); if (next?.groups[0]) onMove(next.id, next.groups[0].id); }}>{categories.filter(value => value.groups.length > 0).map(value => <option key={value.id} value={value.id}>{value.title}</option>)}</select></label>
          <label>Группа<select value={groupId} onChange={e => onMove(category.id, e.target.value)}>{category.groups.map(value => <option value={value.id} key={value.id}>{value.title || "Без названия"}</option>)}</select></label>
        </div>
        <ImageField value={item.image} onChange={image => onChange({ image: image || undefined })} images={images} optional />
      </div>
      <div className="admin-editor-bottom"><button className="admin-primary" onClick={onClose}>Готово</button><small>Затем нажмите «Сохранить изменения».</small></div>
    </Modal>
  );
}
