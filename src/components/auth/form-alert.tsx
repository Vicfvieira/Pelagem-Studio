import { AlertCircle } from "lucide-react";

/** Erro vindo do servidor; role="alert" faz o leitor de tela anunciar na hora. */
export function FormAlert({ message }: { message: string | null }) {
  return (
    <div role="alert" aria-live="assertive">
      {message && (
        <p className="flex items-start gap-2 rounded-2xl border-2 border-destructive/30 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {message}
        </p>
      )}
    </div>
  );
}
