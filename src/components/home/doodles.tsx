import { cn } from "@/lib/utils";

/** Rabiscos decorativos (coração, patinha, traços, estrela) desenhados à mão em SVG. Puramente visuais. */
export function Doodle({
  kind,
  className,
}: {
  kind: "heart" | "paw" | "squiggle" | "spark" | "dots";
  className?: string;
}) {
  const common = {
    className: cn("pointer-events-none", className),
    "aria-hidden": true,
    focusable: false,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (kind) {
    case "heart":
      return (
        <svg viewBox="0 0 48 44" {...common}>
          <path d="M24 40C10 30 4 22 4 14a10 10 0 0 1 20-3 10 10 0 0 1 20 3c0 8-6 16-20 26Z" />
        </svg>
      );
    case "paw":
      return (
        <svg viewBox="0 0 48 48" {...common} fill="currentColor" stroke="none">
          <ellipse cx="12" cy="20" rx="5" ry="6.5" />
          <ellipse cx="20" cy="10" rx="5" ry="6.5" />
          <ellipse cx="30" cy="10" rx="5" ry="6.5" />
          <ellipse cx="38" cy="20" rx="5" ry="6.5" />
          <path d="M25 22c7 0 13 8 13 14 0 5-4 7-8 6-2-.5-3.5-1.5-5-1.5s-3 1-5 1.5c-4 1-8-1-8-6 0-6 6-14 13-14Z" />
        </svg>
      );
    case "squiggle":
      return (
        <svg viewBox="0 0 60 40" {...common}>
          <path d="M6 30c6-14 12-14 14-4s8 10 12-2 10-14 22-10" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 40 40" {...common}>
          <path d="M20 4v10M20 26v10M4 20h10M26 20h10" />
        </svg>
      );
    case "dots":
      return (
        <svg viewBox="0 0 40 16" {...common} fill="currentColor" stroke="none">
          <circle cx="6" cy="8" r="4" />
          <circle cx="20" cy="8" r="4" />
          <circle cx="34" cy="8" r="4" />
        </svg>
      );
  }
}
