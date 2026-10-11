"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { FixedWindowRateLimiter } from "@/lib/integration/rate-limit";
import { clientIp } from "@/lib/integration/security";
import { prisma } from "@/lib/prisma";
import { jobApplicationSchema } from "@/lib/validation/careers";

export type JobApplicationResult =
  | { ok: true }
  | { ok: false; error: string; fields?: Partial<Record<string, string[]>> };

/** Até 5 candidaturas a cada 10 minutos por IP (em memória, por instância: ver rate-limit.ts). */
const limiter = new FixedWindowRateLimiter(5, 10 * 60_000);

export async function submitJobApplication(input: unknown): Promise<JobApplicationResult> {
  const rate = limiter.check(clientIp(await headers()));
  if (!rate.allowed) {
    return { ok: false, error: "Recebemos muitas candidaturas deste endereço. Tente de novo em alguns minutos." };
  }

  const parsed = jobApplicationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Confira os campos destacados.",
      fields: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const { website, consent, ...data } = parsed.data;
  // Campo-isca preenchido: responde como sucesso (o robô não aprende nada) e não grava.
  if (website) return { ok: true };

  // `consent` só chega aqui como true (z.literal); guardamos o instante do aceite.
  await prisma.jobApplication.create({ data: { ...data, consentAt: consent && new Date() } });
  return { ok: true };
}
