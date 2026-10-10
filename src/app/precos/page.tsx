import type { Metadata } from "next";
import Link from "next/link";
import { BadgePercent, Check, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/content/page-header";
import { Reveal, TiltCard } from "@/components/motion";
import { QuoteSimulator } from "@/components/quote/quote-simulator";
import { Button } from "@/components/ui/button";
import { PET_SIZE_LABELS, PET_SIZES } from "@/lib/business-rules";
import { getServicesCatalog } from "@/lib/data/services";
import { formatCents, formatDuration } from "@/lib/format";
import {
  ADDONS,
  LONG_COAT_BREEDS,
  LONG_COAT_SERVICE_SLUGS,
  LONG_COAT_SURCHARGE_CENTS,
  PLANS,
  quotePlan,
} from "@/lib/pricing-extras";

export const metadata: Metadata = {
  title: "Preços e planos",
  description:
    "Tabela de banho e tosa por porte, acréscimo para pelagem longa, adicionais e planos mensais com desconto.",
  alternates: { canonical: "/precos" },
};

export default async function PricesPage() {
  const services = await getServicesCatalog();
  const bath = services.find((service) => service.slug === "banho");
  const longCoatServices = services
    .filter((service) => (LONG_COAT_SERVICE_SLUGS as readonly string[]).includes(service.slug))
    .map((service) => service.name);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-20 px-4 py-12 md:py-16">
      <PageHeader id="precos-titulo" eyebrow="Sem taxa escondida" title="Preços claros, por porte">
        <p>
          O porte vem do peso: P até 10 kg, M de 10 a 25 kg e G acima de 25 kg. O valor do serviço aparece no
          agendamento antes de você confirmar.
        </p>
      </PageHeader>

      {services.length > 0 && (
        <section id="simulador" aria-labelledby="simulador-titulo" className="flex scroll-mt-24 flex-col gap-6">
          <div className="flex max-w-2xl flex-col gap-2">
            <h2 id="simulador-titulo" className="text-3xl font-black tracking-tight">
              Simule seu orçamento
            </h2>
            <p className="text-muted-foreground">
              Ajuste o peso, a pelagem e os adicionais: o valor muda na hora. Depois é só agendar.
            </p>
          </div>
          <QuoteSimulator services={services} />
        </section>
      )}

      {services.length > 0 && (
        <section aria-labelledby="tabela-precos-titulo" className="flex flex-col gap-4">
          <h2 id="tabela-precos-titulo" className="text-3xl font-black tracking-tight">
            Serviços
          </h2>
          <div
            className="overflow-x-auto rounded-2xl border bg-card"
            tabIndex={0}
            role="region"
            aria-labelledby="tabela-precos-titulo"
          >
            <table className="w-full min-w-[36rem] text-left text-sm">
              <caption className="sr-only">Preço e duração de cada serviço por porte</caption>
              <thead className="bg-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-extrabold">
                    Serviço
                  </th>
                  {PET_SIZES.map((size) => (
                    <th key={size} scope="col" className="px-4 py-3 font-extrabold">
                      Porte {size}{" "}
                      <span className="font-semibold text-muted-foreground">({PET_SIZE_LABELS[size].range})</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.slug} className="border-t">
                    <th scope="row" className="px-4 py-3 font-bold">
                      {service.name}
                    </th>
                    {PET_SIZES.map((size) => (
                      <td key={size} className="px-4 py-3">
                        <span className="font-bold">{formatCents(service.prices[size].priceCents)}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          · {formatDuration(service.prices[size].durationMinutes)}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section
        aria-labelledby="pelagem-titulo"
        className="grid gap-8 rounded-2xl bg-accent p-6 md:grid-cols-[1fr_1.4fr] md:p-10"
      >
        <div className="flex flex-col gap-3">
          <h2 id="pelagem-titulo" className="text-3xl font-black tracking-tight">
            Raças de pelagem longa
          </h2>
          <p className="text-muted-foreground">
            Pelo longo leva mais tempo para lavar, desembaraçar e secar. O acréscimo vale para{" "}
            {longCoatServices.join(", ").replace(/, ([^,]*)$/, " e $1")} e é confirmado na avaliação de chegada, sempre
            com aviso antes de começarmos.
          </p>
        </div>
        <ul className="grid gap-3">
          {PET_SIZES.map((size) => (
            <li
              key={size}
              className="flex flex-col gap-1 rounded-2xl bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            >
              <div>
                <p className="font-extrabold">
                  Porte {size}{" "}
                  <span className="font-semibold text-muted-foreground">({PET_SIZE_LABELS[size].range})</span>
                </p>
                <p className="text-sm text-muted-foreground">Ex.: {LONG_COAT_BREEDS[size].join(", ")}</p>
              </div>
              <p className="shrink-0 text-lg font-black text-primary-strong">
                + {formatCents(LONG_COAT_SURCHARGE_CENTS[size])}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="adicionais-titulo" className="flex flex-col gap-6">
        <h2 id="adicionais-titulo" className="text-3xl font-black tracking-tight">
          Adicionais
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ADDONS.map((addon, index) => (
            <Reveal as="li" key={addon.id} delay={index * 0.06}>
              <article className="flex h-full flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                <Sparkles className="size-6 text-primary-strong" aria-hidden="true" />
                <h3 className="text-lg font-black">{addon.name}</h3>
                <p className="flex-1 text-sm text-muted-foreground">{addon.description}</p>
                <p className="font-black">
                  {formatCents(addon.priceCents)}
                  {addon.unit && <span className="text-sm font-semibold text-muted-foreground"> {addon.unit}</span>}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>
      </section>

      {bath && (
        <section aria-labelledby="planos-titulo" className="flex flex-col gap-6">
          <div className="flex max-w-2xl flex-col gap-2">
            <h2 id="planos-titulo" className="text-3xl font-black tracking-tight">
              Planos mensais
            </h2>
            <p className="text-muted-foreground">
              Para quem já tem rotina de banho. O valor é calculado sobre o preço avulso do banho de cada porte.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {PLANS.map((plan, index) => (
              <Reveal key={plan.id} delay={index * 0.08}>
                <TiltCard max={3}>
                  <article
                    className={
                      index === PLANS.length - 1
                        ? "flex h-full flex-col gap-5 rounded-2xl border-2 border-primary bg-card p-6 shadow-lg md:p-8"
                        : "flex h-full flex-col gap-5 rounded-2xl border bg-card p-6 shadow-sm md:p-8"
                    }
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-black">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                      </div>
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm font-extrabold">
                        <BadgePercent className="size-4" aria-hidden="true" />
                        {plan.discountPercent}% off
                      </span>
                    </div>
                    <table className="w-full text-left text-sm">
                      <caption className="sr-only">Valor mensal do {plan.name} por porte</caption>
                      <thead>
                        <tr className="text-muted-foreground">
                          <th scope="col" className="py-2 font-bold">
                            Porte
                          </th>
                          <th scope="col" className="py-2 font-bold">
                            Avulso
                          </th>
                          <th scope="col" className="py-2 font-bold">
                            No plano
                          </th>
                          <th scope="col" className="py-2 font-bold">
                            Economia
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {PET_SIZES.map((size) => {
                          const quote = quotePlan(plan, bath.prices[size].priceCents);
                          return (
                            <tr key={size} className="border-t">
                              <th scope="row" className="py-2 font-extrabold">
                                {size}
                              </th>
                              <td className="py-2 text-muted-foreground line-through">
                                {formatCents(quote.fullPriceCents)}
                              </td>
                              <td className="py-2 font-black">{formatCents(quote.planPriceCents)}/mês</td>
                              <td className="py-2 font-bold text-secondary-strong">
                                {formatCents(quote.savingsCents)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <ul className="flex flex-col gap-2 text-sm">
                      <li className="flex gap-2">
                        <Check className="size-4 shrink-0 text-secondary-strong" aria-hidden="true" />
                        {plan.bathsPerMonth} banhos por mês
                      </li>
                      {plan.perks.map((perk) => (
                        <li key={perk} className="flex gap-2">
                          <Check className="size-4 shrink-0 text-secondary-strong" aria-hidden="true" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </article>
                </TiltCard>
              </Reveal>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Planos são contratados na recepção ou pelo WhatsApp, sem fidelidade: dá para cancelar no fim de qualquer
            mês.
          </p>
        </section>
      )}

      <section className="flex flex-col items-center gap-4 rounded-2xl bg-foreground p-8 text-center text-background md:p-12">
        <h2 className="text-3xl font-black tracking-tight">Pronto para o próximo banho?</h2>
        <p className="max-w-xl text-background/80">
          Escolha o serviço, veja o horário livre e confirme em poucos minutos.
        </p>
        <Button asChild size="lg">
          <Link href="/agendar">Agendar agora</Link>
        </Button>
      </section>
    </div>
  );
}
