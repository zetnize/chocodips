import type { MenuCategory, MenuItem } from "@/lib/types";
import MenuItemCard from "./MenuItemCard";
import MenuItemRow from "./MenuItemRow";
import AddOns from "./AddOns";
export default function MenuSection({
  category,
  onSelect,
}: {
  category: MenuCategory;
  onSelect: (item: MenuItem) => void;
}) {
  const useCards = category.layout ? category.layout === "cards" : ["breakfast", "desserts", "main"].includes(category.id);
  return (
    <section
      className="menu-section"
      id={category.id}
      aria-labelledby={`${category.id}-title`}
    >
      <div className="menu-section-heading">
        <h2 id={`${category.id}-title`}>{category.title}</h2>
        {category.availability && (
          <p className="menu-availability">{category.availability}</p>
        )}
      </div>
      {category.groups.map((group) => (
        <div className="menu-group" key={group.id}>
          {group.title && <h3 className="menu-group-title">{group.title}</h3>}
          <div
            className={`menu-items ${useCards ? "menu-card-grid" : "menu-row-grid"}`}
          >
            {group.items.map((item) =>
              useCards ? (
                <MenuItemCard key={item.id} item={item} onSelect={onSelect} />
              ) : (
                <MenuItemRow key={item.id} item={item} onSelect={onSelect} />
              ),
            )}
          </div>
        </div>
      ))}
      {category.addOns && <AddOns items={category.addOns} />}
    </section>
  );
}
