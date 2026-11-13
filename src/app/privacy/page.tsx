import type { Metadata } from "next";
import ArrowLink from "@/components/ui/ArrowLink";
import { site } from "@/data/site";
export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};
export default function PrivacyPage() {
  return (
    <article className="simple-page policy container">
      <p className="eyebrow">CHOCO DIPS</p>
      <h1>Политика конфиденциальности</h1>
      <h2>Владелец сайта</h2>
      <p>
        {site.operator.name}, ИНН {site.operator.taxNumber}, ОГРНИП{" "}
        {site.operator.registrationNumber}. Почтовый адрес для обращений —{" "}
        {site.operator.postalAddress}. Электронная почта —{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
      <h2>Посещение сайта</h2>
      <p>
        Сайт знакомит гостей с меню, адресом и режимом работы кофейни.
        На публичных страницах нет форм для заявок и бронирования.
        Сайт не запрашивает персональные данные посетителей и не использует
        рекламные трекеры или стороннюю аналитику.
      </p>
      <ArrowLink href="/">На главную</ArrowLink>
    </article>
  );
}
