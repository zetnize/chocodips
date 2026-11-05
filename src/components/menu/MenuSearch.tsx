import { CloseIcon, SearchIcon } from "@/components/ui/icons";
export default function MenuSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="menu-search">
      <SearchIcon />
      <label htmlFor="menu-search" className="sr-only">
        Найти блюдо или ингредиент
      </label>
      <input
        id="menu-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Найти блюдо или ингредиент"
        autoComplete="off"
      />
      {value && (
        <button
          className="icon-button"
          aria-label="Очистить поиск"
          onClick={() => onChange("")}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}
