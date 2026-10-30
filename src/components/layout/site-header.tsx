import { AccountActions } from "@/components/layout/account-actions";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLinks } from "@/components/layout/nav-links";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 shadow-[0_1px_0_rgba(0,0,0,0.02)] backdrop-blur supports-[backdrop-filter]:bg-card/85">
      <div className="relative mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />

        <nav aria-label="Menu principal" className="hidden lg:block">
          <NavLinks />
        </nav>

        <div className="hidden lg:block">
          <AccountActions variant="desktop" />
        </div>

        <MobileNav account={<AccountActions variant="mobile" />} />
      </div>
    </header>
  );
}
