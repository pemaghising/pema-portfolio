import type { MetadataRoute } from "next";
import { projects, site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Case studies are listed only once they have real content.
  const studies = projects
    .filter((p) => !p.href && p.sections?.length)
    .map((p) => ({ url: `${site.url}/work/${p.slug}` }));
  return [{ url: site.url }, ...studies];
}
