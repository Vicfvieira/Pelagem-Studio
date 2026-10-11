"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Marca `data-inview="true"` no wrapper quando ele entra na tela (uma vez).
 * As animações CSS que dependem disso ficam pausadas até lá.
 */
export function InViewTrigger({
  children,
  className,
  amount = 0.3,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          element.dataset.inview = "true";
          observer.disconnect();
        }
      },
      { threshold: amount },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [amount]);

  return (
    <span ref={ref} data-split-trigger="inview" className={className}>
      {children}
    </span>
  );
}
