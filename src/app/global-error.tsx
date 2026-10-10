"use client";

/**
 * Último recurso: erro no próprio layout raiz. Substitui o layout inteiro, então traz o próprio
 * <html>/<body> e estilos inline (o CSS global pode não ter carregado).
 */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#FFF8F0",
          color: "#2B2B2B",
          fontFamily: "system-ui, sans-serif",
          padding: 16,
          textAlign: "center",
        }}
      >
        <main>
          <h1 style={{ fontSize: 32, marginBottom: 12 }}>Ops, algo deu errado</h1>
          <p style={{ marginBottom: 24 }}>O Pelagem Studio teve um problema inesperado. Tente de novo em instantes.</p>
          {error.digest && <p style={{ fontSize: 14, marginBottom: 24 }}>Código do erro: {error.digest}</p>}
          <button
            type="button"
            onClick={() => retry()}
            style={{
              background: "#E8833A",
              color: "#2B2B2B",
              border: 0,
              borderRadius: 16,
              padding: "12px 24px",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Tentar de novo
          </button>
          <p style={{ marginTop: 32, fontSize: 14 }}>
            Projeto fictício desenvolvido para portfólio por Victoria Fernandes Vieira.
          </p>
        </main>
      </body>
    </html>
  );
}
