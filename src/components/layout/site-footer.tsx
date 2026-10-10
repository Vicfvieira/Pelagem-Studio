import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { NAV_LINKS, SITE } from "@/lib/site";

export function SiteFooter() {
  const { address } = SITE;

  return (
    <footer className="mt-auto border-t bg-muted">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Banho e tosa com carinho, sem pressa e com hora marcada. {SITE.tagline}.
          </p>
        </div>

        <nav aria-label="Rodapé">
          <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide">Navegação</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {[...NAV_LINKS, { href: "/agendar", label: "Agendar" }, { href: "/minha-conta", label: "Minha conta" }].map(
              (link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:underline underline-offset-4">
                    {link.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <address className="flex flex-col gap-3 text-sm not-italic">
          <h2 className="text-sm font-extrabold uppercase tracking-wide">Contato</h2>
          <p className="flex gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {address.street} · {address.neighborhood}, {address.city} - {address.state}
          </p>
          <p className="flex gap-2">
            <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {SITE.hours}
          </p>
          <p className="flex gap-2">
            <Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {SITE.phoneDisplay}
          </p>
          <p className="flex gap-2">
            <Mail className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {SITE.email}
          </p>
        </address>
      </div>

      <div className="border-t">
        <p className="mx-auto max-w-6xl px-4 py-5 text-center text-sm text-muted-foreground">
          Projeto fictício desenvolvido para portfólio por {SITE.author}.
        </p>
      </div>
    </footer>
  );
}
