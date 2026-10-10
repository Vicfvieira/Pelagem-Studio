import { Clock, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${SITE.address.neighborhood}, ${SITE.address.city} - ${SITE.address.state}`,
)}`;

/** Mapa ilustrado (sem iframe de terceiros: melhor para privacidade e para o Lighthouse). */
function MapIllustration() {
  return (
    <svg viewBox="0 0 400 280" className="h-full w-full" aria-hidden="true" focusable="false">
      <rect width="400" height="280" fill="#F6EBDF" />
      <path d="M0 190 C120 170 160 230 400 200 V280 H0Z" fill="#5BBFA0" opacity="0.35" />
      <g stroke="#fff" strokeWidth="14" strokeLinecap="round" fill="none">
        <path d="M-10 90 H410" />
        <path d="M120 -10 V290" />
        <path d="M270 -10 L330 290" />
        <path d="M-10 230 L410 150" />
      </g>
      <g stroke="#EAD9C6" strokeWidth="5" fill="none">
        <path d="M-10 40 H410" />
        <path d="M200 -10 V290" />
        <path d="M40 -10 V290" />
      </g>
      <circle cx="200" cy="110" r="38" fill="#E8833A" opacity="0.2" />
      <path d="M200 132 C186 112 176 101 176 88 a24 24 0 0 1 48 0 c0 13 -10 24 -24 44Z" fill="#E8833A" />
      <circle cx="200" cy="88" r="9" fill="#fff" />
    </svg>
  );
}

export function Location() {
  const { address } = SITE;

  return (
    <section id="localizacao" aria-labelledby="localizacao-titulo" className="scroll-mt-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2">
        <div className="flex flex-col gap-5">
          <h2 id="localizacao-titulo" className="text-3xl font-black tracking-tight">
            Venha nos visitar
          </h2>
          <ul className="flex flex-col gap-4">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary-strong" aria-hidden="true" />
              <span>
                {address.street} · {address.neighborhood}
                <br />
                {address.city} - {address.state}, CEP {address.cep}
              </span>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-5 shrink-0 text-primary-strong" aria-hidden="true" />
              <span>
                {SITE.hours}
                <br />
                <span className="text-muted-foreground">Domingo e segunda: fechado</span>
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-5 shrink-0 text-primary-strong" aria-hidden="true" />
              <span>{SITE.phoneDisplay}</span>
            </li>
          </ul>
          <Button asChild variant="secondary" className="w-fit">
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
              Ver bairro no mapa
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </Button>
          <p className="text-sm text-muted-foreground">Endereço fictício, criado para este projeto de portfólio.</p>
        </div>

        <div className="aspect-[10/7] overflow-hidden rounded-2xl border shadow-sm">
          <MapIllustration />
        </div>
      </div>
    </section>
  );
}
