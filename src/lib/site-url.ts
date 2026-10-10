/**
 * URL pública do site, usada em metadata, Open Graph, sitemap, robots e JSON-LD.
 * Ordem: NEXT_PUBLIC_SITE_URL (domínio próprio) → domínio de produção da Vercel → URL do deploy → local.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return `https://${production}`;
  const deployment = process.env.VERCEL_URL;
  if (deployment) return `https://${deployment}`;
  return "http://localhost:3000";
}

/** Só o ambiente de produção deve ser indexado; previews e local ficam fora dos buscadores. */
export function isIndexable(): boolean {
  return process.env.VERCEL_ENV === "production";
}
