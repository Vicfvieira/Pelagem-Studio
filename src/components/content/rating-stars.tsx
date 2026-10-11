import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

/** Nota em estrelas (0 a 5) num único elemento com máscara CSS; o valor vai no rótulo acessível. */
export function RatingStars({
  rating,
  size = "1.25rem",
  className,
}: {
  rating: number;
  size?: string;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={`Avaliação: ${rating} de 5 estrelas`}
      className={cn("rating-stars", className)}
      style={{ "--rating": rating, "--star-size": size } as CSSProperties}
    />
  );
}
