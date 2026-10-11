"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, Cat, Clock, Dog, Info } from "lucide-react";

import { AnimatedNumber } from "@/components/motion/animated-number";
import { Button } from "@/components/ui/button";
import { PET_SIZE_LABELS, sizeFromWeight } from "@/lib/business-rules";
import { formatCents, formatDuration } from "@/lib/format";
import {
  ADDONS,
  LONG_COAT_BREEDS,
  LONG_COAT_SERVICE_SLUGS,
  estimateQuote,
  quoteSearchParams,
  type QuoteServicePrices,
} from "@/lib/pricing-extras";
import { cn } from "@/lib/utils";

type Species = "CACHORRO" | "GATO";

const LONG_COAT_CATS = ["Persa", "Maine Coon", "Himalaio", "Angorá"];
const optionCard =
  "flex cursor-pointer items-center gap-3 rounded-2xl border-2 bg-card p-4 transition-transform duration-200 hover:-translate-y-0.5 has-[:checked]:border-primary has-[:checked]:bg-accent has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/60 active:scale-[0.98]";

function Group({ legend, children, hint }: { legend: string; children: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-1 text-sm font-extrabold tracking-wide uppercase">{legend}</legend>
      {children}
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
    </fieldset>
  );
}

/**
 * Simulador de orçamento: espécie, peso (→ porte), pelagem, serviço e adicionais, com preço ao vivo.
 * Os preços dos serviços vêm do banco (props); o cálculo é a mesma função pura testada em pricing-extras.
 * O botão leva ao agendamento com serviço e porte escolhidos e as observações preenchidas.
 */
