import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";

import { TiltCard } from "@/components/motion";
import { OrganicDivider } from "@/components/layout/organic-divider";
import { ServiceIcon } from "@/components/services/service-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getFeaturedServices } from "@/lib/data/services";
import { formatCents, formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";

export async function FeaturedServices() {
  const services = await getFeaturedServices();

  return (
    <section aria-labelledby="servicos-titulo">
      <OrganicDivider className="text-muted" />
      <div className="texture-paper bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 id="servicos-titulo" className="max-w-md text-3xl font-black tracking-tight sm:text-4xl">
              Os três serviços mais pedidos
            </h2>
            <p className="max-w-sm text-muted-foreground">
              Preço e duração mudam com o porte: P até 10 kg, M de 10 a 25 kg e G acima de 25 kg.
            </p>
          </div>

          {/* Assimétrico: o mais pedido ocupa duas linhas; os outros empilham ao lado. */}
          <ul className="grid gap-6 lg:grid-cols-2">
            {services.map((service, index) => {
              const featured = index === 0;
              const duration =
                service.minDurationMinutes === service.maxDurationMinutes
                  ? formatDuration(service.minDurationMinutes)
                  : `${formatDuration(service.minDurationMinutes)} a ${formatDuration(service.maxDurationMinutes)}`;

              return (
                <li key={service.slug} className={featured ? "lg:row-span-2" : undefined}>
                  <TiltCard>
                    <Card
                      className={cn(
                        "h-full transition-shadow duration-300 hover:shadow-lg",
                        featured && "border-primary/40 bg-accent md:p-10",
                      )}
                    >
                      <CardHeader>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <ServiceIcon slug={service.slug} className={featured ? "size-16 bg-card" : undefined} />
                          {featured && (
                            <span className="rounded-full bg-foreground px-3 py-1 text-xs font-extrabold text-background">
                              Mais pedido
                            </span>
                          )}
                        </div>
                        <CardTitle className={featured ? "text-3xl font-black" : undefined}>{service.name}</CardTitle>
                        <CardDescription className={featured ? "text-base" : undefined}>
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className={featured ? "mt-auto" : undefined}>
                        <p className="text-sm text-muted-foreground">
                          a partir de{" "}
                          <span className={cn("font-black text-foreground", featured ? "text-4xl" : "text-2xl")}>
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
      </div>
      <OrganicDivider flip className="text-muted" />
    </section>
  );
}
