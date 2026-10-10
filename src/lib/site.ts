/** Dados institucionais FICTÍCIOS do Pelagem Studio. */
export const SITE = {
  name: "Pelagem Studio",
  /** Razão social e CNPJ FICTÍCIOS (o CNPJ tem dígitos verificadores inválidos de propósito). */
  legalName: "Pelagem Studio Estética Animal Ltda. (fictícia)",
  cnpj: "34.912.507/0001-00",
  foundedYear: 2019,
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
  /** Perfis fictícios: exibidos como texto, sem link, para não apontar para contas reais. */
  social: [
    { network: "Instagram", handle: "@pelagem.studio" },
    { network: "TikTok", handle: "@pelagem.studio" },
    { network: "YouTube", handle: "Pelagem Studio" },
  ],
  author: "Victoria Fernandes Vieira",
} as const;

export const NAV_LINKS = [
  { href: "/servicos", label: "Serviços" },
  { href: "/precos", label: "Preços" },
  { href: "/sobre", label: "Sobre" },
  { href: "/seguranca", label: "Segurança" },
  { href: "/dicas", label: "Dicas" },
] as const;

/** Mapa do site (rodapé). */
export const SITEMAP_GROUPS = [
  {
    title: "Serviços",
    links: [
      { href: "/servicos", label: "Serviços" },
      { href: "/precos", label: "Preços e planos" },
      { href: "/agendar", label: "Agendar" },
      { href: "/minha-conta", label: "Minha conta" },
    ],
  },
  {
    title: "Pelagem Studio",
    links: [
      { href: "/sobre", label: "Sobre nós" },
      { href: "/seguranca", label: "Segurança e bem-estar" },
      { href: "/dicas", label: "Dicas" },
      { href: "/trabalhe-conosco", label: "Trabalhe conosco" },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { href: "/perguntas-frequentes", label: "Perguntas frequentes" },
      { href: "/politicas", label: "Políticas de atendimento" },
      { href: "/#localizacao", label: "Como chegar" },
    ],
  },
] as const;

export function whatsappUrl(): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(SITE.whatsappMessage)}`;
}
