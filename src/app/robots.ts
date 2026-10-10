import type { MetadataRoute } from "next";

import { isIndexable, siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  // Deploys de preview não devem ser indexados.
  if (!isIndexable()) return { rules: { userAgent: "*", disallow: "/" } };

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/minha-conta", "/agendar", "/entrar"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
