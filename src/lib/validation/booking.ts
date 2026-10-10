import { z } from "zod";

import { serviceSlugSchema } from "@/lib/validation/availability";

/** "01310-100", "01310100" → "01310100". */
export function normalizeCep(value: string): string {
  return value.replace(/\D/g, "");
}

export const cepSchema = z
  .string({ error: "Informe o CEP." })
  .transform(normalizeCep)
  .refine((digits) => digits.length === 8, "CEP deve ter 8 dígitos.");

/**
 * Formulário do agendamento. Compartilhado: o cliente valida passo a passo e o servidor
 * valida tudo de novo antes de recalcular preço e disponibilidade.
 */
export const bookingSchema = z
  .object({
    petId: z.string({ error: "Escolha um pet." }).min(1, "Escolha um pet.").max(40),
    servico: serviceSlugSchema,
    data: z.iso.date({ error: "Escolha uma data." }),
    hora: z
      .string({ error: "Escolha um horário." })
      .regex(/^(0\d|1\d|2[0-3]):(00|30)$/, "Escolha um horário."),
    taxi: z.boolean(),
    cep: z.string().optional(),
    numero: z.string().trim().max(20, "Número muito longo.").optional(),
    complemento: z.string().trim().max(60, "Complemento muito longo.").optional(),
    observacoes: z.string().trim().max(500, "Use no máximo 500 caracteres.").optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.taxi) return;
    if (!cepSchema.safeParse(data.cep ?? "").success) {
      ctx.addIssue({ code: "custom", path: ["cep"], message: "Informe um CEP com 8 dígitos." });
    }
    if (!data.numero) {
      ctx.addIssue({ code: "custom", path: ["numero"], message: "Informe o número para a busca." });
    }
  });

export type BookingInput = z.input<typeof bookingSchema>;
