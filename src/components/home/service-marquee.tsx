import { Marquee } from "@/components/motion";

/** Bairros com táxi dog mais pedido (o táxi atende toda a capital, por zona). */
const NEIGHBORHOODS = [
  "Vila Madalena",
  "Pinheiros",
  "Perdizes",
  "Pompeia",
  "Vila Mariana",
  "Moema",
  "Itaim Bibi",
  "Jardins",
  "Butantã",
  "Lapa",
  "Santa Cecília",
  "Higienópolis",
];

const SERVICES = ["Banho", "Banho + Tosa higiênica", "Tosa completa", "Hidratação", "Corte de unhas", "Táxi dog"];

function Item({ children }: { children: string }) {
  return (
    <span className="flex items-center">
      <span className="px-5 whitespace-nowrap">{children}</span>
      <span className="icon-paw shrink-0 opacity-60" aria-hidden="true" />
    </span>
  );
}

/** Duas faixas em sentidos opostos logo abaixo do hero: serviços e bairros atendidos. */
export function ServiceMarquee() {
  return (
    <section aria-labelledby="faixa-titulo" className="flex flex-col gap-0 overflow-hidden">
      <h2 id="faixa-titulo" className="sr-only">
        Serviços e bairros atendidos
      </h2>
      <div className="-mx-2 -rotate-1 bg-primary py-3 font-display text-xl font-bold sm:text-2xl">
        <Marquee label="Serviços" duration={32}>
          {SERVICES.map((service) => (
            <Item key={service}>{service}</Item>
          ))}
        </Marquee>
      </div>
      <div className="bg-secondary/25 py-3 text-base font-extrabold text-secondary-strong sm:text-lg">
        <Marquee label="Bairros atendidos pelo táxi dog" duration={45} reverse>
          {NEIGHBORHOODS.map((name) => (
            <Item key={name}>{name}</Item>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
