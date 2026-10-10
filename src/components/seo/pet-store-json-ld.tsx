import { CLOSE_MINUTE, OPEN_MINUTE } from "@/lib/business-rules";
import { getServicesCatalog } from "@/lib/data/services";
import { SITE } from "@/lib/site";
import { siteUrl } from "@/lib/site-url";

const toTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

/**
 * Dados estruturados schema.org/PetStore para buscadores. Serviços e faixa de preço vêm do banco.
 * O JSON é escapado para nunca fechar a tag <script> (proteção contra injeção de HTML).
 */
export async function PetStoreJsonLd() {
  const services = await getServicesCatalog();
  const prices = services.flatMap((s) => Object.values(s.prices).map((p) => p.priceCents / 100));
  const url = siteUrl();

  const data = {
    "@context": "https://schema.org",
    "@type": "PetStore",
    name: SITE.name,
    description: `${SITE.tagline}. Banho, tosa, hidratação e táxi dog com agendamento online.`,
    url,
    image: `${url}/opengraph-image`,
    telephone: SITE.phoneDisplay,
    email: SITE.email,
    priceRange: prices.length ? `R$ ${Math.min(...prices)} – R$ ${Math.max(...prices)}` : undefined,
    currenciesAccepted: "BRL",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.cep,
      addressCountry: "BR",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: toTime(OPEN_MINUTE),
      closes: toTime(CLOSE_MINUTE),
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Serviços",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: service.name, description: service.description },
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "BRL",
          minPrice: Math.min(...Object.values(service.prices).map((p) => p.priceCents)) / 100,
          maxPrice: Math.max(...Object.values(service.prices).map((p) => p.priceCents)) / 100,
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
