"use client";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";
import MobileNav from "./MobileNav";
import { site, menuNavigation } from "@/data/site";
import { useScrolled } from "@/hooks/useScrolled";
import { BurgerIcon } from "@/components/ui/icons";
export default function Header() {
  const path = usePathname();
  const scrolled = useScrolled();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const visible = path !== "/" || pastHero;
  const menuPage = path === "/menu";
  useEffect(() => {
    if (path !== "/") return;
    const hero = document.querySelector(".intro-hero");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setPastHero(entry.boundingClientRect.bottom <= 0);
      },
      { threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [path]);
  const close = useCallback(() => setMobileOpen(false), []);
  return (
    <>
      <header
        className={`site-header ${scrolled || path !== "/" ? "is-scrolled" : ""} ${visible ? "" : "is-hidden"}`}
        inert={!visible}
        aria-hidden={!visible}
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
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("menu-category-navigation", {
                        detail: link.href.split("#")[1],
                      }),
                    )
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
          <Logo />
          {menuPage && (
            <nav
              className="menu-header-nav"
              aria-label="Основное, напитки и сезонное"
            >
              {menuNavigation.slice(3).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("menu-category-navigation", {
                        detail: link.href.split("#")[1],
                      }),
                    )
                  }
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
