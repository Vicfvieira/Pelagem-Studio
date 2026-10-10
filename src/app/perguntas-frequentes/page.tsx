import type { Metadata } from "next";
import Link from "next/link";

import { FaqTabs } from "@/components/content/faq-tabs";
import { JsonLd } from "@/components/content/json-ld";
import { PageHeader } from "@/components/content/page-header";
import { Button } from "@/components/ui/button";
import { FAQ, FAQ_COUNT } from "@/content/faq";
import { whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Perguntas frequentes",
  description: "Agendamento, preços, vacinas, segurança e táxi dog: as dúvidas mais comuns sobre o Pelagem Studio.",
  alternates: { canonical: "/perguntas-frequentes" },
};

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.flatMap((category) =>
      category.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    ),
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 md:py-16">
      <JsonLd data={faqJsonLd} />
      <PageHeader id="faq-titulo" eyebrow={`${FAQ_COUNT} respostas rápidas`} title="Perguntas frequentes">
        <p>Escolha um assunto. Se a sua dúvida não estiver aqui, a gente responde pelo WhatsApp.</p>
      </PageHeader>

      <FaqTabs categories={FAQ} />

      <section className="mx-auto flex w-full max-w-3xl flex-col items-start gap-4 rounded-2xl bg-secondary/20 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black">Não achou o que procurava?</h2>
          <p className="text-sm text-muted-foreground">Leia também as políticas de atendimento ou fale com a recepção.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/politicas">Políticas</Link>
          </Button>
          <Button asChild variant="secondary">
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              WhatsApp<span className="sr-only"> (abre em nova aba)</span>
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
