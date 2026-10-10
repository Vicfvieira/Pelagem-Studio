import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";

import { TiltCard } from "@/components/motion";
import { ServiceIcon } from "@/components/services/service-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getFeaturedServices } from "@/lib/data/services";
import { formatCents, formatDuration } from "@/lib/format";

export async function FeaturedServices() {
  const services = await getFeaturedServices();

  return (
    <section aria-labelledby="servicos-titulo" className="bg-muted/60">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 flex flex-col gap-2 text-center">
          <h2 id="servicos-titulo" className="text-3xl font-black tracking-tight">
            Serviços em destaque
          </h2>
          <p className="text-muted-foreground">Preço e duração variam conforme o porte: P, M ou G.</p>
        </div>

        <ul className="grid gap-6 md:grid-cols-3">
          {services.map((service) => {
            const duration =
              service.minDurationMinutes === service.maxDurationMinutes
                ? formatDuration(service.minDurationMinutes)
                : `${formatDuration(service.minDurationMinutes)} a ${formatDuration(service.maxDurationMinutes)}`;

            return (
              <li key={service.slug}>
                <TiltCard>
                  <Card className="h-full transition-shadow duration-300 hover:shadow-lg">
                    <CardHeader>
                      <ServiceIcon slug={service.slug} className="mb-2" />
                      <CardTitle>{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        a partir de{" "}
                        <span className="text-2xl font-black text-foreground">
                          {formatCents(service.fromPriceCents)}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">Duração: {duration}</p>
                    </CardContent>
                  </Card>
                </TiltCard>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/precos#simulador">
              <Calculator aria-hidden="true" /> Simular orçamento
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/servicos">
              Ver todos os serviços <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
