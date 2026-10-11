/**
 * História, equipe e números FICTÍCIOS do Pelagem Studio. Fonte única: /sobre, home e rodapé leem daqui,
 * então nomes, datas e números são os mesmos em todas as páginas.
 */

export const MISSION =
  "Deixar o banho do seu pet tão tranquilo quanto uma tarde em casa: hora marcada, poucos pets por vez e uma equipe que entende de comportamento, não só de tesoura.";

export const VALUES = [
  {
    title: "Sem pressa",
    text: "No máximo 2 pets por horário. Ninguém espera em gaiola e cada atendimento tem o tempo que a pelagem pede.",
  },
  {
    title: "Transparência",
    text: "Preço por porte publicado no site, aviso antes de qualquer adicional e fotos do resultado no fim do banho.",
  },
  {
    title: "Bem-estar primeiro",
    text: "Se o pet mostra sinais de estresse, a gente pausa. Nunca usamos sedação nem contenção forçada.",
  },
] as const;

/** Números do estúdio. `years` é fixo para a página ser estática (fundado em março de 2019). */
export const STATS = [
  { id: "pets", value: 6800, prefix: "+", suffix: "", decimals: 0, label: "atendimentos desde 2019" },
  { id: "rating", value: 4.9, prefix: "", suffix: "", decimals: 1, label: "de avaliação média (1.240 avaliações)" },
  { id: "years", value: 7, prefix: "", suffix: " anos", decimals: 0, label: "cuidando de pets em São Paulo" },
  { id: "groomers", value: 2, prefix: "", suffix: "", decimals: 0, label: "banhistas certificados por horário" },
] as const;

export type TimelineEvent = {
  year: string;
  title: string;
  text: string;
  /** Bairro onde o estúdio estava naquele momento. */
  place: string;
};

export const TIMELINE: readonly TimelineEvent[] = [
  {
    year: "2019",
    title: "A primeira sala, na Vila Mariana",
    text: "Helena Duarte abre o estúdio numa sala de 40 m² na Vila Mariana, com uma banheira, um secador e a ideia de atender um pet por vez. Nos primeiros meses, só banho.",
    place: "Vila Mariana",
  },
  {
    year: "2020",
    title: "Hora marcada e protocolo de higiene",
    text: "Para não ter fila nem aglomeração, a agenda passa a ser só com hora marcada. Entra o protocolo de higienização do box entre um pet e outro, que seguimos até hoje.",
    place: "Vila Mariana",
  },
  {
    year: "2021",
    title: "Formação em comportamento",
    text: "A equipe faz formação em manejo de pets ansiosos e cuidados com braquicefálicos. A secagem passa a ser em temperatura baixa e os produtos, hipoalergênicos.",
    place: "Vila Mariana",
  },
  {
    year: "2022",
    title: "Mudança para a Vila Madalena",
    text: "O estúdio muda para a Rua dos Bigodes, 123, com dois boxes de banho, sala de secagem silenciosa e espaço de espera sem gaiolas. Caio e Beatriz chegam como banhistas.",
    place: "Vila Madalena",
  },
  {
    year: "2024",
    title: "Táxi dog em toda a capital",
    text: "O Marcos assume o táxi dog, que passa a atender toda a cidade de São Paulo, com taxa por zona e caixa de transporte presa ao banco.",
    place: "Vila Madalena",
  },
  {
    year: "2026",
    title: "Agendamento online",
    text: "Agenda em 5 passos pelo site, carteirinha de vacinas digital e sugestão do próximo banho na área do tutor.",
    place: "Vila Madalena",
  },
];

export type TeamMember = {
  name: string;
  role: string;
  specialty: string;
  quote: string;
  since: number;
  /** Cores do avatar ilustrado (até as fotos definitivas). */
  tone: "primary" | "secondary";
};

export const TEAM: readonly TeamMember[] = [
  {
    name: "Helena Duarte",
    role: "Fundadora e tosadora-chefe",
    specialty: "Tosa na tesoura e raças de pelagem longa",
    quote: "Tosa bonita é a que o pet aguenta com calma. O resto é técnica.",
    since: 2019,
    tone: "primary",
  },
  {
    name: "Caio Nogueira",
    role: "Banhista",
    specialty: "Pets ansiosos e adaptação ao secador",
    quote: "Primeiro eu deixo o cachorro me cheirar. O banho começa depois.",
    since: 2022,
    tone: "secondary",
  },
  {
    name: "Beatriz Okada",
    role: "Banhista e tosadora",
    specialty: "Braquicefálicos e secagem em baixa temperatura",
    quote: "Pug e bulldog respiram diferente. A gente trabalha no ritmo deles.",
    since: 2022,
    tone: "primary",
  },
  {
    name: "Marcos Ribeiro",
    role: "Motorista do táxi dog",
    specialty: "Transporte seguro e rotas pela capital",
    quote: "Caixa presa, ar ligado e música baixa. Ninguém chega estressado.",
    since: 2024,
    tone: "secondary",
  },
  {
    name: "Larissa Campos",
    role: "Recepção e atendimento",
    specialty: "Avaliação na chegada e carteirinha de vacinas",
    quote: "Eu sou a pessoa que manda a foto do seu pet pronto. É a melhor parte do dia.",
    since: 2023,
    tone: "primary",
  },
];
