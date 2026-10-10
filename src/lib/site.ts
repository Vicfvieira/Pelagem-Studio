/** Dados institucionais FICTÍCIOS do Pelagem Studio. */
export const SITE = {
  name: "Pelagem Studio",
  tagline: "Pet spa de banho e tosa em São Paulo",
  address: {
    street: "Rua dos Bigodes, 123",
    neighborhood: "Vila Madalena",
    city: "São Paulo",
    state: "SP",
    cep: "05433-000",
  },
  phoneDisplay: "(11) 90000-0000",
  /** Número fictício, apenas para demonstrar o botão de WhatsApp. */
  whatsappNumber: "5511900000000",
  whatsappMessage: "Olá! Gostaria de saber mais sobre os serviços do Pelagem Studio.",
  email: "contato@example.com",
  hours: "Terça a sábado, das 9h às 18h",
  author: "Victoria Fernandes Vieira",
} as const;

export const NAV_LINKS = [
  { href: "/servicos", label: "Serviços" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#depoimentos", label: "Depoimentos" },
  { href: "/#localizacao", label: "Localização" },
] as const;

export function whatsappUrl(): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(SITE.whatsappMessage)}`;
}
