/**
 * Artigos do blog /dicas. Textos originais e FICTÍCIOS, escritos pela "equipe" do Pelagem Studio.
 * Conteúdo informativo: nenhum artigo substitui a orientação do veterinário.
 */
export type ArticleSection = { heading: string; paragraphs: readonly string[]; list?: readonly string[] };

export type Article = {
  slug: string;
  title: string;
  summary: string;
  category: "Rotina" | "Comportamento" | "Saúde" | "Cuidados em casa";
  /** Data local de publicação (AAAA-MM-DD). */
  publishedAt: string;
  author: string;
  readingMinutes: number;
  sections: readonly ArticleSection[];
};

export const ARTICLES: readonly Article[] = [
  {
    slug: "de-quanto-em-quanto-tempo-dar-banho",
    title: "De quanto em quanto tempo dar banho no cachorro?",
    summary:
      "Banho demais resseca a pele, banho de menos acumula sujeira. Veja como acertar o intervalo para o seu pet.",
    category: "Rotina",
    publishedAt: "2026-09-08",
    author: "Helena Duarte",
    readingMinutes: 4,
    sections: [
      {
        heading: "O intervalo que funciona para a maioria",
        paragraphs: [
          "Para a maior parte dos cães que vivem em apartamento e passeiam todo dia, um banho a cada 15 dias mantém a pelagem limpa sem tirar a oleosidade natural que protege a pele.",
          "É por isso que a área do tutor sugere o próximo banho 15 dias depois do último. A sugestão é um ponto de partida, não uma regra.",
        ],
      },
      {
        heading: "Quando encurtar o intervalo",
        paragraphs: ["Alguns pets pedem banho com mais frequência, a cada 7 ou 10 dias:"],
        list: [
          "Cães que passeiam em parque de terra ou areia quase todo dia.",
          "Pets de pelo claro, que mostram sujeira mais rápido.",
          "Casas com criança pequena ou pessoa alérgica, por orientação médica.",
        ],
      },
      {
        heading: "Quando alongar",
        paragraphs: [
          "Raças de pelo duplo, como Spitz e Husky, costumam ir bem com banhos a cada 20 ou 30 dias, desde que sejam escovadas em casa. Pets com dermatite seguem o intervalo que o veterinário indicar, muitas vezes com shampoo terapêutico.",
        ],
      },
      {
        heading: "Sinais de que passou da hora",
        paragraphs: [
          "Cheiro forte mesmo depois de secar, pelo embolado atrás das orelhas e coceira frequente são bons avisos. Coceira com feridas ou queda de pelo em falhas é assunto para o veterinário antes do banho.",
        ],
      },
    ],
  },
  {
    slug: "pet-ansioso-no-banho",
    title: "Como preparar um pet ansioso para o banho",
    summary:
      "Treino com o barulho do secador, chegada sem pressa e recompensas: o que fazer em casa e o que fazemos no estúdio.",
    category: "Comportamento",
    publishedAt: "2026-08-21",
    author: "Caio Nogueira",
    readingMinutes: 5,
    sections: [
      {
        heading: "Ansiedade não é birra",
        paragraphs: [
          "Tremer, lamber os lábios, bocejar fora de hora e tentar se esconder são sinais de medo. Forçar o pet a 'se acostumar' costuma piorar. O caminho é deixar a experiência previsível e associada a coisas boas.",
        ],
      },
      {
        heading: "O que fazer em casa, na semana anterior",
        paragraphs: ["Pequenas sessões de 3 a 5 minutos por dia já fazem diferença:"],
        list: [
          "Ligue o secador de cabelo longe do pet, na potência mínima, e ofereça um petisco.",
          "Toque nas patas e nas orelhas durante o carinho, para ele se acostumar com o manuseio.",
          "Faça a caixa de transporte virar um lugar bom, com cobertor e brinquedo dentro.",
        ],
      },
      {
        heading: "No dia do banho",
        paragraphs: [
          "Faça um passeio curto antes, para ele gastar energia e fazer as necessidades. Chegue com 5 minutos de folga: a pressa do tutor passa para o pet.",
          "Avise no campo de observações do agendamento. Assim, a gente separa um horário mais calmo e começa pela adaptação, deixando o pet cheirar a sala e a equipe antes de molhar.",
        ],
      },
      {
        heading: "Quando parar",
        paragraphs: [
          "Se o estresse não baixa, a gente interrompe e liga para você. Nunca usamos sedação. Em casos de ansiedade intensa, vale conversar com o veterinário ou com um adestrador.",
        ],
      },
    ],
  },
  {
    slug: "braquicefalicos-no-banho",
    title: "Pug, bulldog e shih-tzu: cuidados no banho de braquicefálicos",
    summary:
      "Focinho curto exige secagem em temperatura baixa, pausas e atenção às dobras. Entenda por quê.",
    category: "Saúde",
    publishedAt: "2026-07-30",
    author: "Beatriz Okada",
    readingMinutes: 4,
    sections: [
      {
        heading: "Por que eles precisam de atenção extra",
        paragraphs: [
          "Raças braquicefálicas têm as vias aéreas mais curtas e trocam calor com mais dificuldade. Ambiente quente, secador forte e agitação podem deixar a respiração ofegante muito rápido.",
        ],
      },
      {
        heading: "Como fazemos no estúdio",
        paragraphs: ["O protocolo para focinho curto inclui:"],
        list: [
          "Secagem com ar morno ou frio, nunca quente, e o secador longe do rosto.",
          "Pausas a cada poucos minutos para observar a respiração.",
          "Limpeza e secagem completa das dobras do focinho, onde a umidade causa assaduras.",
          "Sala climatizada e água fresca à disposição.",
        ],
      },
      {
        heading: "Em casa",
        paragraphs: [
          "Limpe as dobras com gaze seca duas ou três vezes por semana. Em dias muito quentes, prefira agendar pela manhã. Se o pet ronca muito ou cansa em passeios curtos, converse com o veterinário.",
        ],
      },
    ],
  },
  {
    slug: "escovacao-em-casa",
    title: "Escovação em casa: o passo a passo para evitar nós",
    summary: "Escova certa, sentido do pelo e frequência por tipo de pelagem. Menos nós, menos desembolo.",
    category: "Cuidados em casa",
    publishedAt: "2026-07-02",
    author: "Helena Duarte",
    readingMinutes: 5,
    sections: [
      {
        heading: "Escolha a escova pelo tipo de pelo",
        paragraphs: ["Cada pelagem pede uma ferramenta:"],
        list: [
          "Pelo curto (vira-lata, labrador): luva de borracha ou escova de cerdas.",
          "Pelo longo (shih-tzu, lhasa, yorkshire): rasqueadeira macia e pente de dentes largos.",
          "Pelo duplo (spitz, golden): rasqueadeira e ancinho para o subpelo.",
        ],
      },
      {
        heading: "O passo a passo",
        paragraphs: [
          "Comece pelas costas, que o pet tolera melhor, e deixe barriga, axilas e atrás das orelhas para o fim. Escove em pequenas mechas, da ponta para a raiz, segurando o pelo perto da pele para não puxar.",
          "Passe o pente no final: se ele trava, ainda tem nó ali. Nós grandes e colados na pele não devem ser cortados com tesoura em casa, pelo risco de ferir.",
        ],
      },
      {
        heading: "Com que frequência",
        paragraphs: [
          "Pelo curto: uma vez por semana. Pelo duplo: duas a três vezes por semana, todos os dias na troca de pelo. Pelo longo: todos os dias, mesmo que por 5 minutos. Quem escova em casa raramente precisa de desembolo no estúdio.",
        ],
      },
    ],
  },
  {
    slug: "pulgas-e-carrapatos-no-verao",
    title: "Pulgas e carrapatos: como prevenir no verão de São Paulo",
    summary: "Calor e chuva aceleram o ciclo dos parasitas. Saiba onde olhar e como manter a casa protegida.",
    category: "Saúde",
    publishedAt: "2026-06-10",
    author: "Larissa Campos",
    readingMinutes: 4,
    sections: [
      {
        heading: "Por que o verão é a época mais crítica",
        paragraphs: [
          "Com calor e umidade, pulgas e carrapatos se reproduzem mais rápido. Praças, parques e até o corredor do prédio podem ter ovos e larvas. A prevenção contínua é mais eficaz do que tratar a infestação depois.",
        ],
      },
      {
        heading: "Onde procurar no seu pet",
        paragraphs: ["Depois do passeio, passe a mão contra o pelo nestes pontos:"],
        list: [
          "Atrás e dentro das orelhas.",
          "Entre os dedos das patas.",
          "Axilas, virilha e base da cauda.",
        ],
      },
      {
        heading: "Prevenção",
        paragraphs: [
          "O antipulgas certo depende do peso, da idade e da saúde do pet, e quem indica é o veterinário. Em casa, aspire tapetes e frestas toda semana e lave a caminha em água quente.",
          "No estúdio, se encontramos parasitas, avisamos na hora, usamos produto específico no banho e higienizamos o box antes do próximo atendimento.",
        ],
      },
    ],
  },
  {
    slug: "unhas-compridas",
    title: "Unhas compridas: sinais de que passou da hora de cortar",
    summary: "Barulho no piso, patas abertas e dor ao andar. Por que as unhas importam e de quanto em quanto tempo cortar.",
    category: "Rotina",
    publishedAt: "2026-05-19",
    author: "Beatriz Okada",
    readingMinutes: 3,
    sections: [
      {
        heading: "Os sinais",
        paragraphs: ["Fique de olho se:"],
        list: [
          "Dá para ouvir as unhas batendo no piso.",
          "Os dedos ficam abertos quando o pet está em pé.",
          "Ele escorrega mais do que antes ou evita andar em superfícies lisas.",
        ],
      },
      {
        heading: "Por que não esperar",
        paragraphs: [
          "Unha comprida muda a forma de pisar e sobrecarrega articulações, o que pesa mais em pets idosos. Além disso, o vaso sanguíneo dentro da unha cresce junto, e cortar fica mais difícil a cada mês.",
        ],
      },
      {
        heading: "Frequência e cuidado no corte",
        paragraphs: [
          "Em geral, a cada 3 ou 4 semanas. Pets que andam muito em calçada gastam as unhas sozinhos e precisam de menos cortes. No estúdio, cortamos aos poucos e lixamos no final, para não atingir o vaso.",
        ],
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}
