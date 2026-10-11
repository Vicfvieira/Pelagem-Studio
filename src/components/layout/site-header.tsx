import Link from "next/link";

import { AccountActions } from "@/components/layout/account-actions";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NAV_LINKS } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />

        <nav aria-label="Menu principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-2xl px-3 py-2 text-sm font-bold hover:bg-accent outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <AccountActions variant="desktop" />
        </div>

        <MobileNav
          account={
            <AccountActions variant="mobile" />
          }
        />
      </div>
    </header>
  );
}
