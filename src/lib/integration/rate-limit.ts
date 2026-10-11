export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  /** Instante (ms) em que a janela atual termina. */
  resetAt: number;
};

/**
 * Limite por janela fixa (ex.: 60 requisições por minuto por IP), em memória.
 *
 * Limitação consciente: em serverless cada instância tem a própria memória, então o limite vale
 * por instância. Para um limite global, o próximo passo seria um store compartilhado (Redis/Upstash).
 */
export class FixedWindowRateLimiter {
  private hits = new Map<string, { count: number; windowStart: number }>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    private readonly maxKeys = 10_000,
  ) {}

  check(key: string, now = Date.now()): RateLimitResult {
    let entry = this.hits.get(key);
    if (!entry || now - entry.windowStart >= this.windowMs) {
      if (!entry && this.hits.size >= this.maxKeys) this.prune(now);
      entry = { count: 0, windowStart: now };
      this.hits.set(key, entry);
    }

    entry.count += 1;
    const allowed = entry.count <= this.limit;
    return {
      allowed,
      limit: this.limit,
      remaining: Math.max(0, this.limit - entry.count),
      resetAt: entry.windowStart + this.windowMs,
    };
  }

  /** Remove janelas vencidas para a memória não crescer sem limite. */
  private prune(now: number): void {
    for (const [key, entry] of this.hits) {
      if (now - entry.windowStart >= this.windowMs) this.hits.delete(key);
    }
  }
}
