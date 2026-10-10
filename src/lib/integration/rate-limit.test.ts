import { describe, expect, it } from "vitest";

import { FixedWindowRateLimiter } from "@/lib/integration/rate-limit";

describe("FixedWindowRateLimiter (60 req/min)", () => {
  const start = 1_000_000;

  it("permite 60 requisições e bloqueia a 61ª na mesma janela", () => {
    const limiter = new FixedWindowRateLimiter(60, 60_000);
    for (let i = 1; i <= 60; i++) {
      const result = limiter.check("1.1.1.1", start + i);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(60 - i);
    }
    const blocked = limiter.check("1.1.1.1", start + 61);
    expect(blocked).toMatchObject({ allowed: false, remaining: 0, resetAt: start + 1 + 60_000 });
  });

  it("conta cada IP separadamente", () => {
    const limiter = new FixedWindowRateLimiter(1, 60_000);
    expect(limiter.check("a", start).allowed).toBe(true);
    expect(limiter.check("a", start).allowed).toBe(false);
    expect(limiter.check("b", start).allowed).toBe(true);
  });

  it("libera de novo quando a janela vence", () => {
    const limiter = new FixedWindowRateLimiter(1, 60_000);
    limiter.check("a", start);
    expect(limiter.check("a", start + 59_999).allowed).toBe(false);
    expect(limiter.check("a", start + 60_000).allowed).toBe(true);
  });

  it("descarta janelas vencidas quando atinge o máximo de chaves", () => {
    const limiter = new FixedWindowRateLimiter(1, 60_000, 2);
    limiter.check("a", start);
    limiter.check("b", start);
    // "a" e "b" venceram: a nova chave força a limpeza e tudo volta a ser permitido.
    expect(limiter.check("c", start + 60_000).allowed).toBe(true);
    expect(limiter.check("a", start + 60_001).allowed).toBe(true);
  });
});
