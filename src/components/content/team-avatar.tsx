import { cn } from "@/lib/utils";

/**
 * Avatar ilustrado com as iniciais numa forma orgânica (decorativo). Fica no lugar das fotos da equipe
 * até a etapa A5, quando entram fotos livres de direitos com crédito.
 */
export function TeamAvatar({ name, tone, className }: { name: string; tone: "primary" | "secondary"; className?: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
  const fill = tone === "primary" ? "#E8833A" : "#5BBFA0";

  return (
    <svg viewBox="0 0 120 120" className={cn("size-full", className)} aria-hidden="true" focusable="false">
      <path
        d="M60 6c20 0 40 8 48 26s6 40-6 56-32 26-52 24S12 98 8 78 6 34 20 20 40 6 60 6Z"
        fill={fill}
        opacity="0.22"
      />
      <path d="M60 18c16 0 32 7 38 21s4 32-5 44-26 20-42 19-28-11-32-26-3-33 8-44 17-14 33-14Z" fill={fill} />
      <text
        x="60"
        y="72"
        textAnchor="middle"
        fontSize="34"
        fontWeight="800"
        fill="#2B2B2B"
        fontFamily="var(--font-nunito), sans-serif"
      >
        {initials}
      </text>
    </svg>
  );
}
