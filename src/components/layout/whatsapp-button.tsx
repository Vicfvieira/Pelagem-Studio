import { MessageCircle } from "lucide-react";

import { whatsappUrl } from "@/lib/site";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar no WhatsApp (número fictício, abre em nova aba)"
      className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-secondary text-secondary-foreground shadow-lg ring-4 ring-background transition-transform hover:scale-105 outline-none focus-visible:ring-ring motion-reduce:transition-none motion-reduce:hover:scale-100"
    >
      <MessageCircle className="size-7" aria-hidden="true" />
    </a>
  );
}
