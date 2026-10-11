import type { MetadataRoute } from "next";

import { ARTICLES } from "@/content/articles";
import { siteUrl } from "@/lib/site-url";

const PAGES: ReadonlyArray<{ path: string; changeFrequency: "weekly" | "monthly" | "yearly"; priority: number }> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/servicos", changeFrequency: "weekly", priority: 0.9 },
  { path: "/precos", changeFrequency: "weekly", priority: 0.9 },
  { path: "/sobre", changeFrequency: "monthly", priority: 0.7 },
  { path: "/seguranca", changeFrequency: "monthly", priority: 0.7 },
  { path: "/perguntas-frequentes", changeFrequency: "monthly", priority: 0.6 },
  { path: "/politicas", changeFrequency: "yearly", priority: 0.5 },
  { path: "/dicas", changeFrequency: "weekly", priority: 0.6 },
  { path: "/trabalhe-conosco", changeFrequency: "monthly", priority: 0.4 },
  { path: "/creditos", changeFrequency: "yearly", priority: 0.2 },
  { path: "/cadastro", changeFrequency: "yearly", priority: 0.4 },
];

/** Só páginas públicas; área logada e API ficam de fora. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    ...PAGES.map(({ path, ...page }) => ({ url: `${base}${path}`, ...page })),
    ...ARTICLES.map((article) => ({
      url: `${base}/dicas/${article.slug}`,
      lastModified: article.publishedAt,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
