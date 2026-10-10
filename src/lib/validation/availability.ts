import { z } from "zod";

import { PET_SIZES } from "@/lib/business-rules";

/** Slug de serviço: minúsculas, números e hífen (ex.: "banho-tosa-higienica"). */
export const serviceSlugSchema = z
  .string({ error: "Informe o serviço." })
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Serviço inválido.")
  .max(60, "Serviço inválido.");

export const petSizeSchema = z.enum(PET_SIZES, { error: "Porte deve ser P, M ou G." });

/** Query de GET /api/disponibilidade. Compartilhado entre cliente e servidor. */
export const availabilityQuerySchema = z.object({
  // z.iso.date() exige "yyyy-MM-dd" E uma data que existe no calendário (recusa 2026-02-30).
  data: z.iso.date({ error: "Data deve estar no formato AAAA-MM-DD." }),
  servico: serviceSlugSchema,
  porte: petSizeSchema,
});

export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>;

/** Formato da resposta de GET /api/disponibilidade (consumido pelo assistente de agendamento). */
export type AvailabilityResponse = {
  motivo: string | null;
  mensagem: string | null;
  duracaoMinutos: number;
  horarios: Array<{ inicio: string; fim: string; hora: string; vagas: number }>;
};
