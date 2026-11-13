import Image from "next/image";
import Link from "next/link";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";
import PillButton from "@/components/ui/PillButton";
import { ArrowIcon, PinIcon, ClockIcon } from "@/components/ui/icons";
import { routeUrl } from "@/lib/config";
import { site } from "@/data/site";
export default function Footer() {
  return (
    <footer id="contacts" className="site-footer">
      <div className="container">
        <div className="footer-main">
          <Logo variant="dark" />
          <p className="footer-address">
            <PinIcon />
            <span>
              {site.city},<br />
              ул. Пушкина, 85а
            </span>
          </p>
          <p className="footer-hours">
            <ClockIcon />
            <span>
              {site.hours}
              <small>{site.kitchen}</small>
            </span>
          </p>
          <SocialLinks />
          <PillButton
            variant="solid-ink"
            href={routeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Построить маршрут
            <ArrowIcon />
          </PillButton>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Choco Dips</span>
          <span>{site.operator.name}<br />ИНН {site.operator.taxNumber} · ОГРНИП {site.operator.registrationNumber}</span>
          <Link href="/privacy">Политика конфиденциальности</Link>
          {site.phone && (
            <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}>{site.phone}</a>
          )}
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a className="footer-credit" href="https://wir.lol">
            <Image src="/brand/wir-logo.svg" alt="wir.lol" width={45} height={43} unoptimized />
          </a>
        </div>
      </div>
    </footer>
  );
}
