import { AlertTriangle, Cat, CheckCircle2, Dog, Syringe } from "lucide-react";

import { AddVaccineForm } from "@/components/account/add-vaccine-form";
import { StatusBadge } from "@/components/account/status-badge";
import type { AccountPet } from "@/lib/data/account";
import { formatLocalDate, formatNumericDate } from "@/lib/format";

function VaccineBadge({ vaccine }: { vaccine: AccountPet["vaccines"][number] }) {
  if (vaccine.superseded) return <StatusBadge tone="neutral">Dose anterior</StatusBadge>;
  if (vaccine.status === "VENCIDA")
    return (
      <StatusBadge tone="danger">
        <AlertTriangle className="size-3" aria-hidden="true" /> Vencida
      </StatusBadge>
    );
  if (vaccine.status === "VENCE_EM_BREVE")
    return (
      <StatusBadge tone="warning">
        <AlertTriangle className="size-3" aria-hidden="true" />
        {vaccine.daysLeft === 0 ? "Vence hoje" : `Vence em ${vaccine.daysLeft} dia${vaccine.daysLeft === 1 ? "" : "s"}`}
      </StatusBadge>
    );
  return (
    <StatusBadge tone="success">
      <CheckCircle2 className="size-3" aria-hidden="true" /> Em dia
    </StatusBadge>
  );
}

export function PetCard({ pet }: { pet: AccountPet }) {
  const Icon = pet.species === "GATO" ? Cat : Dog;
  const weight = pet.weightKg.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

  return (
    <article className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm" aria-labelledby={`pet-${pet.id}`}>
      <header className="flex items-center gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary/30" aria-hidden="true">
          <Icon className="size-6 text-secondary-strong" />
        </span>
        <div>
          <h3 id={`pet-${pet.id}`} className="text-lg font-extrabold">
            {pet.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {pet.breed} · {weight} kg · Porte {pet.size}
          </p>
        </div>
      </header>

      <section aria-label={`Carteirinha de vacinas de ${pet.name}`} className="flex flex-col gap-3">
        <h4 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide">
          <Syringe className="size-4" aria-hidden="true" /> Carteirinha de vacinas
        </h4>
        {pet.vaccines.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma vacina registrada.</p>
        ) : (
          <ul className="flex flex-col divide-y rounded-2xl border">
            {pet.vaccines.map((vaccine) => (
              <li key={vaccine.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5">
                <div>
                  <p className="font-bold">{vaccine.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Aplicada em {formatNumericDate(vaccine.appliedAt)} · válida até{" "}
                    <time dateTime={vaccine.validUntil} title={formatLocalDate(vaccine.validUntil)}>
                      {formatNumericDate(vaccine.validUntil)}
                    </time>
                  </p>
                </div>
                <VaccineBadge vaccine={vaccine} />
              </li>
            ))}
          </ul>
        )}
        <AddVaccineForm petId={pet.id} petName={pet.name} />
      </section>
    </article>
  );
}
