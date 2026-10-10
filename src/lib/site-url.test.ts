import { afterEach, describe, expect, it, vi } from "vitest";

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { isIndexable, siteUrl } from "@/lib/site-url";

afterEach(() => vi.unstubAllEnvs());

function env(values: Partial<Record<"NEXT_PUBLIC_SITE_URL" | "VERCEL_PROJECT_PRODUCTION_URL" | "VERCEL_URL" | "VERCEL_ENV", string>>) {
  for (const key of ["NEXT_PUBLIC_SITE_URL", "VERCEL_PROJECT_PRODUCTION_URL", "VERCEL_URL", "VERCEL_ENV"] as const) {
    vi.stubEnv(key, values[key] ?? "");
  }
}

describe("siteUrl", () => {
  it("prioriza o domínio próprio, sem barra final", () => {
    env({ NEXT_PUBLIC_SITE_URL: "https://pelagem.example.com/", VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app" });
    expect(siteUrl()).toBe("https://pelagem.example.com");
  });

  it("usa o domínio de produção da Vercel, depois a URL do deploy, depois localhost", () => {
    env({ VERCEL_PROJECT_PRODUCTION_URL: "pelagem-studio.vercel.app", VERCEL_URL: "preview.vercel.app" });
    expect(siteUrl()).toBe("https://pelagem-studio.vercel.app");
    env({ VERCEL_URL: "preview.vercel.app" });
    expect(siteUrl()).toBe("https://preview.vercel.app");
    env({});
    expect(siteUrl()).toBe("http://localhost:3000");
  });
});

describe("robots e sitemap", () => {
  it("em produção libera o site, bloqueia área logada e API e aponta o sitemap", () => {
    env({ VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "pelagem-studio.vercel.app" });
    expect(isIndexable()).toBe(true);
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/minha-conta", "/agendar", "/entrar"] },
      sitemap: "https://pelagem-studio.vercel.app/sitemap.xml",
    });
  });

  it("em preview bloqueia tudo", () => {
    env({ VERCEL_ENV: "preview" });
    expect(isIndexable()).toBe(false);
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });

  it("o sitemap só lista páginas públicas", () => {
    env({ VERCEL_PROJECT_PRODUCTION_URL: "pelagem-studio.vercel.app" });
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toEqual([
      "https://pelagem-studio.vercel.app/",
      "https://pelagem-studio.vercel.app/servicos",
      "https://pelagem-studio.vercel.app/cadastro",
    ]);
  });
});
