import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/ui/JsonLd";
import { siteUrl } from "@/lib/config";
import { publicMenu } from "@/lib/menu-store";
import "./globals.css";
const display = Cormorant_Garamond({
  weight: ["300", "400", "500"],
  subsets: ["cyrillic", "latin"],
  display: "swap",
  variable: "--font-display",
});
export const dynamic = "force-dynamic";
const sans = Jost({
  weight: ["300", "400", "500"],
  subsets: ["cyrillic", "latin"],
  display: "swap",
  variable: "--font-sans",
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Choco Dips — кофе и десерты в Нальчике",
    template: "%s — Choco Dips",
  },
  description:
    "Завтраки, кофе и десерты, ради которых хочется возвращаться. Choco Dips: Нальчик, ул. Пушкина, 85а. Ежедневно с 10:00 до 23:00.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Choco Dips",
    title: "Choco Dips — маленькие удовольствия каждый день",
    description: "Завтраки, кофе и десерты в центре Нальчика.",
    url: "/",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Choco Dips — кофе и десерты в Нальчике",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Choco Dips — кофе и десерты",
    images: ["/opengraph-image"],
  },
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = { themeColor: "#1C0F0A" };
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${display.variable} ${sans.variable}`}>
      <body>
        <div id="site-content">
          <a className="skip-link" href="#main-content">
            Перейти к содержимому
          </a>
          <Header menuNavigation={(await publicMenu()).map(category => ({ href: `/menu#${category.id}`, label: category.title }))} />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </div>
        <JsonLd />
      </body>
    </html>
  );
}
