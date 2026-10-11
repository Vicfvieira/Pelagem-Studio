import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";

import { clientHash, clientIp, isValidApiKey } from "@/lib/integration/security";

describe("isValidApiKey", () => {
  const key = "a".repeat(64);

  it("aceita a chave correta", () => {
    expect(isValidApiKey(key, key)).toBe(true);
  });

  it.each([
    ["errada, mesmo tamanho", "b".repeat(64)],
    ["mais curta", "a".repeat(10)],
    ["mais longa", "a".repeat(200)],
    ["vazia", ""],
    ["ausente", null],
  ])("recusa chave %s (sem lançar erro de tamanho)", (_, provided) => {
    expect(isValidApiKey(provided, key)).toBe(false);
  });

  it("falha fechada quando INTEGRATION_API_KEY não está configurada", () => {
    expect(isValidApiKey("qualquer", undefined)).toBe(false);
    expect(isValidApiKey("", "")).toBe(false);
  });
});

describe("clientHash", () => {
  it("é SHA-256(id + salt) em hexadecimal", () => {
    const expected = createHash("sha256").update("user123salt").digest("hex");
    expect(clientHash("user123", "salt")).toBe(expected);
    expect(clientHash("user123", "salt")).toMatch(/^[0-9a-f]{64}$/);
  });

  it("é estável para o mesmo cliente e muda com o salt", () => {
    expect(clientHash("u1", "s")).toBe(clientHash("u1", "s"));
    expect(clientHash("u1", "s")).not.toBe(clientHash("u1", "outro-salt"));
    expect(clientHash("u1", "s")).not.toBe(clientHash("u2", "s"));
  });
});

describe("clientIp", () => {
  it("usa o primeiro IP de x-forwarded-for", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" }))).toBe("203.0.113.7");
  });

  it("cai para x-real-ip e depois para 'desconhecido'", () => {
    expect(clientIp(new Headers({ "x-real-ip": "198.51.100.2" }))).toBe("198.51.100.2");
    expect(clientIp(new Headers())).toBe("desconhecido");
  });
});
