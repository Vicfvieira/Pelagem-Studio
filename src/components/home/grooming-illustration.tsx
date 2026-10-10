/**
 * Ilustração própria (SVG) do mesmo pet antes e depois da tosa, no mesmo enquadramento para o slider.
 * Decorativa: o texto ao redor descreve a comparação. Fica até as fotos livres de direitos (etapa A5).
 */
export function GroomingIllustration({ variant }: { variant: "antes" | "depois" }) {
  const after = variant === "depois";
  const fur = after ? "#F3C89B" : "#D9B48C";
  const ear = after ? "#C9773A" : "#A9764A";

  return (
    <svg viewBox="0 0 400 300" className="size-full" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill={after ? "#E7F6F0" : "#F3E7DA"} />
      {after ? (
        <g fill="#5BBFA0" opacity="0.35">
          <circle cx="70" cy="60" r="34" />
          <circle cx="340" cy="230" r="46" />
        </g>
      ) : (
        <g fill="#B08968" opacity="0.25">
          <ellipse cx="80" cy="250" rx="60" ry="14" />
          <ellipse cx="320" cy="262" rx="70" ry="12" />
        </g>
      )}

      {/* corpo */}
      <ellipse cx="200" cy="232" rx="92" ry="58" fill={fur} />
      {/* orelhas */}
      <ellipse cx="146" cy="128" rx="24" ry="50" fill={ear} transform="rotate(16 146 128)" />
      <ellipse cx="254" cy="128" rx="24" ry="50" fill={ear} transform="rotate(-16 254 128)" />
      {/* cabeça */}
      <ellipse cx="200" cy="134" rx="70" ry="64" fill={fur} />
      <ellipse cx="200" cy="160" rx="34" ry="25" fill="#FFF1E0" opacity={after ? 1 : 0.75} />

      {after ? (
        <>
          {/* pelo alinhado e brilho */}
          <path d="M160 92 q40 -22 80 0" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.7" />
          {/* bandana */}
          <path d="M136 186 q64 34 128 0 l-16 30 q-48 18 -96 0Z" fill="#E8833A" />
          <circle cx="178" cy="204" r="3" fill="#fff" />
          <circle cx="206" cy="210" r="3" fill="#fff" />
          <circle cx="232" cy="202" r="3" fill="#fff" />
          {/* brilhos */}
          <g fill="#E8833A">
            <path d="M318 70 l5 12 12 5 -12 5 -5 12 -5 -12 -12 -5 12 -5Z" />
            <path d="M92 150 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3Z" />
          </g>
        </>
      ) : (
        <>
          {/* tufos embaraçados */}
          <g stroke="#9C7A55" strokeWidth="5" strokeLinecap="round" fill="none">
            <path d="M150 84 l-10 -16 m22 8 l-4 -20 m24 12 l4 -20 m20 18 l12 -14 m6 24 l16 -8" />
            <path d="M118 196 l-14 8 m10 14 l-16 4 m186 -26 l14 8 m-8 16 l16 4" />
            <path d="M160 270 l-6 14 m30 -10 l0 16 m30 -16 l6 14" />
          </g>
          {/* nós e sujeira */}
          <g fill="#8A6A4A" opacity="0.55">
            <circle cx="232" cy="226" r="9" />
            <circle cx="170" cy="240" r="7" />
            <circle cx="250" cy="100" r="6" />
          </g>
        </>
      )}

      {/* olhos e focinho */}
      <circle cx="176" cy="126" r="7" fill="#2B2B2B" />
      <circle cx="224" cy="126" r="7" fill="#2B2B2B" />
      {after && (
        <>
          <circle cx="178" cy="124" r="2.2" fill="#fff" />
          <circle cx="226" cy="124" r="2.2" fill="#fff" />
        </>
      )}
      <ellipse cx="200" cy="150" rx="11" ry="8" fill="#2B2B2B" />
      <path
        d={after ? "M188 166 q12 12 24 0" : "M190 170 q10 -4 20 0"}
        stroke="#2B2B2B"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
