import type { Metadata, Viewport } from "next";
import { Dela_Gothic_One, DotGothic16, Zen_Kaku_Gothic_New } from "next/font/google";
import { Nav } from "@/components/Nav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { contact, experience, site } from "@/data/site";
import "./globals.css";

const display = Dela_Gothic_One({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });
const pixel = DotGothic16({ weight: "400", subsets: ["latin"], variable: "--font-pixel", display: "swap" });
const text = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-text",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.role}`, template: `%s — ${site.name}` },
  description: site.description,
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#E3E2DD", colorScheme: "light" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  description: site.description,
  url: site.url,
  email: `mailto:${contact.email}`,
  sameAs: contact.links.map((l) => l.href),
  worksFor: experience[0] && { "@type": "Organization", name: experience[0].company },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${pixel.variable} ${text.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <SmoothScroll />
        <Nav />
        {children}
        <div className="grain" aria-hidden="true" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
