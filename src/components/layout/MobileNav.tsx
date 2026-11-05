"use client";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import { ArrowIcon } from "@/components/ui/icons";
import { routeUrl } from "@/lib/config";
import { site } from "@/data/site";
import SocialLinks from "./SocialLinks";
export default function MobileNav({
  onClose,
  links = site.navigation,
}: {
  onClose: () => void;
  links?: { href: string; label: string }[];
}) {
  return (
    <Modal
      onClose={onClose}
      labelledBy="mobile-nav-title"
      className="mobile-nav-backdrop"
    >
      <div id="mobile-navigation" className="mobile-navigation">
        <h2 id="mobile-nav-title" className="sr-only">
          Навигация
        </h2>
        <p className="eyebrow">CHOCO DIPS · НАЛЬЧИК</p>
        <nav aria-label="Мобильная навигация">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                if (link.href.startsWith("/menu#"))
                  window.dispatchEvent(
                    new CustomEvent("menu-category-navigation", {
                      detail: link.href.split("#")[1],
                    }),
                  );
                onClose();
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mobile-nav-details">
          <p>
            {site.address}
            <br />
            {site.hours}
            <br />
            <span>{site.kitchen}</span>
          </p>
          <SocialLinks />
          <a
            className="pill"
            href={routeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Построить маршрут
            <ArrowIcon />
          </a>
        </div>
      </div>
    </Modal>
  );
}
