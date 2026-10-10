export const DEFAULT_LOGIN_REDIRECT = "/minha-conta";

/**
 * Aceita só caminhos internos ("/agendar?x=1"). Bloqueia open redirect:
 * URLs absolutas, "//evil.com", "/\\evil.com" e esquemas como "javascript:".
 */
export function safeCallbackUrl(value: unknown, fallback = DEFAULT_LOGIN_REDIRECT): string {
  if (typeof value !== "string" || value.length === 0 || value.length > 2048) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  // Caracteres de controle podem ser normalizados pelo navegador em "//".
  if (/[\u0000-\u001f\u007f]/.test(value)) return fallback;
  return value;
}
