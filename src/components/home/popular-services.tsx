import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";

import { Doodle } from "@/components/home/doodles";
import { ServiceIcon } from "@/components/services/service-icon";
import { PET_SIZES } from "@/lib/business-rules";
import { getServicesCatalog } from "@/lib/data/services";
import { formatCents, formatDuration } from "@/lib/format";

/** Faixa "os mais pedidos": os 5 serviços do banco com o menor preço entre os portes. */
export async function PopularServices() {
  const services = await getServicesCatalog();
  if (services.length === 0) return null;

  return (
    <section aria-labelledby="mais-pedidos-titulo" className="mx-auto max-w-6xl px-4 pt-6 pb-12">
      <div className="relative rounded-3xl border bg-card p-5 pt-9 shadow-sm sm:p-6 sm:pt-10">
        <h2
          id="mais-pedidos-titulo"
          className="absolute -top-4 left-5 flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-black shadow-md"
        >
          Os mais pedidos
          <Doodle kind="paw" className="size-4 text-foreground/70" />
        </h2>
        <ul className="-mx-2 flex snap-x gap-2 overflow-x-auto px-2 pb-1 [scrollbar-width:thin] lg:grid lg:grid-cols-5 lg:overflow-visible">
          {services.map((service) => {
            const from = Math.min(...PET_SIZES.map((size) => service.prices[size].priceCents));
            const minutes = PET_SIZES.map((size) => service.prices[size].durationMinutes);
            return (
              <li key={service.slug} className="w-60 shrink-0 snap-start lg:w-auto">
                <Link
                  href={`/agendar?servico=${service.slug}`}
                  className="group flex h-full items-center gap-3 rounded-2xl p-3 outline-none hover:bg-accent/60 focus-visible:ring-[3px] focus-visible:ring-ring/60"
                >
                  <ServiceIcon slug={service.slug} className="size-14 shrink-0 transition-transform duration-300 group-hover:-rotate-6" />
                  <span className="flex min-w-0 flex-col">
                    <span className="flex items-center gap-1 text-sm leading-tight font-extrabold">
                      {service.name}
                      <ArrowUpRight
                        className="size-3.5 shrink-0 text-primary-strong opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-sm font-black text-primary-strong">
                      <span className="text-xs font-semibold text-muted-foreground">a partir de </span>
                      {formatCents(from)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" aria-hidden="true" />
                      {Math.min(...minutes) === Math.max(...minutes)
                        ? formatDuration(minutes[0])
                        : `${formatDuration(Math.min(...minutes))} a ${formatDuration(Math.max(...minutes))}`}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
