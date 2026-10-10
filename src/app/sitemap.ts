import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site-url";

/** Só páginas públicas; área logada e API ficam de fora. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/servicos`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/cadastro`, changeFrequency: "yearly", priority: 0.4 },
  ];
}
