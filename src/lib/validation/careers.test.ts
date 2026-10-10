import { describe, expect, it } from "vitest";

import { jobApplicationSchema } from "@/lib/validation/careers";

const VALID = {
  name: "  Ana Souza ",
  email: "ANA@Example.com",
  phone: "(11) 91234-5678",
  role: "BANHISTA",
  shift: "INTEGRAL",
  experienceYears: 2,
  about: "Trabalhei dois anos num pet shop de bairro com banho e secagem de cães de todos os portes.",
  consent: true,
};

describe("jobApplicationSchema", () => {
  it("normaliza nome, e-mail e telefone", () => {
    const parsed = jobApplicationSchema.parse(VALID);
    expect(parsed).toMatchObject({ name: "Ana Souza", email: "ana@example.com", phone: "11912345678" });
  });

  it("exige consentimento explícito (LGPD)", () => {
    const result = jobApplicationSchema.safeParse({ ...VALID, consent: false });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["consent"]);
  });

  it.each([
    ["vaga inexistente", { role: "GERENTE" }, "role"],
    ["telefone sem DDD", { phone: "91234-5678" }, "phone"],
    ["experiência negativa", { experienceYears: -1 }, "experienceYears"],
    ["experiência fracionada", { experienceYears: 1.5 }, "experienceYears"],
    ["texto curto", { about: "Gosto de cachorro." }, "about"],
    ["e-mail inválido", { email: "ana@" }, "email"],
  ])("recusa %s", (_, patch, field) => {
    const result = jobApplicationSchema.safeParse({ ...VALID, ...patch });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path[0])).toContain(field);
  });
});
