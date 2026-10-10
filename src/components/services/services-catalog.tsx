"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarPlus, Clock } from "lucide-react";

import { ServiceIcon } from "@/components/services/service-icon";
import { SizeSelector } from "@/components/services/size-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { PET_SIZE_LABELS, type PetSizeCode } from "@/lib/business-rules";
import type { CatalogService } from "@/lib/data/services";
import { formatCents, formatDuration } from "@/lib/format";

function bookingHref(slug: string, size: PetSizeCode): string {
  return `/agendar?${new URLSearchParams({ servico: slug, porte: size })}`;
}

/**
 * Os preços dos três portes já chegam do servidor; trocar o porte só muda o estado local,
 * sem nova requisição. O valor final é recalculado no servidor ao confirmar o agendamento.
 */
export function ServicesCatalog({ services }: { services: CatalogService[] }) {
  const [size, setSize] = useState<PetSizeCode>("P");
  const sizeLabel = PET_SIZE_LABELS[size];

  return (
    <div className="flex flex-col gap-8">
      <SizeSelector value={size} onChange={setSize} className="mx-auto w-full max-w-xl" />

      <p aria-live="polite" className="text-center text-sm font-semibold text-muted-foreground">
        Mostrando preços para porte {size} ({sizeLabel.name.toLowerCase()}, {sizeLabel.range}).
      </p>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const { priceCents, durationMinutes } = service.prices[size];
          return (
            <li key={service.slug}>
              <Card className="h-full">
                <CardHeader>
                  <ServiceIcon slug={service.slug} className="mb-2" />
                  <h2 className="text-lg leading-tight font-extrabold">{service.name}</h2>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-end justify-between gap-4">
                  <p className="text-3xl font-black">{formatCents(priceCents)}</p>
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                    <Clock className="size-4" aria-hidden="true" />
                    <span>
                      <span className="sr-only">Duração: </span>
                      {formatDuration(durationMinutes)}
                    </span>
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={bookingHref(service.slug, size)}>
                      <CalendarPlus aria-hidden="true" />
                      Agendar este serviço
                      <span className="sr-only">
                        {" "}
                        {service.name} para porte {size}
                      </span>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
