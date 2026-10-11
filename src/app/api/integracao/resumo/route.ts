import type { NextRequest } from "next/server";
import { z } from "zod";

import { badRequest, guardIntegrationRequest } from "@/lib/integration/guard";
import { periodToUtcRange, resolveSummaryPeriod } from "@/lib/integration/period";
import { summarize } from "@/lib/integration/summary";
import { prisma } from "@/lib/prisma";
import { summaryQuerySchema } from "@/lib/validation/integration";

/**
 * GET /api/integracao/resumo?desde=2026-10-01&ate=2026-10-31
 * Indicadores agregados do período (regras em resolveSummaryPeriod). Header obrigatório: x-api-key.
 */
export async function GET(request: NextRequest) {
  const guard = guardIntegrationRequest(request);
  if (!guard.ok) return guard.response;

  const parsed = summaryQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return badRequest(z.flattenError(parsed.error).fieldErrors, guard.headers);

  const { desde, ate } = resolveSummaryPeriod(parsed.data);

  const rows = await prisma.appointment.findMany({
    where: { startAt: periodToUtcRange(desde, ate) },
    select: {
      userId: true,
      status: true,
      size: true,
      durationMinutes: true,
      totalCents: true,
      taxiFeeCents: true,
      service: { select: { slug: true, name: true } },
    },
  });

  return Response.json(summarize(rows, { desde, ate }), { headers: guard.headers });
}
