import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import Navigation from "@/components/layout/Navigation";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { ArchitecturalGrid, NoiseOverlay } from "@/components/ui/PageTexture";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pema Ghising — Graphic & Motion Designer",
  description:
    "Pema Ghising is a graphic and motion designer with 7+ years of experience across brand, motion, digital and visual systems.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${inter.variable}`}
    >
      <body className="relative bg-background text-primary antialiased">
        <NoiseOverlay />
        <ArchitecturalGrid />
        <div className="relative z-10">
          <SmoothScroll>
            <Navigation />
            {children}
          </SmoothScroll>
        </div>
      </body>
    </html>
  );
}
