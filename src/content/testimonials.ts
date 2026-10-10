/** Depoimentos FICTÍCIOS, escritos para o portfólio. Serviços e equipe batem com o resto do site. */
export type Testimonial = {
  tutor: string;
  neighborhood: string;
  pet: string;
  breed: string;
  service: string;
  rating: 4 | 5;
  quote: string;
};

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    tutor: "Marina S.",
    neighborhood: "Pinheiros",
    pet: "Paçoca",
    breed: "Shih-tzu",
    service: "Banho + Tosa higiênica",
    rating: 5,
    quote:
      "A Paçoca tremia só de ouvir secador. O Caio foi deixando ela se acostumar com o barulho aos poucos e, no terceiro banho, ela já entrou abanando o rabo. Hoje vamos a cada 15 dias, sem drama.",
  },
  {
    tutor: "Rafael M.",
    neighborhood: "Perdizes",
    pet: "Thor",
    breed: "Golden Retriever",
    service: "Banho com táxi dog",
    rating: 5,
    quote:
      "Trabalho o dia todo e o táxi dog resolveu minha vida. O Marcos manda mensagem quando sai e quando chega, e o Thor volta seco até na barriga, coisa rara para um golden.",
  },
  {
    tutor: "Juliana P.",
    neighborhood: "Vila Madalena",
    pet: "Luna",
    breed: "Vira-lata caramelo",
    service: "Banho",
    rating: 5,
    quote:
      "Gosto de ver o preço antes de agendar e de receber o lembrete do próximo banho. Cheguei às 10h, saí às 11h com a Luna cheirosa. Sem fila e sem surpresa no valor.",
  },
  {
    tutor: "André K.",
    neighborhood: "Butantã",
    pet: "Bento",
    breed: "Pug",
    service: "Hidratação",
    rating: 5,
    quote:
      "Pug tem que ter cuidado com calor e eu sempre ficava tenso. A Beatriz secou o Bento com ar morno, fez pausas e me explicou cada passo. Primeira vez que ele voltou sem estar ofegante.",
  },
  {
    tutor: "Fernanda L.",
    neighborhood: "Moema",
    pet: "Mel",
    breed: "Lhasa Apso",
    service: "Tosa completa",
    rating: 5,
    quote:
      "A Helena tosou a Mel na tesoura, do jeito que eu mostrei na foto. Ficou igualzinho e ela avisou antes que ia cobrar o desembolo, porque tinha uns nós atrás da orelha.",
  },
  {
    tutor: "Gustavo R.",
    neighborhood: "Lapa",
    pet: "Nina",
    breed: "Border Collie",
    service: "Banho",
    rating: 4,
    quote:
      "Atendimento ótimo e a Nina adora a equipe. Só tirei uma estrela porque no sábado é difícil achar horário, então agora agendo com uma semana de antecedência.",
  },
  {
    tutor: "Camila T.",
    neighborhood: "Santa Cecília",
    pet: "Frajola",
    breed: "Gato SRD",
    service: "Banho",
    rating: 5,
    quote:
      "Não sabia que dava para levar gato. Atenderam o Frajola num horário mais vazio, com o box fechado e sem cachorro por perto. Ele voltou bravo, mas bravo de gato, não de medo.",
  },
  {
    tutor: "Paulo e Rita",
    neighborhood: "Pompeia",
    pet: "Dona Joana",
    breed: "Poodle, 14 anos",
    service: "Banho",
    rating: 5,
    quote:
      "A Dona Joana tem artrose e não fica muito tempo em pé. Fizeram o banho em etapas, com tapete antiderrapante e ela sentada. Saímos de lá emocionados com o cuidado.",
  },
];

/** Média e total dos depoimentos exibidos (o selo geral de 4,9 está em STATS). */
export const TESTIMONIALS_AVERAGE =
  Math.round((TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / TESTIMONIALS.length) * 10) / 10;
