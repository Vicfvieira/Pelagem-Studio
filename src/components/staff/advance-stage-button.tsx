"use client";

import { useState, useTransition } from "react";
import type { GroomingStage } from "@prisma/client";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { advanceStageAction } from "@/lib/tracking/actions";

export function AdvanceStageButton({
  appointmentId,
  expectedStage,
  label,
}: {
  appointmentId: string;
  expectedStage: GroomingStage | null;
  label: string;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  return (
    <div className="flex flex-col items-start gap-1.5">
      <Button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await advanceStageAction({ appointmentId, expectedStage });
            setMessage({ ok: result.ok, text: result.message });
          })
        }
      >
        {pending ? "Salvando..." : label} <ArrowRight aria-hidden="true" />
      </Button>
      <p role="status" className={message?.ok === false ? "text-sm font-semibold text-destructive" : "text-sm text-muted-foreground"}>
        {message?.text}
      </p>
    </div>
  );
}
