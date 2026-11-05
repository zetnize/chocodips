import { site } from "@/data/site";
import { siteUrl } from "@/lib/config";
export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": `${siteUrl}/#cafe`,
    name: site.name,
    url: siteUrl,
    image: `${siteUrl}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Пушкина, 85а",
      addressLocality: "Нальчик",
      addressRegion: "Кабардино-Балкарская Республика",
      addressCountry: "RU",
    },
    openingHours: "Mo-Su 10:00-23:00",
    servesCuisine: ["Кофе", "Завтраки", "Десерты", "Европейская кухня"],
    ...(site.phone ? { telephone: site.phone } : {}),
    sameAs: Object.values(site.socials).filter(Boolean),
    hasMenu: `${siteUrl}/menu`,
    priceRange: "₽₽",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
