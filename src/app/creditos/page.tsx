import type { Metadata } from "next";
import { Camera, Code2, PenTool, Shapes, Type } from "lucide-react";

import { PageHeader } from "@/components/content/page-header";
import { publishedPhotos } from "@/content/photos";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Créditos",
  description: "Fotos, ilustrações, fontes e ícones usados no site do Pelagem Studio, com autores e licenças.",
  alternates: { canonical: "/creditos" },
};

const RESOURCES = [
  {
    icon: Type,
    title: "Tipografia",
    items: [
      {
        name: "Fraunces",
        detail: "Undercase Type · SIL Open Font License 1.1 · títulos",
        url: "https://fonts.google.com/specimen/Fraunces",
      },
      {
        name: "Nunito",
        detail: "Vernon Adams e colaboradores · SIL Open Font License 1.1 · textos",
        url: "https://fonts.google.com/specimen/Nunito",
      },
    ],
  },
  {
    icon: Shapes,
    title: "Ícones",
    items: [{ name: "Lucide", detail: "Comunidade Lucide · licença ISC", url: "https://lucide.dev" }],
  },
  {
    icon: Code2,
    title: "Tecnologia",
    items: [
      { name: "Next.js, React e Tailwind CSS", detail: "licença MIT", url: "https://nextjs.org" },
      { name: "Motion", detail: "animações · licença MIT", url: "https://motion.dev" },
    ],
  },
] as const;

const linkClass =
  "font-bold text-primary-strong underline underline-offset-4 outline-none hover:no-underline focus-visible:ring-[3px] focus-visible:ring-ring/60 rounded";

export default function CreditsPage() {
  const photos = publishedPhotos();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 px-4 py-12 md:py-16">
      <PageHeader id="creditos-titulo" eyebrow="Quem fez cada parte" title="Créditos">
        <p>
          O {SITE.name} é fictício: marca, textos, equipe, depoimentos, CNPJ e endereço foram criados para este
          portfólio. Abaixo, a origem de cada imagem e recurso visual.
        </p>
      </PageHeader>

      <section aria-labelledby="fotos-titulo" className="flex flex-col gap-4 rounded-2xl border bg-card p-6 md:p-8">
        <h2 id="fotos-titulo" className="flex items-center gap-3 text-2xl font-black tracking-tight">
          <Camera className="size-6 text-primary-strong" aria-hidden="true" /> Fotografias
        </h2>
        {photos.length > 0 ? (
          <ul className="flex flex-col divide-y">
            {photos.map((photo) => (
              <li key={photo.slot} className="flex flex-col gap-1 py-3 text-sm">
                <span className="font-bold">{photo.usedOn}</span>
                <span className="text-muted-foreground">
                  Foto de{" "}
                  <a href={photo.credit.authorUrl} className={linkClass} target="_blank" rel="noopener noreferrer">
                    {photo.credit.author}
                  </a>{" "}
                  no{" "}
                  <a href={photo.credit.sourceUrl} className={linkClass} target="_blank" rel="noopener noreferrer">
                    {photo.credit.source}
                  </a>{" "}
                  · {photo.credit.license}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            Nenhuma fotografia publicada ainda. Todas as imagens do site são ilustrações próprias (veja abaixo). Quando
            entrarem fotos, cada uma terá autor, fonte e licença listados aqui.
          </p>
        )}
      </section>

      <section
        aria-labelledby="ilustracoes-titulo"
        className="flex flex-col gap-4 rounded-2xl border bg-card p-6 md:p-8"
      >
        <h2 id="ilustracoes-titulo" className="flex items-center gap-3 text-2xl font-black tracking-tight">
          <PenTool className="size-6 text-primary-strong" aria-hidden="true" /> Ilustrações
        </h2>
        <p className="text-muted-foreground">
          O cachorro na banheira, o antes e depois, o mapa do bairro, os avatares da equipe e as formas orgânicas foram
          desenhados em SVG especialmente para este projeto por {SITE.author}, sem uso de bancos de imagem.
        </p>
      </section>

      {RESOURCES.map((group) => (
        <section
          key={group.title}
          aria-labelledby={`${group.title}-titulo`}
          className="flex flex-col gap-4 rounded-2xl border bg-card p-6 md:p-8"
        >
          <h2 id={`${group.title}-titulo`} className="flex items-center gap-3 text-2xl font-black tracking-tight">
            <group.icon className="size-6 text-primary-strong" aria-hidden="true" /> {group.title}
          </h2>
          <ul className="flex flex-col divide-y">
            {group.items.map((item) => (
              <li key={item.name} className="flex flex-col gap-0.5 py-3 text-sm">
                <a href={item.url} className={`${linkClass} w-fit`} target="_blank" rel="noopener noreferrer">
                  {item.name}
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
                <span className="text-muted-foreground">{item.detail}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
