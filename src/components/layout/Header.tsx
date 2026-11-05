"use client";
import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";
import MobileNav from "./MobileNav";
import { site } from "@/data/site";
import { useScrolled } from "@/hooks/useScrolled";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { BurgerIcon } from "@/components/ui/icons";
export default function Header({ menuNavigation }: { menuNavigation: { href: string; label: string }[] }) {
  const path = usePathname();
  const scrolled = useScrolled();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hiddenOnScroll, setHiddenOnScroll] = useState(false);
  const homePage = path === "/";
  const menuPage = path === "/menu";
  const categoryIds = useMemo(() => menuPage ? menuNavigation.map(link => link.href.split("#")[1]) : [], [menuPage, menuNavigation]);
  const activeCategory = useScrollSpy(categoryIds);
  const hidden = homePage && scrolled && hiddenOnScroll;
  useEffect(() => {
    if (!homePage) return;
    let previousY = window.scrollY;
    const onScroll = () => {
      const y = Math.max(0, window.scrollY);
      if (Math.abs(y - previousY) < 8 && y > 40) return;
      setHiddenOnScroll(y > 80 && y > previousY);
      previousY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [homePage]);
  const close = useCallback(() => setMobileOpen(false), []);
  function navigateCategory(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    window.dispatchEvent(new CustomEvent("menu-category-navigation", {
      detail: event.currentTarget.hash.slice(1),
    }));
  }
  return (
    <>
      <header
        className={`site-header ${homePage ? "home-header" : ""} ${menuPage ? "menu-page-header" : ""} ${scrolled || !homePage ? "is-scrolled" : ""} ${hidden ? "is-hidden" : ""}`}
        inert={hidden}
        aria-hidden={hidden}
      >
        <div
          className={`container header-inner ${menuPage ? "menu-header-inner" : ""}`}
        >
          {menuPage && (
            <nav
              className="menu-header-nav"
              aria-label="Завтраки, кофе и десерты"
            >
              {menuNavigation.slice(0, 3).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={activeCategory === link.href.split("#")[1] ? "location" : undefined}
                  onClick={navigateCategory}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
          {!homePage && <Logo />}
          {menuPage && (
            <nav
              className="menu-header-nav"
              aria-label="Основное, напитки и сезонное"
            >
              {menuNavigation.slice(3).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={activeCategory === link.href.split("#")[1] ? "location" : undefined}
                  onClick={navigateCategory}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
          {!menuPage && (
            <nav className="desktop-nav" aria-label="Основная навигация">
              {site.navigation.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={path === link.href ? "page" : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
          <button
            className="icon-button burger"
            aria-label="Открыть навигацию"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen(true)}
          >
            <BurgerIcon />
          </button>
        </div>
      </header>
      {mobileOpen && (
        <MobileNav
          onClose={close}
          links={
            menuPage
              ? [{ href: "/", label: "Главная" }, ...menuNavigation]
              : undefined
          }
        />
      )}
    </>
  );
}
