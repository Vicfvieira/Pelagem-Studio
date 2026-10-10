import Link from "next/link";
import { AtSign, Clock, Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { SITE, SITEMAP_GROUPS } from "@/lib/site";

const linkClass = "rounded outline-none hover:underline underline-offset-4 focus-visible:ring-[3px] focus-visible:ring-ring/60";

export function SiteFooter() {
  const { address } = SITE;

  return (
    <footer className="mt-auto border-t bg-muted">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(3,1fr)]">
        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Banho e tosa com hora marcada, no máximo dois pets por horário. Desde {SITE.foundedYear} em São Paulo.
          </p>
          <address className="flex flex-col gap-2 text-sm not-italic">
            <p className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                {address.street} · {address.neighborhood}
                <br />
                {address.city} - {address.state} · CEP {address.cep}
              </span>
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

        {SITEMAP_GROUPS.map((group) => (
          <nav key={group.title} aria-label={`Mapa do site: ${group.title}`}>
            <h2 className="mb-3 font-sans text-sm font-extrabold tracking-wide uppercase">{group.title}</h2>
            <ul className="flex flex-col gap-2 text-sm">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-3 border-t px-4 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <ul className="flex flex-wrap gap-x-5 gap-y-1" aria-label="Redes sociais (perfis fictícios)">
          {SITE.social.map((profile) => (
            <li key={profile.network} className="flex items-center gap-1.5">
              <AtSign className="size-3.5" aria-hidden="true" />
              <span className="font-bold text-foreground">{profile.network}</span> {profile.handle}
            </li>
          ))}
        </ul>
        <p>
          {SITE.legalName} · CNPJ {SITE.cnpj}
        </p>
      </div>

      <div className="border-t">
        <p className="mx-auto max-w-6xl px-4 py-5 text-center text-sm text-muted-foreground">
          Projeto fictício desenvolvido para portfólio por {SITE.author}.
        </p>
      </div>
    </footer>
  );
}
