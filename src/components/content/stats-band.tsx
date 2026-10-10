import { CountUp } from "@/components/motion";
import { STATS } from "@/content/company";
import { cn } from "@/lib/utils";

/** Números do estúdio contando ao aparecer na tela (valor final sempre disponível para leitores de tela). */
export function StatsBand({ className }: { className?: string }) {
  return (
    <section aria-labelledby="numeros-titulo" className={cn("bg-foreground text-background", className)}>
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h2 id="numeros-titulo" className="sr-only">
          Pelagem Studio em números
        </h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.id} className="flex flex-col gap-1">
              <dt className="order-2 text-sm font-semibold text-background/80">{stat.label}</dt>
              <dd className="order-1 font-[family-name:var(--font-fraunces)] text-5xl font-black text-primary sm:text-6xl">
                <CountUp value={stat.value} decimals={stat.decimals} prefix={stat.prefix} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
