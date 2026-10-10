import {
  CANCELLATION_MIN_HOURS,
  MAX_DAYS_AHEAD,
  NEXT_BATH_DAYS,
  SLOT_CAPACITY,
} from "@/lib/business-rules";

/** Perguntas frequentes. As regras citadas vêm das constantes do sistema, então nunca divergem. */
export type FaqItem = { question: string; answer: string };
export type FaqCategory = { id: string; label: string; items: readonly FaqItem[] };

export const FAQ: readonly FaqCategory[] = [
  {
    id: "agendamento",
    label: "Agendamento",
    items: [
      {
        question: "Como faço para agendar?",
        answer:
          "Pelo site, em 5 passos: escolha o pet, o serviço, a data e o horário, diga se quer táxi dog e revise. O preço aparece antes de confirmar. Se preferir, chame no WhatsApp.",
      },
      {
        question: "Com quanto tempo de antecedência posso marcar?",
        answer: `Até ${MAX_DAYS_AHEAD} dias à frente. Sábado costuma lotar primeiro, então vale marcar com uma semana de antecedência.`,
      },
      {
        question: "Posso cancelar ou remarcar?",
        answer: `Sim. Pela área do tutor você cancela até ${CANCELLATION_MIN_HOURS}h antes do horário, sem custo. Com menos de ${CANCELLATION_MIN_HOURS}h, fale com a gente pelo WhatsApp.`,
      },
      {
        question: "Quantos pets são atendidos ao mesmo tempo?",
        answer: `No máximo ${SLOT_CAPACITY} por horário, um com cada banhista. O sistema não deixa a agenda passar disso, por isso não há espera em gaiola.`,
      },
      {
        question: "Quais são as formas de pagamento?",
        answer: "Pix, cartão de débito e crédito (em até 2x a partir de R$ 150). O pagamento é feito na retirada do pet.",
      },
    ],
  },
  {
    id: "servicos",
    label: "Serviços e preços",
    items: [
      {
        question: "Por que o preço muda conforme o porte?",
        answer:
          "Porque muda o tempo e a quantidade de produto. P vai até 10 kg, M de 10 a 25 kg e G acima de 25 kg. O porte é calculado pelo peso cadastrado do pet.",
      },
      {
        question: "Meu pet tem pelo longo. Paga a mais?",
        answer:
          "Sim, um acréscimo por porte que aparece na página de preços. Ele é confirmado na avaliação de chegada e você é avisado antes de começarmos.",
      },
      {
        question: "Vocês atendem gatos?",
        answer:
          "Atendemos, em horários mais vazios e com o box fechado, sem cachorros por perto. Gatos muito estressados podem ter o banho interrompido para a segurança deles.",
      },
      {
        question: "De quanto em quanto tempo devo dar banho?",
        answer: `Para a maioria dos cães, a cada ${NEXT_BATH_DAYS} dias. Por isso a área do tutor sugere o próximo banho ${NEXT_BATH_DAYS} dias depois do último.`,
      },
    ],
  },
  {
    id: "saude",
    label: "Saúde e segurança",
    items: [
      {
        question: "Quais vacinas são exigidas?",
        answer:
          "Para cães: polivalente (V8 ou V10) e antirrábica em dia. Para gatos: V4 ou V5 e antirrábica. Você pode registrar tudo na carteirinha digital da área do tutor.",
      },
      {
        question: "Meu pet é idoso ou tem alguma doença. Pode tomar banho?",
        answer:
          "Na maioria dos casos, sim. Fazemos o banho em etapas, com pausas e tapete antiderrapante. Conte sobre a condição no campo de observações do agendamento.",
      },
      {
        question: "Vocês usam sedação ou focinheira?",
        answer:
          "Sedação, nunca. Focinheira só se o pet já usa no dia a dia e o tutor autorizar. Se o estresse ficar alto, paramos o atendimento e ligamos para você.",
      },
      {
        question: "E se encontrarem pulga ou carrapato?",
        answer:
          "Avisamos na hora, fazemos o banho com produto específico e higienizamos o box antes do próximo pet. Veja os detalhes na página de políticas.",
      },
    ],
  },
  {
    id: "taxi",
    label: "Táxi dog",
    items: [
      {
        question: "Quanto custa o táxi dog?",
        answer:
          "Depende da zona do seu CEP: Centro R$ 15, Sul e Oeste R$ 20, Norte e Leste R$ 25. A taxa já inclui ida e volta.",
      },
      {
        question: "Vocês atendem fora da capital?",
        answer:
          "O táxi dog atende só a cidade de São Paulo. Pets de outras cidades são bem-vindos no estúdio, trazidos pelo tutor.",
      },
      {
        question: "Como o pet é transportado?",
        answer:
          "Em caixa de transporte presa ao banco, um pet por vez, com ar-condicionado. O motorista avisa por mensagem quando sai e quando chega.",
      },
      {
        question: "Preciso estar em casa na busca?",
        answer:
          "Precisa de alguém maior de idade para entregar e receber o pet. A janela de busca é de 30 minutos antes do horário marcado.",
      },
    ],
  },
];

export const FAQ_COUNT = FAQ.reduce((total, category) => total + category.items.length, 0);
