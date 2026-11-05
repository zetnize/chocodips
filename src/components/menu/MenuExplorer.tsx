"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { normalizeSearch } from "@/lib/format";
import type { MenuCategory, MenuItem } from "@/lib/types";
import MenuSearch from "./MenuSearch";
import MenuSection from "./MenuSection";
const MenuItemModal = dynamic(() => import("./MenuItemModal"), { ssr: false });
export default function MenuExplorer({
  categories,
}: {
  categories: MenuCategory[];
}) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const close = useCallback(() => setSelected(null), []);
  useEffect(() => {
    let frame = 0;
    const navigate = (event: Event) => {
      if (
        !(event instanceof CustomEvent) ||
        typeof event.detail !== "string" ||
        !categories.some((category) => category.id === event.detail)
      )
        return;
      const id: string = event.detail;
      setQuery("");
      setDebounced("");
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const target = document.getElementById(id);
        if (!target) return;
        history.replaceState(null, "", `#${id}`);
        target.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
          block: "start",
        });
      });
    };
    window.addEventListener("menu-category-navigation", navigate);
    return () => {
      window.removeEventListener("menu-category-navigation", navigate);
      cancelAnimationFrame(frame);
    };
  }, [categories]);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), 150);
    return () => clearTimeout(timer);
  }, [query]);
  const filtered = useMemo(() => {
    const search = normalizeSearch(debounced);
    return !search
      ? categories
      : categories
          .map((category) => ({
            ...category,
            groups: category.groups
              .map((group) => ({
                ...group,
                items: group.items.filter((item) =>
                  normalizeSearch(
                    `${item.name} ${item.description || ""} ${item.composition || ""}`,
                  ).includes(search),
                ),
              }))
              .filter((group) => group.items.length),
            addOns: undefined,
          }))
          .filter((category) => category.groups.length);
  }, [categories, debounced]);
  const count = filtered.reduce(
    (total, category) =>
      total +
      category.groups.reduce((sum, group) => sum + group.items.length, 0),
    0,
  );
  return (
    <>
      <div className="container menu-body">
        <div className="menu-tools">
          <MenuSearch value={query} onChange={setQuery} />
        </div>
        <div role="status" className="sr-only">
          {debounced ? `Найдено позиций: ${count}` : "Показано всё меню"}
        </div>
        {filtered.length ? (
          filtered.map((category) => (
            <MenuSection
              key={category.id}
              category={category}
              onSelect={setSelected}
            />
          ))
        ) : (
          <div className="menu-empty">
            <h2>Ничего не нашлось.</h2>
            <p>Попробуйте другой запрос</p>
            <button className="pill solid-ink" onClick={() => setQuery("")}>
              Показать всё меню
            </button>
          </div>
        )}
      </div>
      {selected && <MenuItemModal item={selected} onClose={close} />}
    </>
  );
}
