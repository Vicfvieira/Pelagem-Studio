"use client";

import { useFormContext } from "react-hook-form";

import { OptionCard } from "@/components/booking/option-card";
import { ServiceIcon } from "@/components/services/service-icon";
import type { PetSizeCode } from "@/lib/business-rules";
import type { CatalogService } from "@/lib/data/services";
import { formatCents, formatDuration } from "@/lib/format";
import type { BookingInput } from "@/lib/validation/booking";

export function StepService({ services, size }: { services: CatalogService[]; size: PetSizeCode }) {
  const { register } = useFormContext<BookingInput>();

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 text-sm text-muted-foreground">Preços para porte {size}.</legend>
      {services.map((service) => {
        const { priceCents, durationMinutes } = service.prices[size];
        return (
          <OptionCard key={service.slug} value={service.slug} {...register("servico")}>
            <ServiceIcon slug={service.slug} />
            <span className="flex flex-1 flex-col">
              <span className="font-extrabold">{service.name}</span>
              <span className="text-sm text-muted-foreground">{formatDuration(durationMinutes)}</span>
            </span>
            <span className="text-lg font-black">{formatCents(priceCents)}</span>
          </OptionCard>
        );
      })}
    </fieldset>
  );
}
