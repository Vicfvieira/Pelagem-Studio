import { cn } from "@/lib/utils";

const TONES = {
  danger: "bg-destructive/10 text-destructive",
  warning: "bg-primary/15 text-primary-strong",
  success: "bg-secondary/20 text-secondary-strong",
  neutral: "bg-muted text-muted-foreground",
} as const;

export function StatusBadge({ tone, children }: { tone: keyof typeof TONES; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold", TONES[tone])}>
      {children}
    </span>
  );
}
