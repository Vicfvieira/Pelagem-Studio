import type { ReactNode } from "react";

import { SplitText } from "@/components/motion";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  id: string;
  eyebrow: string;
  title: string;
  children?: ReactNode;
  align?: "center" | "left";
  className?: string;
};

/** Topo padrão das páginas institucionais: etiqueta, título animado por palavra e texto de apoio. */
export function PageHeader({ id, eyebrow, title, children, align = "center", className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex max-w-3xl flex-col gap-4",
        align === "center" ? "mx-auto items-center text-center" : "items-start",
        className,
      )}
    >
      <p className="rise-in w-fit rounded-full border bg-card px-4 py-1.5 text-sm font-bold text-primary-strong shadow-sm">
        {eyebrow}
      </p>
      <SplitText
        as="h1"
        id={id}
        text={title}
        by="word"
        delay={80}
        className="text-4xl leading-[1.05] font-black tracking-tight text-balance sm:text-5xl"
      />
      {children && <div className="text-lg text-muted-foreground">{children}</div>}
    </header>
  );
}
