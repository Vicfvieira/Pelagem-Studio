import { z } from "zod";

const MAX_RANGE_DAYS = 366;

const localDate = z.iso.date({ error: "Use o formato AAAA-MM-DD." });

function daysBetween(from: string, to: string): number {
  return (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000;
}

/** desde/ate: datas locais de São Paulo, ambas inclusivas. */
const rangeShape = {
  desde: localDate.optional(),
  ate: localDate.optional(),
};

function checkRange(data: { desde?: string; ate?: string }, ctx: z.RefinementCtx) {
  if (data.desde && data.ate) {
    if (data.desde > data.ate) {
      ctx.addIssue({ code: "custom", path: ["desde"], message: "'desde' deve ser anterior ou igual a 'ate'." });
    } else if (daysBetween(data.desde, data.ate) > MAX_RANGE_DAYS) {
      ctx.addIssue({ code: "custom", path: ["ate"], message: `Período máximo de ${MAX_RANGE_DAYS} dias.` });
    }
  }
}

export const appointmentsQuerySchema = z
  .object({
    ...rangeShape,
    pagina: z.coerce.number({ error: "Página inválida." }).int().min(1, "Página mínima: 1.").max(10_000).default(1),
    porPagina: z.coerce
      .number({ error: "porPagina inválido." })
      .int()
      .min(1, "porPagina mínimo: 1.")
      .max(100, "porPagina máximo: 100.")
      .default(20),
  })
  .superRefine(checkRange);

export const summaryQuerySchema = z.object(rangeShape).superRefine(checkRange);

export type AppointmentsQuery = z.infer<typeof appointmentsQuerySchema>;
export type SummaryQuery = z.infer<typeof summaryQuerySchema>;
