import type { GroomingStage } from "@prisma/client";

import { addDaysToDate, saoPauloDateTime, toSaoPauloDate } from "@/lib/business-rules";

/** Ordem completa das etapas do "Acompanhe o banho". */
export const ALL_STAGES = ["RECEBIDO", "BANHO", "SECAGEM", "TOSA", "PRONTO"] as const satisfies readonly GroomingStage[];

export const STAGE_INFO: Record<GroomingStage, { label: string; description: string }> = {
  RECEBIDO: { label: "Recebido", description: "Chegou, passou pela avaliação e está se ambientando." },
  BANHO: { label: "Banho", description: "Na banheira, com água morna e shampoo hipoalergênico." },
  SECAGEM: { label: "Secagem", description: "Secando com ar morno e escovação, sem pressa." },
  TOSA: { label: "Tosa", description: "Na mesa de tosa, nos detalhes finais." },
  PRONTO: { label: "Pronto para buscar", description: "Cheiroso e esperando por você na recepção." },
};

const TOSA_SERVICES = new Set(["banho-tosa-higienica", "tosa-completa"]);
const NO_BATH_SERVICES = new Set(["corte-de-unhas"]);

/** Etapas que fazem sentido para cada serviço (corte de unhas não tem banho; banho simples não tem tosa). */
export function stagesFor(serviceSlug: string): readonly GroomingStage[] {
  if (NO_BATH_SERVICES.has(serviceSlug)) return ["RECEBIDO", "PRONTO"];
  if (TOSA_SERVICES.has(serviceSlug)) return ALL_STAGES;
  return ALL_STAGES.filter((stage) => stage !== "TOSA");
}

/** Próxima etapa do serviço. `null` na entrada = pet ainda não chegou; `null` na saída = já está pronto. */
export function nextStage(serviceSlug: string, current: GroomingStage | null): GroomingStage | null {
  const stages = stagesFor(serviceSlug);
  if (current === null) return stages[0];
  const index = stages.indexOf(current);
  if (index === -1) throw new Error(`Etapa ${current} não existe para o serviço ${serviceSlug}.`);
  return stages[index + 1] ?? null;
}

/** Progresso de 0 a 1 (0 antes de chegar, 1 quando pronto). */
export function stageProgress(serviceSlug: string, current: GroomingStage | null): number {
  if (current === null) return 0;
  const stages = stagesFor(serviceSlug);
  return (stages.indexOf(current) + 1) / stages.length;
}

/** Intervalo [início, fim) do dia de hoje em São Paulo, para buscar os atendimentos do dia. */
export function todayRange(now: Date): { start: Date; end: Date } {
  const today = toSaoPauloDate(now);
  return { start: saoPauloDateTime(today, 0), end: saoPauloDateTime(addDaysToDate(today, 1), 0) };
}

/** Intervalo de atualização automática da tela do tutor. */
export const TRACKING_POLL_MS = 30_000;
