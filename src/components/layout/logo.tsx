import Link from "next/link";
import { PawPrint } from "lucide-react";

import { SITE } from "@/lib/site";

export function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-2xl text-lg font-black tracking-tight outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
    >
      <span className="grid size-9 place-items-center rounded-2xl bg-primary" aria-hidden="true">
        <PawPrint className="size-5" />
      </span>
      {SITE.name}
    </Link>
  );
}