export function QuoteSimulator({ services }: { services: readonly QuoteServicePrices[] }) {
  const id = useId();
  const [species, setSpecies] = useState<Species>("CACHORRO");
  const [weight, setWeight] = useState(8);
  const [longCoat, setLongCoat] = useState(false);
  const [serviceSlug, setServiceSlug] = useState(services[0]?.slug ?? "");
  const [addonIds, setAddonIds] = useState<string[]>([]);

  const size = sizeFromWeight(weight);
  const input = { serviceSlug, size, longCoat, addonIds };
  const quote = estimateQuote(input, services);
  const longCoatApplies = (LONG_COAT_SERVICE_SLUGS as readonly string[]).includes(serviceSlug);
  const examples = species === "GATO" ? LONG_COAT_CATS : LONG_COAT_BREEDS[size];

  function toggleAddon(addonId: string, checked: boolean) {
    setAddonIds((current) => (checked ? [...current, addonId] : current.filter((value) => value !== addonId)));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
      <form className="flex flex-col gap-8" onSubmit={(event) => event.preventDefault()} aria-label="Dados do orçamento">
        <Group legend="1. Espécie">
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                ["CACHORRO", "Cachorro", Dog],
                ["GATO", "Gato", Cat],
              ] as const
            ).map(([value, label, Icon]) => (
              <label key={value} className={optionCard}>
                <input
                  type="radio"
                  name={`${id}-especie`}
                  value={value}
                  checked={species === value}
                  onChange={() => setSpecies(value)}
                  className="sr-only"
                />
                <span className="grid size-10 place-items-center rounded-full bg-secondary/25" aria-hidden="true">
                  <Icon className="size-5 text-secondary-strong" />
                </span>
                <span className="font-extrabold">{label}</span>
              </label>
            ))}
          </div>
        </Group>

        <Group
          legend="2. Peso"
          hint={
            <>
              Porte <strong className="text-foreground">{size}</strong> ({PET_SIZE_LABELS[size].range}). O porte define o preço e a
              duração.
            </>
          }
        >
          <div className="flex items-center gap-4">
            <label htmlFor={`${id}-peso`} className="sr-only">
              Peso do pet em kg
            </label>
            <input
              id={`${id}-peso`}
              type="range"
              min={1}
              max={60}
              step={1}
              value={weight}
              onChange={(event) => setWeight(Number(event.target.value))}
              aria-valuetext={`${weight} kg, porte ${size}`}
              className="h-11 flex-1 cursor-pointer accent-[#a3501a]"
            />
            <output htmlFor={`${id}-peso`} className="w-20 shrink-0 rounded-2xl bg-muted py-2 text-center font-black tabular-nums">
              {weight} kg
            </output>
          </div>
        </Group>

        <Group
          legend="3. Pelagem"
          hint={longCoat ? `Ex.: ${examples.join(", ")}.` : "Pelo curto ou médio não tem acréscimo."}
        >
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                [false, "Curta ou média"],
                [true, "Longa"],
              ] as const
            ).map(([value, label]) => (
              <label key={label} className={optionCard}>
                <input
                  type="radio"
                  name={`${id}-pelagem`}
                  checked={longCoat === value}
                  onChange={() => setLongCoat(value)}
                  className="sr-only"
                />
                <span className="font-extrabold">{label}</span>
              </label>
            ))}
          </div>
        </Group>

        <Group legend="4. Serviço">
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <label key={service.slug} className={cn(optionCard, "justify-between")}>
                <input
                  type="radio"
                  name={`${id}-servico`}
                  value={service.slug}
                  checked={serviceSlug === service.slug}
                  onChange={() => setServiceSlug(service.slug)}
                  className="sr-only"
                />
                <span className="font-extrabold">{service.name}</span>
                <span className="shrink-0 text-sm font-bold text-muted-foreground">
                  {formatCents(service.prices[size].priceCents)}
                </span>
              </label>
            ))}
          </div>
        </Group>

        <Group legend="5. Adicionais (opcional)">
          <div className="grid gap-3 sm:grid-cols-2">
            {ADDONS.map((addon) => (
              <label key={addon.id} className={cn(optionCard, "justify-between")}>
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={addonIds.includes(addon.id)}
                    onChange={(event) => toggleAddon(addon.id, event.target.checked)}
                    className="size-5 shrink-0 accent-[#a3501a]"
                  />
                  <span className="font-extrabold">{addon.name}</span>
                </span>
                <span className="shrink-0 text-sm font-bold text-muted-foreground">+ {formatCents(addon.priceCents)}</span>
              </label>
            ))}
          </div>
        </Group>

        {/* Celular: o total acompanha a rolagem (o resumo completo fica no fim). Deixa espaço para o botão do WhatsApp. */}
        {quote && (
          <a
            href={`#${id}-resumo-painel`}
            className="sticky bottom-4 z-10 mr-16 flex items-center justify-between gap-3 rounded-2xl bg-foreground px-5 py-3 text-background shadow-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 lg:hidden"
          >
            <span className="text-sm text-background/80">Total estimado</span>
            <span className="text-xl font-black text-primary tabular-nums" aria-hidden="true">
              {formatCents(quote.totalCents)}
            </span>
            <span className="sr-only">{formatCents(quote.totalCents)}. Ver resumo do orçamento.</span>
          </a>
        )}
      </form>

      <aside
        id={`${id}-resumo-painel`}
        aria-labelledby={`${id}-resumo`}
        className="flex scroll-mt-24 flex-col gap-5 rounded-2xl bg-foreground p-6 text-background shadow-xl lg:sticky lg:top-24 md:p-8"
      >
        <h3 id={`${id}-resumo`} className="text-sm font-extrabold tracking-wide text-background/80 uppercase">
          Seu orçamento
        </h3>
        {quote ? (
          <>
            <p className="flex flex-col">
              <span className="text-sm text-background/80">Total estimado</span>
              <AnimatedNumber
                value={quote.totalCents}
                format={formatCents}
                className="font-[family-name:var(--font-fraunces)] text-5xl font-black text-primary"
              />
            </p>
            <ul className="flex flex-col gap-2 border-y border-background/15 py-4 text-sm">
              {quote.lines.map((line) => (
                <li key={line.label} className="flex justify-between gap-4">
                  <span>{line.label}</span>
                  <span className="font-bold tabular-nums">{formatCents(line.cents)}</span>
                </li>
              ))}
            </ul>
            <p className="flex items-center gap-2 text-sm text-background/80">
              <Clock className="size-4" aria-hidden="true" /> Duração do serviço: {formatDuration(quote.durationMinutes)}
            </p>
            {longCoat && !longCoatApplies && (
              <p className="text-sm text-background/80">Pelagem longa não altera o preço deste serviço.</p>
            )}
            <Button asChild size="lg" className="h-14 text-base">
              <Link href={`/agendar?${quoteSearchParams(input)}`}>
                Agendar com este orçamento <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <p className="flex gap-2 text-xs text-background/75">
              <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              No agendamento você confirma o preço do serviço. Pelagem longa e adicionais são conferidos na chegada,
              sempre com aviso antes.
            </p>
          </>
        ) : (
          <p>Escolha um serviço para ver o valor.</p>
        )}
      </aside>
    </div>
  );
}
