import type { Metadata } from "next";
import { Car } from "lucide-react";

import { ServicesCatalog } from "@/components/services/services-catalog";
import { PET_SIZE_LABELS, PET_SIZES } from "@/lib/business-rules";
import { getServicesCatalog, getTaxiFees } from "@/lib/data/services";
import { formatCents, formatDuration } from "@/lib/format";

export const metadata: Metadata = {
  title: "Serviços e preços",
  description:
    "Banho, tosa, hidratação e corte de unhas com preço e duração por porte (P, M e G). Agende online.",
  alternates: { canonical: "/servicos" },
};

function joinNames(names: string[]): string {
  return names.length <= 1 ? names.join("") : `${names.slice(0, -1).join(", ")} e ${names.at(-1)}`;
}

export default async function ServicesPage() {
  const [services, taxiFees] = await Promise.all([getServicesCatalog(), getTaxiFees()]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-12 md:py-16">
      <section aria-labelledby="servicos-titulo" className="flex flex-col gap-8">
        <header className="mx-auto flex max-w-2xl flex-col gap-3 text-center">
          <h1 id="servicos-titulo" className="text-4xl font-black tracking-tight">
            Serviços e preços
          </h1>
          <p className="text-lg text-muted-foreground">
            Escolha o porte do seu pet para ver o preço e o tempo de cada serviço. O valor é
            confirmado no agendamento, sem taxas escondidas.
          </p>
        </header>

        {services.length > 0 ? (
          <ServicesCatalog services={services} />
        ) : (
          <p className="rounded-2xl border bg-card p-6 text-center">
            Nenhum serviço disponível no momento. Fale com a gente pelo WhatsApp.
          </p>
        )}
      </section>

      {services.length > 0 && (
        <section aria-labelledby="tabela-titulo" className="flex flex-col gap-4">
          <h2 id="tabela-titulo" className="text-2xl font-black tracking-tight">
            Tabela completa
          </h2>
          <div className="overflow-x-auto rounded-2xl border bg-card" tabIndex={0} role="region" aria-labelledby="tabela-titulo">
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
                        <span className="text-muted-foreground"> · {formatDuration(service.prices[size].durationMinutes)}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {taxiFees.length > 0 && (
        <section
          aria-labelledby="taxi-titulo"
          className="flex flex-col gap-4 rounded-2xl bg-secondary/20 p-6 md:flex-row md:items-center md:gap-8"
        >
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-secondary" aria-hidden="true">
            <Car className="size-7" />
          </span>
          <div className="flex flex-col gap-2">
            <h2 id="taxi-titulo" className="text-xl font-black">
              Táxi dog na capital
            </h2>
            <p className="text-muted-foreground">
              Buscamos e levamos seu pet em São Paulo (capital). A taxa é calculada pelo CEP no agendamento:
            </p>
            <ul className="flex flex-wrap gap-2">
              {taxiFees.map((fee) => (
                <li key={fee.feeCents} className="rounded-full bg-card px-4 py-1.5 text-sm font-bold">
                  {joinNames(fee.zones)}: {formatCents(fee.feeCents)}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
