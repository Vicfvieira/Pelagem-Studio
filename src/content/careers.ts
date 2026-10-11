/** Vagas FICTÍCIAS do "Trabalhe conosco". Os ids batem com o enum JobRole do banco. */
export const JOB_ROLES = [
  {
    id: "BANHISTA",
    label: "Banhista",
    summary: "Banho, secagem e escovação, acompanhando um pet do início ao fim.",
    open: true,
  },
  {
    id: "TOSADOR",
    label: "Tosador(a)",
    summary: "Tosa na máquina e na tesoura, incluindo raças de pelagem longa.",
    open: true,
  },
  {
    id: "RECEPCAO",
    label: "Recepção",
    summary: "Agenda, avaliação de chegada junto com a equipe e contato com tutores.",
    open: false,
  },
  {
    id: "MOTORISTA",
    label: "Motorista do táxi dog",
    summary: "Busca e entrega de pets pela capital, com CNH B e experiência com animais.",
    open: false,
  },
] as const;

export const JOB_SHIFTS = [
  { id: "INTEGRAL", label: "Integral (terça a sábado, 9h às 18h)" },
  { id: "MANHA", label: "Meio período, manhã" },
  { id: "TARDE", label: "Meio período, tarde" },
] as const;

export const BENEFITS = [
  "Salário compatível com o mercado + comissão por tosa",
  "Vale-refeição e vale-transporte",
  "Domingo e segunda livres, sempre",
  "Curso anual de manejo e comportamento animal pago pelo estúdio",
  "Banho e tosa grátis para os seus pets",
] as const;
