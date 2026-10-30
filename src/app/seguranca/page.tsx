import type { Metadata } from "next";
import Link from "next/link";
import {
  Droplets,
  HeartPulse,
  Leaf,
  ShieldCheck,
  SprayCan,
  Stethoscope,
  Syringe,
  Thermometer,
  Wind,
} from "lucide-react";

import { PageHeader } from "@/components/content/page-header";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { SLOT_CAPACITY } from "@/lib/business-rules";

export const metadata: Metadata = {
  title: "Segurança e bem-estar",
  description:
    "Avaliação na chegada, produtos hipoalergênicos, secagem sem calor excessivo e cuidados com idosos, ansiosos e braquicefálicos.",
  alternates: { canonical: "/seguranca" },
};

const PROTOCOL = [
  {
    icon: Stethoscope,
    title: "Avaliação na chegada",
    text: "Antes de molhar, olhamos pele, orelhas, olhos, unhas e nós, e conferimos a carteirinha de vacinas. Qualquer alteração é mostrada ao tutor na hora.",
  },
  {
    icon: Leaf,
    title: "Produtos hipoalergênicos",
    text: "Shampoo e condicionador de pH neutro, sem parabenos e sem corantes, com registro no Ministério da Agricultura. Shampoo terapêutico só com receita do veterinário.",
  },
  {
    icon: Thermometer,
    title: "Água na temperatura certa",
    text: "Água morna, conferida com termômetro, e ouvidos protegidos com algodão durante todo o banho.",
  },
  {
    icon: Wind,
    title: "Secagem sem calor excessivo",
    text: "Soprador em temperatura baixa e secador sempre em movimento, longe do rosto. Nenhum pet fica sozinho em cabine de secagem.",
  },
  {
    icon: HeartPulse,
    title: "Pausas e observação",
    text: `Com no máximo ${SLOT_CAPACITY} pets por horário, cada banhista acompanha um pet do início ao fim e faz pausas sempre que ele precisa.`,
  },
  {
    icon: ShieldCheck,
    title: "Sem sedação, sem força",
    text: "Nunca sedamos. Se o estresse não baixa, paramos o atendimento e ligamos para o tutor.",
  },
] as const;

const SPECIAL_CARE = [
  {
    title: "Idosos",
    text: "Banho em etapas, tapete antiderrapante e o pet sentado quando precisa. Atenção às articulações na hora de secar e escovar.",
  },
  {
    title: "Ansiosos",
    text: "Horários mais calmos, adaptação antes de molhar, secador na potência mínima e petiscos (os do tutor, se ele preferir).",
  },
  {
    title: "Braquicefálicos",
    text: "Pug, bulldog, shih-tzu e outros de focinho curto: sala climatizada, ar frio ou morno, pausas para respirar e dobras secas por completo.",
  },
] as const;

const CLEANING = [
  "Box, mesa e banheira higienizados com desinfetante de uso veterinário entre um pet e outro.",
  "Toalhas individuais, lavadas a 60 °C a cada uso.",
  "Escovas, pentes e lâminas esterilizados em estufa; lâminas trocadas por pet.",
  "Higienização reforçada do box sempre que encontramos pulgas ou carrapatos.",
];

export default function SafetyPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-20 px-4 py-12 md:py-16">
      <PageHeader id="seguranca-titulo" eyebrow="Protocolo de bem-estar" title="Segurança vem antes da tosa bonita">
        <p>
          Cada atendimento segue o mesmo protocolo, do primeiro banho ao centésimo. Ele foi revisado com
          veterinários parceiros e é o que a equipe aprende no primeiro dia.
        </p>
      </PageHeader>

      <section aria-labelledby="protocolo-titulo" className="flex flex-col gap-8">
        <h2 id="protocolo-titulo" className="text-3xl font-black tracking-tight">
          O protocolo, passo a passo
        </h2>
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROTOCOL.map((step, index) => (
            <Reveal as="li" key={step.title} delay={(index % 3) * 0.08}>
              <article className="relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border bg-card p-6 shadow-sm">
                <span
                  className="absolute -top-3 -right-1 text-8xl font-black text-accent"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <span className="relative grid size-12 place-items-center rounded-2xl bg-primary" aria-hidden="true">
                  <step.icon className="size-6" />
                </span>
                <h3 className="relative text-xl font-black">
                  <span className="sr-only">Passo {index + 1}: </span>
                  {step.title}
                </h3>
                <p className="relative text-sm text-muted-foreground">{step.text}</p>
              </article>
            </Reveal>
          ))}
        </ol>
      </section>

      <section aria-labelledby="cuidados-titulo" className="grid gap-8 rounded-2xl bg-secondary/20 p-6 md:grid-cols-[1fr_2fr] md:p-10">
        <div className="flex flex-col gap-3">
          <h2 id="cuidados-titulo" className="text-3xl font-black tracking-tight">
            Cuidados especiais
          </h2>
          <p className="text-muted-foreground">
            Conte sobre o seu pet no campo de observações do agendamento. A gente se prepara antes de ele chegar.
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-3">
          {SPECIAL_CARE.map((item) => (
            <li key={item.title} className="flex flex-col gap-2 rounded-2xl bg-card p-5">
              <h3 className="text-lg font-black">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-8 md:grid-cols-2">
        <section aria-labelledby="higiene-titulo" className="flex flex-col gap-4 rounded-2xl border bg-card p-6 md:p-8">
          <span className="grid size-12 place-items-center rounded-2xl bg-secondary" aria-hidden="true">
            <SprayCan className="size-6" />
          </span>
          <h2 id="higiene-titulo" className="text-2xl font-black tracking-tight">
            Higienização entre atendimentos
          </h2>
          <ul className="flex flex-col gap-3">
            {CLEANING.map((item) => (
              <li key={item} className="flex gap-3 text-sm">
                <Droplets className="mt-0.5 size-4 shrink-0 text-secondary-strong" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="vacinas-titulo" className="flex flex-col gap-4 rounded-2xl border bg-card p-6 md:p-8">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary" aria-hidden="true">
            <Syringe className="size-6" />
          </span>
          <h2 id="vacinas-titulo" className="text-2xl font-black tracking-tight">
            Vacinas exigidas
          </h2>
          <dl className="grid gap-3 text-sm">
            <div className="rounded-2xl bg-muted p-4">
              <dt className="font-extrabold">Cães</dt>
              <dd className="text-muted-foreground">Polivalente (V8 ou V10) e antirrábica em dia.</dd>
            </div>
            <div className="rounded-2xl bg-muted p-4">
              <dt className="font-extrabold">Gatos</dt>
              <dd className="text-muted-foreground">Polivalente felina (V4 ou V5) e antirrábica em dia.</dd>
            </div>
            <div className="rounded-2xl bg-muted p-4">
              <dt className="font-extrabold">Recomendadas</dt>
              <dd className="text-muted-foreground">Gripe canina e giárdia, principalmente para quem frequenta creche ou parque.</dd>
            </div>
          </dl>
          <p className="text-sm text-muted-foreground">
            Filhotes podem vir 15 dias depois da última dose do protocolo inicial. Registre as vacinas na{" "}
            <Link href="/minha-conta#pets" className="font-bold text-primary-strong underline underline-offset-4">
              carteirinha digital
            </Link>{" "}
            e receba alerta antes de vencerem.
          </p>
        </section>
      </div>

      <section className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-2xl font-black tracking-tight">Ficou alguma dúvida sobre o atendimento?</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/agendar">Agendar um horário</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/perguntas-frequentes">Ver perguntas frequentes</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
