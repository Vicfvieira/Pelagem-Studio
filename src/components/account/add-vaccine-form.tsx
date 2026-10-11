"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Os campos (react-hook-form + Zod) só são baixados quando o formulário abre. */
const VaccineFormFields = dynamic(() => import("@/components/account/vaccine-form-fields"), {
  loading: () => (
    <div className="h-56 animate-pulse rounded-2xl bg-muted motion-reduce:animate-none" aria-hidden="true" />
  ),
});

export function AddVaccineForm({ petId, petName }: { petId: string; petName: string }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button type="button" variant="ghost" size="sm" className="w-fit" onClick={() => setOpen(true)}>
        <Plus aria-hidden="true" /> Registrar vacina<span className="sr-only"> de {petName}</span>
      </Button>
    );
  }

  return (
    <VaccineFormFields petId={petId} petName={petName} onSaved={() => setOpen(false)} onCancel={() => setOpen(false)} />
  );
}
