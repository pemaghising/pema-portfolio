import type { MetadataRoute } from "next";
import { projects, site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Placeholder case studies are noindex, so only published ones are listed.
  const studies = projects.filter((p) => !p.href && p.sections?.length).map((p) => `${site.url}/work/${p.slug}`);
  return [site.url, `${site.url}/roomie`, ...studies].map((url) => ({ url }));
}
