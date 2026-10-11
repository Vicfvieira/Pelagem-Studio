"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

/**
 * O formulário (react-hook-form + Zod) só é baixado quando está a ~600 px de aparecer na tela.
 * No celular ele fica abaixo da dobra, então não pesa no carregamento inicial. O espaço reservado tem
 * a altura aproximada do formulário para nada "pular".
 */
const ApplicationForm = dynamic(
  () => import("@/components/careers/application-form").then((mod) => mod.ApplicationForm),
  { ssr: false, loading: () => <FormPlaceholder /> },
);

function FormPlaceholder() {
  return (
    <div
      className="min-h-[80rem] animate-pulse rounded-2xl bg-muted/60 motion-reduce:animate-none sm:min-h-[54rem]"
      aria-hidden="true"
    />
  );
}

export function DeferredApplicationForm() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{visible ? <ApplicationForm /> : <FormPlaceholder />}</div>;
}
