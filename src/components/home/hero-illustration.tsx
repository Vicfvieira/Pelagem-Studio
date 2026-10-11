/** Ilustração original (SVG próprio): cachorro feliz na banheira de espuma. Decorativa. */
export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 420" className={className} aria-hidden="true" focusable="false">
      <circle cx="250" cy="215" r="180" fill="#5BBFA0" opacity="0.22" />
      <circle cx="400" cy="320" r="46" fill="#E8833A" opacity="0.18" />

      {/* bolhas soltas */}
      <g fill="#fff" stroke="#5BBFA0" strokeWidth="3" opacity="0.9">
        <circle cx="92" cy="118" r="14" />
        <circle cx="398" cy="88" r="20" />
        <circle cx="428" cy="168" r="10" />
        <circle cx="62" cy="212" r="9" />
        <circle cx="362" cy="38" r="8" />
      </g>

      {/* orelhas */}
      <ellipse cx="172" cy="182" rx="26" ry="52" fill="#C9773A" transform="rotate(18 172 182)" />
      <ellipse cx="308" cy="182" rx="26" ry="52" fill="#C9773A" transform="rotate(-18 308 182)" />

      {/* cabeça */}
      <ellipse cx="240" cy="190" rx="80" ry="74" fill="#F3C89B" />
      <ellipse cx="240" cy="218" rx="40" ry="29" fill="#FFF1E0" />
      <circle cx="198" cy="210" r="10" fill="#F2A08A" opacity="0.6" />
      <circle cx="282" cy="210" r="10" fill="#F2A08A" opacity="0.6" />
      <circle cx="212" cy="178" r="8" fill="#2B2B2B" />
      <circle cx="268" cy="178" r="8" fill="#2B2B2B" />
      <circle cx="214.5" cy="175.5" r="2.5" fill="#fff" />
      <circle cx="270.5" cy="175.5" r="2.5" fill="#fff" />
      <ellipse cx="240" cy="204" rx="12" ry="9" fill="#2B2B2B" />
      <path d="M226 222 Q240 236 254 222" fill="none" stroke="#2B2B2B" strokeWidth="4" strokeLinecap="round" />

      {/* espuma na cabeça */}
      <g fill="#fff" stroke="#EAD9C6" strokeWidth="2">
        <circle cx="218" cy="122" r="22" />
        <circle cx="272" cy="124" r="20" />
        <circle cx="244" cy="110" r="27" />
      </g>

      {/* banheira */}
      <rect x="92" y="250" width="296" height="112" rx="44" fill="#E8833A" />
      <rect x="72" y="236" width="336" height="30" rx="15" fill="#D9722A" />
      <circle cx="132" cy="372" r="14" fill="#A3501A" />
      <circle cx="348" cy="372" r="14" fill="#A3501A" />
      <path d="M140 300 h200" stroke="#F09A5A" strokeWidth="6" strokeLinecap="round" opacity="0.7" />

      {/* espuma da banheira */}
      <g fill="#fff" stroke="#EAD9C6" strokeWidth="2">
        <circle cx="104" cy="232" r="22" />
        <circle cx="138" cy="226" r="26" />
        <circle cx="342" cy="226" r="26" />
        <circle cx="376" cy="232" r="22" />
        <circle cx="168" cy="236" r="18" />
        <circle cx="312" cy="236" r="18" />
      </g>

      {/* patinhas na borda */}
      <ellipse cx="200" cy="240" rx="20" ry="13" fill="#F3C89B" />
      <ellipse cx="280" cy="240" rx="20" ry="13" fill="#F3C89B" />
      <path d="M194 236 v8 M206 236 v8 M274 236 v8 M286 236 v8" stroke="#C9773A" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
