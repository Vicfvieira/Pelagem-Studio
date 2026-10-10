import Image from "next/image";
import type { ReactNode } from "react";

import { PHOTOS, type PhotoSlot } from "@/content/photos";
import { cn } from "@/lib/utils";

type PhotoProps = {
  slot: PhotoSlot;
  /** Ilustração exibida enquanto a foto do slot não foi publicada. */
  fallback: ReactNode;
  /** `sizes` do next/image (largura ocupada em cada breakpoint). */
  sizes: string;
  priority?: boolean;
  className?: string;
};

/**
 * Foto do slot com next/image (formatos modernos, tamanhos responsivos, lazy por padrão) preenchendo o
 * contêiner. Só publica foto que tenha crédito cadastrado; sem ela, mostra a ilustração própria.
 */
export function Photo({ slot, fallback, sizes, priority = false, className }: PhotoProps) {
  const photo = PHOTOS[slot];
  if (!photo.src || !photo.credit) return <>{fallback}</>;
  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
