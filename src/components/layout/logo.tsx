import Link from "next/link";
import { PawPrint } from "lucide-react";

import { SITE } from "@/lib/site";

export function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
    >
      <span className="grid size-10 -rotate-6 place-items-center rounded-2xl bg-primary shadow-sm" aria-hidden="true">
        <PawPrint className="size-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-xl font-black tracking-tight">{SITE.name.split(" ")[0]}</span>
        <span className="text-[11px] font-extrabold tracking-[0.2em] text-primary-strong uppercase">
          {SITE.name.split(" ").slice(1).join(" ")}
        </span>
      </span>
    </Link>
  );
}
