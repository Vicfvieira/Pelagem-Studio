"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Links do header com a página atual marcada (aria-current + traço caramelo). */
export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-1">
      {NAV_LINKS.map((link) => {
        const current = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={current ? "page" : undefined}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-bold outline-none hover:text-primary-strong focus-visible:ring-[3px] focus-visible:ring-ring/60",
                current && "text-primary-strong",
              )}
            >
              {link.label}
              {current && (
                <span
                  className="absolute inset-x-4 -bottom-0.5 h-1 rounded-full bg-primary"
                  aria-hidden="true"
                />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
