import { createHash, timingSafeEqual } from "node:crypto";

function sha256(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

/**
 * Compara a chave recebida com a esperada em tempo constante.
 * Os dois lados viram SHA-256 (32 bytes) antes do timingSafeEqual: assim nem o TAMANHO da chave
 * vaza pelo tempo de resposta. Sem chave configurada, recusa tudo (falha fechada).
 */
export function isValidApiKey(provided: string | null | undefined, expected: string | undefined): boolean {
  if (!expected || !provided) return false;
  return timingSafeEqual(sha256(provided), sha256(expected));
}

/** Identificador anônimo e estável do cliente: SHA-256(id + HASH_SALT), em hexadecimal. */
export function clientHash(userId: string, salt: string): string {
  return createHash("sha256").update(`${userId}${salt}`, "utf8").digest("hex");
}

/** IP do cliente atrás do proxy da Vercel: primeiro valor de x-forwarded-for. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip")?.trim() || "desconhecido";
}
