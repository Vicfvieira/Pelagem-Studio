import { ImageResponse } from "next/og";

import { SITE } from "@/lib/site";

export const alt = `${SITE.name}: ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem de compartilhamento gerada no build, nas cores da marca (sem foto de terceiros). */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#FFF8F0",
          color: "#2B2B2B",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "#E8833A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Pata desenhada em SVG: sem depender de emoji baixado de CDN no build. */}
            <svg width="44" height="44" viewBox="0 0 24 24" fill="#2B2B2B">
              <circle cx="5" cy="10" r="2.3" />
              <circle cx="9" cy="5.5" r="2.3" />
              <circle cx="15" cy="5.5" r="2.3" />
              <circle cx="19" cy="10" r="2.3" />
              <ellipse cx="12" cy="16" rx="5" ry="4.2" />
            </svg>
          </div>
          <div style={{ fontSize: 40, fontWeight: 800 }}>{SITE.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, maxWidth: 900 }}>
            Banho e tosa com carinho, com hora marcada.
          </div>
          <div style={{ fontSize: 30, color: "#5C5249" }}>
            Agendamento online · Táxi dog na capital · São Paulo
          </div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {["Banho", "Tosa", "Hidratação", "Táxi dog"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "10px 24px",
                borderRadius: 999,
                background: "#5BBFA0",
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
