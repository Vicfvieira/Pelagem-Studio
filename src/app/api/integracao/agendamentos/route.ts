import type { NextRequest } from "next/server";
import { z } from "zod";

import { badRequest, guardIntegrationRequest } from "@/lib/integration/guard";
import { periodToUtcRange } from "@/lib/integration/period";
import { clientHash } from "@/lib/integration/security";
import { prisma } from "@/lib/prisma";
import { appointmentsQuerySchema } from "@/lib/validation/integration";

/**
 * GET /api/integracao/agendamentos?desde=2026-10-01&ate=2026-10-31&pagina=1&porPagina=20
 * Header obrigatório: x-api-key. Sem dados pessoais: o cliente vira um hash anônimo.
 */
export async function GET(request: NextRequest) {
  const guard = guardIntegrationRequest(request);
  if (!guard.ok) return guard.response;

  const salt = process.env.HASH_SALT;
  if (!salt) {
    return Response.json({ erro: "Integração não configurada." }, { status: 503, headers: guard.headers });
  }

  const parsed = appointmentsQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return badRequest(z.flattenError(parsed.error).fieldErrors, guard.headers);
  const { desde, ate, pagina, porPagina } = parsed.data;

  const startAt = periodToUtcRange(desde, ate);
  const where = Object.keys(startAt).length > 0 ? { startAt } : {};

  const [total, rows] = await prisma.$transaction([
    prisma.appointment.count({ where }),
    prisma.appointment.findMany({
      where,
      orderBy: [{ startAt: "desc" }, { id: "asc" }],
      skip: (pagina - 1) * porPagina,
      take: porPagina,
      // Seleção explícita: nenhum campo pessoal (nome, e-mail, telefone, endereço, CEP, pet) sai daqui.
      select: {
        id: true,
        userId: true,
        status: true,
        size: true,
        startAt: true,
        endAt: true,
        durationMinutes: true,
        priceCents: true,
        taxiFeeCents: true,
        totalCents: true,
        createdAt: true,
        cancelledAt: true,
        service: { select: { slug: true, name: true } },
        taxiZone: { select: { name: true } },
      },
    }),
  ]);

  return Response.json(
    {
      dados: rows.map((row) => ({
        id: row.id,
        clienteHash: clientHash(row.userId, salt),
        servico: { slug: row.service.slug, nome: row.service.name },
        porte: row.size,
        status: row.status,
        inicio: row.startAt.toISOString(),
        fim: row.endAt.toISOString(),
        duracaoMinutos: row.durationMinutes,
        valorServicoCentavos: row.priceCents,
        taxaTaxiCentavos: row.taxiFeeCents,
        totalCentavos: row.totalCents,
        zonaTaxi: row.taxiZone?.name ?? null,
        criadoEm: row.createdAt.toISOString(),
        canceladoEm: row.cancelledAt?.toISOString() ?? null,
      })),
      paginacao: { pagina, porPagina, total, totalPaginas: Math.ceil(total / porPagina) },
      filtros: { desde: desde ?? null, ate: ate ?? null },
    },
    { headers: guard.headers },
  );
}
