import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
