import { describe, expect, it } from "vitest";

import { DEFAULT_LOGIN_REDIRECT, safeCallbackUrl } from "@/lib/auth/redirect";

describe("safeCallbackUrl", () => {
  it.each(["/agendar", "/agendar?servico=banho&porte=M", "/minha-conta#pets"])("aceita caminho interno %s", (url) => {
    expect(safeCallbackUrl(url)).toBe(url);
  });

  it.each([
    "https://evil.com",
    "//evil.com",
    "/\\evil.com",
    "javascript:alert(1)",
    "evil.com",
    "/\t/evil.com",
    "",
    undefined,
    null,
    42,
  ])("recusa %s e usa o padrão", (url) => {
    expect(safeCallbackUrl(url)).toBe(DEFAULT_LOGIN_REDIRECT);
  });
});
