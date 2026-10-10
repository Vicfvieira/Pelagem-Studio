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
