"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { MenuCategory, MenuItem } from "@/lib/types";
import { formatPrice, normalizeSearch } from "@/lib/format";
import ItemEditor from "./ItemEditor";
import CategoryEditor, { moveEntry, OrderButtons } from "./CategoryEditor";

type MenuDocument = { categories: MenuCategory[]; revision: number };

export default function AdminPanel({ initial, images }: { initial: MenuDocument; images: string[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initial.categories);
  const [revision, setRevision] = useState(initial.revision);
  const [saved, setSaved] = useState(JSON.stringify(initial.categories));
  const [activeId, setActiveId] = useState(initial.categories[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [settings, setSettings] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const dirty = JSON.stringify(categories) !== saved;
  const active = categories.find(category => category.id === activeId);
  const selected = categories.flatMap(category => category.groups.flatMap(group => group.items.map(item => ({ category, group, item })))).find(value => value.item.id === selectedId);
  const search = normalizeSearch(query.trim());
  const visibleCategories = search ? categories : active ? [active] : [];

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function edit(change: (draft: MenuCategory[]) => void) {
    setCategories(previous => { const draft = structuredClone(previous); change(draft); return draft; });
    setMessage("");
    setError("");
  }

  function updateItem(id: string, patch: Partial<MenuItem>) {
    edit(draft => {
      for (const category of draft) for (const group of category.groups) for (const item of group.items) {
        if (patch.seasonal) item.seasonal = false;
        if (item.id === id) Object.assign(item, patch);
      }
    });
  }

  async function save() {
    setBusy(true);
    setError("");
    setMessage("");
    const snapshot = JSON.stringify(categories);
    const clean: MenuCategory[] = JSON.parse(snapshot);
    for (const category of clean) for (const group of category.groups) for (const item of group.items) {
      if (item.allergens) item.allergens = item.allergens.map(value => value.trim()).filter(Boolean);
    }
    try {
      const response = await fetch("/api/admin/menu", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ categories: clean, revision }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setRevision(result.revision);
      setSaved(snapshot);
      setMessage("Изменения сохранены и доступны на сайте.");
    } catch (error) { setError(error instanceof Error ? error.message : "Нет связи с сервером. Изменения остались в редакторе."); }
    finally { setBusy(false); }
  }

  async function logout() {
    if (dirty && !confirm("Выйти и потерять несохранённые изменения?")) return;
    try {
      const response = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) });
      if (!response.ok) throw new Error("Не удалось выйти.");
      router.refresh();
    } catch { setError("Не удалось выйти. Повторите попытку."); }
  }

  function addCategory() {
    const id = `category-${crypto.randomUUID()}`;
    edit(draft => draft.push({ id, title: "Новая категория", image: "/images/cat-breakfast.jpg", layout: "cards", groups: [{ id: `group-${crypto.randomUUID()}`, items: [] }] }));
    setActiveId(id);
    setQuery("");
    setSettings(true);
  }

  function addItem(groupId?: string) {
    if (!active) return;
    const id = `item-${crypto.randomUUID()}`;
    edit(draft => {
      const category = draft.find(value => value.id === active.id)!;
      if (!category.groups.length) category.groups.push({ id: `group-${crypto.randomUUID()}`, items: [] });
      const group = category.groups.find(value => value.id === groupId) ?? category.groups[0];
      group.items.push({ id, name: "Новое блюдо", size: "1 порция", price: 0 });
    });
    setSelectedId(id);
  }

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <a href="/" target="_blank" rel="noopener noreferrer" className="admin-brand">Choco Dips <span> / Меню</span></a>
        <div className="admin-top-actions"><a href="/menu" target="_blank" rel="noopener noreferrer">Посмотреть меню ↗</a><button onClick={logout}>Выйти</button></div>
      </header>
      <div className="admin-workspace">
        <aside className="admin-sidebar"><p className="admin-sidebar-label">Категории</p><nav aria-label="Категории меню">
          {categories.map((category, index) => <div className={`admin-category-link ${category.id === activeId ? "is-active" : ""}`} key={category.id}>
            <button aria-current={category.id === activeId ? "true" : undefined} onClick={() => { setActiveId(category.id); setQuery(""); }}><span>{category.title || "Без названия"}{category.hidden && <small>Скрыта</small>}</span><span>{category.groups.reduce((sum, group) => sum + group.items.length, 0)}</span></button>
            <OrderButtons index={index} length={categories.length} label={category.title} onMove={direction => edit(draft => moveEntry(draft, index, direction))} />
          </div>)}
        </nav><button className="admin-text-button" onClick={addCategory}>+ Добавить категорию</button></aside>
        <div className="admin-main">
          <div className="admin-page-heading"><div><p>Управление меню</p><h1>{search ? "Результаты поиска" : active?.title || "Ваше меню"}</h1></div><div className="admin-save-area"><span>{dirty ? "Есть несохранённые изменения" : "Всё сохранено"}</span><button className="admin-primary" onClick={save} disabled={!dirty || busy}>{busy ? "Сохраняем…" : "Сохранить изменения"}</button></div></div>
          <div className="admin-feedback" aria-live="polite">{error ? <p role="alert" className="admin-error">{error}</p> : message && <p>{message}</p>}</div>
          <div className="admin-toolbar"><label className="admin-search"><span className="sr-only">Поиск по всему меню</span><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Найти блюдо во всём меню" /></label><div>{active && <><button onClick={() => setSettings(true)}>Настройки категории</button><button className="admin-primary" onClick={() => addItem()}>+ Блюдо</button></>}</div></div>
          {!categories.length && <div className="admin-empty"><h2>Добавьте первую категорию</h2><p>Внутри неё можно создать блюда и добавки.</p><button className="admin-primary" onClick={addCategory}>Добавить категорию</button></div>}
          {visibleCategories.map(category => <section key={category.id}>
            {search && <h2 className="admin-result-category">{category.title}</h2>}
            {category.groups.map(group => {
              const items = group.items.filter(item => !search || normalizeSearch(`${item.name} ${item.description ?? ""} ${item.composition ?? ""}`).includes(search));
              if (search && !items.length) return null;
              return <div className="admin-item-group" key={group.id}><div className="admin-group-heading"><h2>{group.title || "Блюда"}<span>{items.length}</span></h2>{!search && <button onClick={() => addItem(group.id)}>+ Добавить</button>}</div>
                <div className="admin-table-heading"><span>Название</span><span>Цена</span><span>В меню</span><span>Порядок / действия</span></div>
                {items.map(item => <div className="admin-item-row" key={item.id}>
                  <button className="admin-item-name" onClick={() => setSelectedId(item.id)}>{item.image ? <Image src={item.image} alt="" width={48} height={48} unoptimized /> : <span className="admin-photo-placeholder" aria-hidden="true" />}<span><strong>{item.name || "Без названия"}</strong><small>{item.size}{item.seasonal ? " · На главной" : ""}</small></span></button>
                  <button className="admin-item-price" aria-label={`Редактировать цену ${item.name}`} onClick={() => setSelectedId(item.id)}>{formatPrice(item.price)}</button>
                  <label className="admin-visibility"><input type="checkbox" checked={!item.hidden} aria-label={`Показывать ${item.name}`} onChange={e => updateItem(item.id, { hidden: !e.target.checked })} /><span>{item.hidden ? "Скрыто" : "В меню"}</span></label>
                  <div className="admin-row-actions"><OrderButtons index={group.items.findIndex(value => value.id === item.id)} length={group.items.length} label={item.name} onMove={direction => edit(draft => moveEntry(draft.find(value => value.id === category.id)!.groups.find(value => value.id === group.id)!.items, group.items.findIndex(value => value.id === item.id), direction))} />
                    <button aria-label={`Копировать ${item.name}`} title="Копировать" onClick={() => { const id = `item-${crypto.randomUUID()}`; edit(draft => { draft.find(value => value.id === category.id)!.groups.find(value => value.id === group.id)!.items.push({ ...structuredClone(item), id, name: `${item.name} — копия`, seasonal: false, hidden: true }); }); setSelectedId(id); }}>⧉</button>
                    <button aria-label={`Удалить ${item.name}`} title="Удалить" onClick={() => { if (confirm(`Удалить «${item.name}»? Изменение вступит в силу после сохранения.`)) edit(draft => { const target = draft.find(value => value.id === category.id)!.groups.find(value => value.id === group.id)!; target.items = target.items.filter(value => value.id !== item.id); }); }}>×</button>
                  </div>
                </div>)}
                {!items.length && <p className="admin-empty-group">Пока нет блюд. Добавьте первую позицию.</p>}
              </div>;
            })}
            {!category.groups.length && !search && <div className="admin-empty"><p>В категории пока нет блюд.</p><button onClick={() => addItem()}>Добавить блюдо</button></div>}
          </section>)}
          {search && !categories.some(category => category.groups.some(group => group.items.some(item => normalizeSearch(`${item.name} ${item.description ?? ""} ${item.composition ?? ""}`).includes(search)))) && <div className="admin-empty"><h2>Ничего не найдено</h2><p>Попробуйте другое название или очистите поиск.</p></div>}
        </div>
      </div>
      {selected && <ItemEditor item={selected.item} category={selected.category} groupId={selected.group.id} categories={categories} images={images} onChange={patch => updateItem(selected.item.id, patch)} onClose={() => setSelectedId(null)} onMove={(categoryId, groupId) => {
        setActiveId(categoryId);
        edit(draft => {
        const source = draft.find(value => value.id === selected.category.id)!.groups.find(value => value.id === selected.group.id)!;
        const destination = draft.find(value => value.id === categoryId)!.groups.find(value => value.id === groupId)!;
        const index = source.items.findIndex(value => value.id === selected.item.id);
        const [item] = source.items.splice(index, 1);
        destination.items.push(item);
        });
      }} />}
      {settings && active && <CategoryEditor category={active} images={images} edit={change => edit(draft => {
        const category = draft.find(value => value.id === active.id);
        if (category) change(category);
      })} onClose={() => setSettings(false)} onDelete={() => {
        if (!confirm(`Удалить категорию «${active.title}» со всеми блюдами и добавками? Изменение вступит в силу после сохранения.`)) return;
        edit(draft => { draft.splice(draft.findIndex(value => value.id === active.id), 1); });
        setActiveId(categories.find(value => value.id !== active.id)?.id ?? "");
        setSettings(false);
      }} />}
    </div>
  );
}
