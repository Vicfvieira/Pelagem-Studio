import { Star } from "lucide-react";

/** Depoimentos FICTÍCIOS, criados para o portfólio. */
const TESTIMONIALS = [
  {
    quote:
      "A Paçoca morria de medo do secador e voltou para casa tranquila e cheirosa. Dá para ver o cuidado da equipe.",
    author: "Marina S.",
    pet: "tutora da Paçoca, Shih-tzu",
  },
  {
    quote:
      "O táxi dog salvou minha rotina. Agendo pelo celular em dois minutos e o Thor volta lindo no fim da tarde.",
    author: "Rafael M.",
    pet: "tutor do Thor, Golden Retriever",
  },
  {
    quote:
      "Gosto de saber o preço antes e de ver o lembrete do próximo banho. Atendimento pontual, sem fila.",
    author: "Juliana P.",
    pet: "tutora da Luna, vira-lata caramelo",
  },
];

export function Testimonials() {
  return (
    <section id="depoimentos" aria-labelledby="depoimentos-titulo" className="scroll-mt-20 bg-muted/60">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 id="depoimentos-titulo" className="mb-10 text-center text-3xl font-black tracking-tight">
          Quem já veio, volta
        </h2>
        <ul className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <li key={item.author}>
              <figure className="flex h-full flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm">
                <p className="flex gap-0.5" role="img" aria-label="Avaliação: 5 de 5 estrelas">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="size-5 fill-primary text-primary" aria-hidden="true" />
                  ))}
                </p>
                <blockquote className="flex-1 text-base">“{item.quote}”</blockquote>
                <figcaption className="text-sm">
                  <span className="font-extrabold">{item.author}</span>
                  <span className="text-muted-foreground"> · {item.pet}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
