"use client";

import Link from "next/link";
import { Cat, Dog } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { OptionCard } from "@/components/booking/option-card";
import type { WizardPet } from "@/components/booking/types";
import { Button } from "@/components/ui/button";
import { PET_SIZE_LABELS } from "@/lib/business-rules";
import type { BookingInput } from "@/lib/validation/booking";

export function StepPet({ pets }: { pets: WizardPet[] }) {
  const { register } = useFormContext<BookingInput>();

  if (pets.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl border bg-card p-6">
        <p>Você ainda não tem pets cadastrados. Cadastre seu pet em Minha conta para agendar.</p>
        <Button asChild>
          <Link href="/minha-conta">Ir para Minha conta</Link>
        </Button>
      </div>
    );
  }

  return (
    <fieldset>
      <legend className="sr-only">Escolha o pet</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {pets.map((pet) => {
          const Icon = pet.species === "GATO" ? Cat : Dog;
          return (
            <OptionCard key={pet.id} value={pet.id} {...register("petId")}>
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary/30" aria-hidden="true">
                <Icon className="size-6 text-secondary-strong" />
              </span>
              <span className="flex flex-col">
                <span className="text-lg font-extrabold">{pet.name}</span>
                <span className="text-sm text-muted-foreground">
                  {pet.breed} · Porte {pet.size} ({PET_SIZE_LABELS[pet.size].range})
                </span>
              </span>
            </OptionCard>
          );
        })}
      </div>
    </fieldset>
  );
}
