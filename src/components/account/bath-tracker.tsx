"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AppointmentStatus, GroomingStage } from "@prisma/client";
import { Check, PartyPopper, RefreshCw } from "lucide-react";

import type { TodayAppointment } from "@/lib/data/account";
import { toSaoPauloTime } from "@/lib/business-rules";
import { STAGE_INFO, TRACKING_POLL_MS, stageProgress, stagesFor } from "@/lib/tracking/stages";
import { cn } from "@/lib/utils";

type TrackingState = {
  status: AppointmentStatus;
  stage: GroomingStage | null;
  updatedAt: string | null;
};

type ApiResponse = { status: AppointmentStatus; etapa: GroomingStage | null; atualizadoEm: string | null };

const time = (iso: string) => toSaoPauloTime(new Date(iso));

/**
 * Status ao vivo do atendimento de hoje. Consulta a API a cada 30 s (pausa com a aba escondida e
 * atualiza assim que ela volta). Mudanças de etapa são anunciadas para leitores de tela.
 */
export function BathTracker({ appointment }: { appointment: TodayAppointment }) {
  const [state, setState] = useState<TrackingState>({
    status: "AGENDADO",
    stage: appointment.stage,
    updatedAt: appointment.stageUpdatedAt,
  });
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const lastStage = useRef(appointment.stage);

  const stages = stagesFor(appointment.serviceSlug);
  const finished = state.status !== "AGENDADO";
  const ready = state.stage === "PRONTO";
  const currentIndex = state.stage ? stages.indexOf(state.stage) : -1;
  const progress = finished ? 1 : stageProgress(appointment.serviceSlug, state.stage);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/acompanhamento/${encodeURIComponent(appointment.id)}`, { cache: "no-store" });
      if (!response.ok) throw new Error(String(response.status));
      const data = (await response.json()) as ApiResponse;
      setState({ status: data.status, stage: data.etapa, updatedAt: data.atualizadoEm });
      if (data.etapa !== lastStage.current && data.etapa) {
        setAnnouncement(`${appointment.petName}: ${STAGE_INFO[data.etapa].label}.`);
      }
      lastStage.current = data.etapa;
      setCheckedAt(new Date());
      setFailed(false);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [appointment.id, appointment.petName]);

  useEffect(() => {
    if (finished) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) void refresh();
    }, TRACKING_POLL_MS);
    const onVisible = () => {
      if (!document.hidden) void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [finished, refresh]);

  const headline = finished
    ? state.status === "CONCLUIDO"
      ? "Entregue. Até o próximo banho!"
      : "Atendimento cancelado."
    : state.stage
      ? STAGE_INFO[state.stage].label
      : `Esperando ${appointment.petName} às ${time(appointment.startAt)}`;
  const detail = finished
    ? null
    : state.stage
      ? STAGE_INFO[state.stage].description
      : "Assim que o pet chegar e passar pela avaliação, as etapas aparecem aqui.";

  return (
    <article
      aria-labelledby={`acompanhar-${appointment.id}`}
      className={cn(
        "flex flex-col gap-5 rounded-2xl border-2 bg-card p-5 shadow-sm transition-colors sm:p-6",
        ready ? "border-secondary" : "border-primary/40",
      )}
    >
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>

      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`acompanhar-${appointment.id}`} className="text-xl font-black">
            {appointment.petName} <span className="text-base font-bold text-muted-foreground">· {appointment.petBreed}</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            {appointment.serviceName} às {time(appointment.startAt)}
          </p>
        </div>
        {!finished && (
          <span className="flex items-center gap-1.5 rounded-full bg-secondary/20 px-3 py-1 text-xs font-extrabold text-secondary-strong">
            <span className="relative flex size-2" aria-hidden="true">
              <span className="pulse-ring absolute inset-0 rounded-full bg-secondary" />
              <span className="relative size-2 rounded-full bg-secondary-strong" />
            </span>
            Ao vivo
          </span>
        )}
      </header>

      <div className="flex flex-col gap-1">
        <p className="flex items-center gap-2 text-2xl font-black">
          {ready && <PartyPopper className="size-6 text-primary-strong" aria-hidden="true" />}
          {headline}
        </p>
        {detail && <p className="text-muted-foreground">{detail}</p>}
      </div>

      {/* Barra de progresso: só transform (scaleX). */}
      <div
        role="progressbar"
        aria-label={`Progresso do atendimento de ${appointment.petName}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="h-2.5 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full origin-left rounded-full bg-primary transition-transform duration-700 ease-out motion-reduce:transition-none"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <ol className="grid gap-2" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}>
        {stages.map((stage, index) => {
          // "Pronto para buscar" já é uma etapa cumprida: aparece com check, não como "em andamento".
          const done = finished || index < currentIndex || (ready && index === currentIndex);
          const current = !finished && !ready && index === currentIndex;
          return (
            <li
              key={stage}
              aria-current={current ? "step" : undefined}
              className="flex flex-col items-center gap-1.5 text-center"
            >
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full text-xs font-black transition-transform duration-300",
                  done && "bg-secondary",
                  current && "scale-110 bg-primary ring-4 ring-primary/25",
                  !done && !current && "bg-muted text-muted-foreground",
                )}
              >
                {done ? <Check className="size-4" aria-hidden="true" /> : index + 1}
              </span>
              <span className={cn("text-xs leading-tight font-bold", current ? "text-foreground" : "text-muted-foreground")}>
                {STAGE_INFO[stage].label}
                <span className="sr-only">{done ? " (concluída)" : current ? " (etapa atual)" : " (a seguir)"}</span>
              </span>
            </li>
          );
        })}
      </ol>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-xs text-muted-foreground">
        <p>
          {state.updatedAt ? `Etapa atualizada às ${time(state.updatedAt)}` : "Sem atualização da equipe ainda"}
          {failed
            ? " · Sem conexão, tentando de novo em 30 s."
            : checkedAt
              ? ` · Conferido às ${toSaoPauloTime(checkedAt)}`
              : " · Atualiza sozinho a cada 30 s"}
        </p>
        {!finished && (
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className="flex min-h-11 items-center gap-1.5 rounded-2xl px-3 font-bold text-primary-strong outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/60 disabled:opacity-60"
          >
            <RefreshCw className={cn("size-4", loading && "animate-spin motion-reduce:animate-none")} aria-hidden="true" />
            Atualizar agora
          </button>
        )}
      </footer>
    </article>
  );
}
