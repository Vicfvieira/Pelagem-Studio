"use client";

import { useId, useState } from "react";
import dynamic from "next/dynamic";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Os campos (react-hook-form + Zod) só são baixados quando o formulário abre. */
const PetFormFields = dynamic(() => import("@/components/account/pet-form-fields"), {
  loading: () => (
    <div className="h-96 animate-pulse rounded-2xl bg-muted motion-reduce:animate-none" aria-hidden="true" />
  ),
});

export function AddPetForm({ startOpen = false }: { startOpen?: boolean }) {
  const [open, setOpen] = useState(startOpen);
  const [success, setSuccess] = useState<string | null>(null);
  const panelId = useId();

  return (
    <div className="flex flex-col gap-4">
      <p role="status" className={success ? "font-semibold text-secondary-strong" : "sr-only"}>
        {success}
      </p>
      {!open ? (
        <Button
          type="button"
          variant="secondary"
          className="w-fit"
          aria-expanded={false}
          aria-controls={panelId}
          onClick={() => {
            setSuccess(null);
            setOpen(true);
          }}
        >
          <Plus aria-hidden="true" /> Cadastrar pet
        </Button>
      ) : (
        <PetFormFields
          panelId={panelId}
          onSaved={(message) => {
            setSuccess(message);
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      )}
    </div>
  );
}
