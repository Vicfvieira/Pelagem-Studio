import type { Metadata } from "next";
import { Check, Sparkles } from "lucide-react";

import { DeferredApplicationForm } from "@/components/careers/deferred-application-form";
import { PageHeader } from "@/components/content/page-header";
import { BENEFITS, JOB_ROLES } from "@/content/careers";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Trabalhe conosco",
  description: "Vagas para banhista e tosador(a) no Pelagem Studio, na Vila Madalena. Envie sua candidatura.",
  alternates: { canonical: "/trabalhe-conosco" },
};

export default function CareersPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-14 px-4 py-12 md:py-16">
      <PageHeader id="vagas-titulo" eyebrow="Vagas abertas" title="Gosta de bicho e tem paciência de sobra?">
        <p>
          Somos cinco pessoas num estúdio pequeno na {SITE.address.neighborhood}. Procuramos quem trate cada pet como
          se fosse o único do dia, porque aqui ele quase é.
        </p>
      </PageHeader>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-8">
          <section aria-labelledby="lista-vagas-titulo" className="flex flex-col gap-4">
            <h2 id="lista-vagas-titulo" className="text-2xl font-black tracking-tight">
              Vagas
            </h2>
            <ul className="flex flex-col gap-3">
              {JOB_ROLES.map((role) => (
                <li key={role.id} className="flex flex-col gap-1 rounded-2xl border bg-card p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-black">{role.label}</h3>
                    <span
                      className={
                        role.open
                          ? "rounded-full bg-secondary px-3 py-0.5 text-xs font-extrabold"
                          : "rounded-full bg-muted px-3 py-0.5 text-xs font-bold text-muted-foreground"
                      }
                    >
                      {role.open ? "Aberta" : "Banco de talentos"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{role.summary}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="beneficios-titulo" className="flex flex-col gap-4 rounded-2xl bg-accent p-6">
            <h2 id="beneficios-titulo" className="flex items-center gap-2 text-2xl font-black tracking-tight">
              <Sparkles className="size-5 text-primary-strong" aria-hidden="true" /> O que oferecemos
            </h2>
            <ul className="flex flex-col gap-2 text-sm">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-secondary-strong" aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section
          id="formulario"
          aria-labelledby="formulario-titulo"
          className="relative flex scroll-mt-24 flex-col gap-6 rounded-2xl border bg-card p-6 shadow-sm md:p-8"
        >
          <div className="flex flex-col gap-1">
            <h2 id="formulario-titulo" className="text-2xl font-black tracking-tight">
              Envie sua candidatura
            </h2>
            <p className="text-sm text-muted-foreground">Leva uns 3 minutos. Todos os campos são obrigatórios.</p>
          </div>
          <DeferredApplicationForm />
        </section>
      </div>
    </div>
  );
}
