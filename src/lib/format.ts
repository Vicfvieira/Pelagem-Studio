const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** 6000 → "R$ 60,00" */
export function formatCents(cents: number): string {
  return brl.format(cents / 100);
}

/** 90 → "1h30", 60 → "1h", 30 → "30 min" */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  return rest === 0 ? `${hours}h` : `${hours}h${String(rest).padStart(2, "0")}`;
}

const longDate = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const shortDate = new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit", timeZone: "UTC" });

/** "2026-10-14" → "quarta-feira, 14 de outubro" (a data local é tratada como UTC para não deslocar o dia). */
export function formatLocalDate(localDate: string): string {
  return longDate.format(new Date(`${localDate}T00:00:00Z`));
}

/** "2026-10-14" → "qua., 14/10" */
export function formatShortDate(localDate: string): string {
  return shortDate.format(new Date(`${localDate}T00:00:00Z`));
}

/** "01310100" → "01310-100" */
export function formatCep(digits: string): string {
  return digits.length === 8 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

const numericDate = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });

/** "2025-10-14" → "14/10/2025" */
export function formatNumericDate(localDate: string): string {
  return numericDate.format(new Date(`${localDate}T00:00:00Z`));
}
