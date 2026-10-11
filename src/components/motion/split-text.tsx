import type { ElementType } from "react";

import { InViewTrigger } from "@/components/motion/in-view-trigger";
import { splitText } from "@/lib/motion/text";
import { cn } from "@/lib/utils";

type SplitTextProps = {
  text: string;
  as?: ElementType;
  /** "letter": letra por letra; "word": palavra por palavra. */
  by?: "letter" | "word";
  /** Atraso inicial (ms). */
  delay?: number;
  /** Intervalo entre cada pedaço (ms). */
  stagger?: number;
  /** "mount": ao carregar; "inView": quando entra na tela. */
  trigger?: "mount" | "inView";
  className?: string;
  id?: string;
};

/**
 * Texto que surge em sequência. Componente de SERVIDOR: a animação é CSS (@keyframes split-in),
 * então começa no primeiro paint, sem esperar o JavaScript, o que é melhor para o LCP.
 *
 * Acessibilidade: o texto completo fica num span sr-only; os pedaços animados são aria-hidden,
 * assim o leitor de tela lê "Banho e tosa", e não "B, a, n, h, o".
 * Palavras ficam em `whitespace-nowrap` para a quebra de linha nunca cortar uma palavra ao meio.
 */
export function SplitText({
  text,
  as: Tag = "span",
  by = "letter",
  delay = 0,
  stagger,
  trigger = "mount",
  className,
  id,
}: SplitTextProps) {
  const step = stagger ?? (by === "letter" ? 28 : 90);
  let index = 0;

  const pieces = (
    <span aria-hidden="true">
      {splitText(text).map(({ word, chars }, wordIndex) => (
        <span key={`${word}-${wordIndex}`}>
          <span className="inline-block whitespace-nowrap">
            {(by === "letter" ? chars : [word]).map((piece, pieceIndex) => (
              <span
                key={pieceIndex}
                className="split-piece"
                style={{ "--split-delay": `${delay + step * index++}ms` } as React.CSSProperties}
              >
                {piece}
              </span>
            ))}
          </span>{" "}
        </span>
      ))}
    </span>
  );

  return (
    <Tag id={id} className={cn(className)}>
      <span className="sr-only">{text}</span>
      {trigger === "inView" ? <InViewTrigger>{pieces}</InViewTrigger> : pieces}
    </Tag>
  );
}
