import Link from "next/link";
import { Check } from "lucide-react";

import { BeforeAfter } from "@/components/home/before-after";
import { Button } from "@/components/ui/button";
import { formatCents } from "@/lib/format";
import { ADDONS } from "@/lib/pricing-extras";

const detangle = ADDONS.find((addon) => addon.id === "desembolo");

/** Caso de antes e depois, com o que foi feito (serviços e valores do catálogo). */
export function Transformations() {
  return (
    <section aria-labelledby="antes-depois-titulo" className="overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1.2fr_1fr]">
        <BeforeAfter caption="Ilustração do caso da Mel. Arraste a divisória ou use as setas do teclado." />
        <div className="flex flex-col gap-5">
          <p className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-primary-strong">Antes e depois</p>
          <h2 id="antes-depois-titulo" className="text-3xl font-black tracking-tight sm:text-4xl">
            Mel chegou embolada. Saiu leve.
          </h2>
          <p className="text-muted-foreground">
            Lhasa Apso de 6 kg, três meses sem tosa e nós atrás das orelhas. A Helena começou pelo desembolo com pente e
            condicionador, sem raspar, e terminou com a tosa na tesoura.
          </p>
          <ul className="flex flex-col gap-2 text-sm font-semibold">
            <li className="flex gap-2">
              <Check className="size-4 shrink-0 text-secondary-strong" aria-hidden="true" /> Tosa completa (porte P)
            </li>
            {detangle && (
              <li className="flex gap-2">
                <Check className="size-4 shrink-0 text-secondary-strong" aria-hidden="true" /> {detangle.name}:{" "}
                {formatCents(detangle.priceCents)} {detangle.unit}, 30 min neste caso
              </li>
            )}
            <li className="flex gap-2">
              <Check className="size-4 shrink-0 text-secondary-strong" aria-hidden="true" /> Bandana de presente da casa
            </li>
          </ul>
          <Button asChild variant="outline" className="w-fit">
            <Link href="/precos#simulador">Simular para o meu pet</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
