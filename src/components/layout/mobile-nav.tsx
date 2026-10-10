"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/site";

/** Menu mobile no padrão "disclosure": botão com aria-expanded controlando o painel. */
export function MobileNav({ account }: { account: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  // Fecha o menu ao trocar de página (inclusive pelos botões de conta, renderizados no servidor).
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <Button
        ref={toggleRef}
        variant="ghost"
        size="icon"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </Button>

      <nav
        id={panelId}
        aria-label="Menu principal"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b bg-background px-4 pb-6 pt-2 shadow-md"
      >
        <ul className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={close}
                className="block rounded-2xl px-4 py-3 text-base font-bold hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/60 outline-none"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-4">{account}</div>
      </nav>
    </div>
  );
}
