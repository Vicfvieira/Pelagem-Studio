import { clientIp, isValidApiKey } from "@/lib/integration/security";
import { FixedWindowRateLimiter, type RateLimitResult } from "@/lib/integration/rate-limit";

export const RATE_LIMIT_PER_MINUTE = 60;

// Um limitador por instância do servidor (ver limitação em rate-limit.ts).
const limiter = new FixedWindowRateLimiter(RATE_LIMIT_PER_MINUTE, 60_000);

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
}

export const NO_STORE = { "Cache-Control": "no-store" } as const;

type GuardResult = { ok: true; headers: Record<string, string> } | { ok: false; response: Response };

/**
 * Proteção das rotas /api/integracao:
 * 1) limite de 60 req/min por IP, ANTES da chave (tentativas com chave errada também contam);
 * 2) header x-api-key comparado em tempo constante com INTEGRATION_API_KEY.
 */
export function guardIntegrationRequest(request: Request, now = Date.now()): GuardResult {
  const rate = limiter.check(clientIp(request.headers), now);
  const headers = { ...NO_STORE, ...rateLimitHeaders(rate) };

  if (!rate.allowed) {
    const retryAfter = Math.max(1, Math.ceil((rate.resetAt - now) / 1000));
    return {
      ok: false,
      response: Response.json(
        { erro: "Limite de requisições excedido. Tente novamente em instantes." },
        { status: 429, headers: { ...headers, "Retry-After": String(retryAfter) } },
      ),
    };
  }

  if (!isValidApiKey(request.headers.get("x-api-key"), process.env.INTEGRATION_API_KEY)) {
    return {
      ok: false,
      response: Response.json(
        { erro: "Chave de API ausente ou inválida." },
        { status: 401, headers: { ...headers, "WWW-Authenticate": 'ApiKey header="x-api-key"' } },
      ),
    };
  }

  return { ok: true, headers };
}

/** Resposta 400 padronizada com os erros de cada campo. */
export function badRequest(fields: Record<string, string[] | undefined>, headers: Record<string, string>): Response {
  return Response.json({ erro: "Parâmetros inválidos.", campos: fields }, { status: 400, headers });
}
