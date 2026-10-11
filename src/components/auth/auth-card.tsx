import type { ReactNode } from "react";
import { PawPrint } from "lucide-react";

/** Moldura das páginas de entrar e cadastrar. */
export function AuthCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-12 md:py-16">
      <header className="flex flex-col items-center gap-3 text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-primary" aria-hidden="true">
          <PawPrint className="size-7" />
        </span>
        <h1 className="text-3xl font-black tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </header>
      <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">{children}</div>
    </div>
  );
}

/** Esqueleto exibido enquanto o formulário (que lê a URL) carrega. */
export function FormSkeleton({ fields }: { fields: number }) {
  return (
    <div className="flex animate-pulse flex-col gap-5 motion-reduce:animate-none" aria-hidden="true">
      {Array.from({ length: fields }, (_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-12 rounded-2xl bg-muted" />
        </div>
      ))}
      <div className="h-12 rounded-2xl bg-primary/40" />
    </div>
  );
}
