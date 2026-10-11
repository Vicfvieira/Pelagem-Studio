import { cn } from "@/lib/utils";

/**
 * Borda ondulada entre seções (decorativa). A cor vem de `className` (ex.: "text-muted"),
 * usando currentColor, para casar com o fundo da seção vizinha.
 */
export function OrganicDivider({ flip = false, className }: { flip?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 64"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={cn("block h-8 w-full sm:h-12", flip && "rotate-180", className)}
    >
      <path
        d="M0 40c120-22 240-34 380-20s250 40 400 34 260-44 400-46 200 18 260 26v30H0Z"
        fill="currentColor"
      />
    </svg>
  );
}
