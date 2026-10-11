# CONTEXTO
Sou Victoria Fernandes Vieira, desenvolvedora Full Stack. Este é um projeto para meu portfólio:
"Pelagem Studio", pet spa de banho e tosa em São Paulo. Ele deve provar a recrutadores: lógica de
agendamento real, back-end com banco, autenticação, segurança e UI bem feita.
O projeto já foi criado com create-next-app nesta pasta. Uso Windows com PowerShell.

Stack obrigatória: Next.js (App Router, TypeScript), Tailwind CSS + shadcn/ui, Server Actions e
Route Handlers, PostgreSQL na Neon + Prisma, Auth.js (next-auth v5) com credenciais, Zod,
react-hook-form, date-fns, bcryptjs, lucide-react, Vitest, @faker-js/faker, tsx. Deploy na Vercel.

Identidade visual: viva e acolhedora. Primária caramelo #E8833A, secundária menta #5BBFA0,
fundo creme #FFF8F0, texto #2B2B2B, bordas rounded-2xl, fonte Nunito (next/font).

Regras de negócio:
- Portes: P (até 10 kg), M (10 a 25 kg), G (acima de 25 kg).
- Serviços: Banho, Banho + Tosa higiênica, Tosa completa, Hidratação, Corte de unhas;
  preço (em centavos) e duração variam por porte.
- Funcionamento: terça a sábado, 9h às 18h, slots de 30 min, 2 banhistas (capacidade 2 por slot).
- Um agendamento ocupa todos os slots da sua duração. Proibido: passar da capacidade, data no
  passado, mais de 30 dias de antecedência.
- Táxi dog: CEP consultado na API ViaCEP; taxa por zona de SP (Centro R$15, Sul/Oeste R$20,
  Norte/Leste R$25); fora de São Paulo indisponível.
- Próximo banho sugerido: 15 dias após o último concluído. Cancelamento: até 24h antes.

# PAPEL
Atue como engenheiro(a) Full Stack sênior e mentor(a). Escreva código de produção, explique
decisões em poucas linhas e em português, priorize segurança, acessibilidade e código legível.

# TAREFA
Execute as etapas abaixo UMA POR VEZ, na ordem. Ao terminar cada etapa, pare, entregue o
Formato de Saída e espere eu responder "próxima". Nunca adiante etapas.

Etapa 0 — Setup: instale as dependências da stack, rode prisma init e shadcn init, gere AUTH_SECRET
com npx auth secret, crie .env e .env.example com DATABASE_URL, DIRECT_URL, AUTH_SECRET,
INTEGRATION_API_KEY e HASH_SALT (gere as chaves com crypto do Node). Salve todo este prompt em
CLAUDE.md. Diga exatamente o que eu preciso colar no .env.
Etapa 1 — Banco e seed: schema Prisma com User (role TUTOR/ADMIN), Pet, Vaccine, Service,
ServicePrice, Appointment (status AGENDADO/CONCLUIDO/CANCELADO) e TaxiZone, com índices.
Seed idempotente em pt_BR: 40 tutores, 60 pets, 300 agendamentos (6 meses passados + 2 semanas
futuras) respeitando horário e capacidade. Script db:seed. Rode a migração e o seed.
Etapa 2 — Layout e home: header com menu mobile, rodapé, botão flutuante de WhatsApp fictício;
home com hero, serviços em destaque, como funciona em 3 passos, depoimentos e localização.
Etapa 3 — /servicos: dados do banco e seletor P/M/G que atualiza preço e duração sem recarregar;
botão Agendar este serviço levando a /agendar com serviço e porte.
Etapa 4 — Motor de disponibilidade: função pura getAvailableSlots em src/lib/scheduling.ts com
testes Vitest (dia fechado, slot lotado, sobreposição, depois do fechamento, passado, mais de 30
dias) e rota GET /api/disponibilidade validada com Zod.
Etapa 5 — Autenticação: /entrar e /cadastro com Auth.js, senha com bcrypt, erro genérico no login,
middleware protegendo /minha-conta e /agendar com retorno à página pedida.
Etapa 6 — Agendamento em 5 passos com barra de progresso: pet, serviço, data/horário, táxi dog
(ViaCEP + taxa) e revisão. Server Action recalcula preço e confere disponibilidade numa transação.
Etapa 7 — /minha-conta: pets, carteirinha de vacinas com alertas, próximos agendamentos com
cancelamento (até 24h), histórico e card de próximo banho sugerido.
Etapa 8 — API para o dashboard: GET /api/integracao/agendamentos (paginado, filtros desde/ate) e
/api/integracao/resumo, protegidas por header x-api-key (crypto.timingSafeEqual), limite de 60
req/min por IP, sem dados pessoais: clienteHash = SHA-256 do id + HASH_SALT. Testes Vitest.
Etapa 9 — Polimento e deploy: metadata, Open Graph, sitemap, robots, JSON-LD PetStore, páginas
404 e erro, loading states; Prisma configurado para Neon (pooling em DATABASE_URL, direta em
DIRECT_URL); build rodando prisma generate e migrate deploy; README em português e inglês.

# RESTRIÇÕES
- TypeScript estrito, sem any. Validação com Zod no cliente e no servidor.
- Preço e disponibilidade sempre recalculados no servidor; todo acesso checa o dono do recurso.
- Segredos só no .env, nunca commitados. Apenas dados e imagens fictícios ou livres de direitos.
- Acessibilidade (semântica, alt, contraste AA, teclado), mobile first, Lighthouse 90+.
- Não instale bibliotecas fora da stack sem pedir. Não mexa em arquivos fora da etapa atual.
- Rodapé de todas as páginas: "Projeto fictício desenvolvido para portfólio por Victoria Fernandes Vieira."

# FORMATO DE SAÍDA (ao fim de cada etapa, em português)
1. O que foi feito, em até 5 linhas.
2. Arquivos criados ou alterados.
3. Comandos que eu preciso rodar.
4. Passo a passo para eu testar no navegador.
5. Mensagem de commit no padrão Conventional Commits.

---

# DECISÕES TÉCNICAS (registradas durante a execução)

- **Prisma 6 (não 7)**: o Prisma 7 exige um driver adapter (`@prisma/adapter-neon`), fora da stack.
  O Prisma 6 suporta nativamente `url` (pooling) + `directUrl` (direta) no `schema.prisma`.
  Sem `prisma.config.ts`, para que o CLI carregue o `.env` sozinho (sem `dotenv`).
- **AUTH_SECRET via `crypto`**: o pacote npm `auth` passou a ser a CLI do Better Auth; `npx auth secret`
  não é mais a CLI do Auth.js. O segredo é gerado com `crypto.randomBytes(32).toString("base64")`.
- **shadcn/ui**: `components.json`, `src/lib/utils.ts` (`cn`) e tokens de tema em `globals.css`.
  Componentes ficam em `src/components/ui`.
- **Contraste**: texto sobre caramelo e menta usa `#2B2B2B` (branco sobre `#E8833A` não passa no AA).
- **Datas**: instantes em `timestamptz` (UTC); datas puras em `@db.Date`. São Paulo é UTC-03:00 fixo
  (sem horário de verão desde 2019); conversões em `src/lib/business-rules.ts`, fonte única das regras.
- **Seed**: tutores fictícios em `@example.com` (RFC 2606). Conta demo pública `demo@example.com` /
  `pelagem-demo`. Admin `admin@example.com` criado uma única vez com senha aleatória exibida no terminal.
- **Auth**: Next 16 renomeou `middleware` para `proxy` (`src/proxy.ts`, roda em Node). Config leve em
  `src/auth.config.ts` (sem Prisma/bcrypt) e completa em `src/auth.ts`. Páginas e ações protegidas checam a
  sessão de novo com `requireUser` (o proxy não é a única barreira). `callbackUrl` só aceita caminhos internos.
- **Login/cadastro sem enumeração**: mensagem genérica e tempo constante (hash bcrypt fictício quando o
  e-mail não existe; hash gerado antes da checagem de duplicidade no cadastro).
- **Agendamento**: `bookAppointment` (src/lib/booking/book.ts) confere o dono do pet, lê preço/duração pelo
  porte do pet e recota o táxi; grava numa transação com `pg_advisory_xact_lock` por dia, então pedidos
  simultâneos nunca estouram a capacidade (testado: 6 pedidos paralelos → 2 confirmados).
- **ViaCEP**: consultado no servidor, resposta validada com Zod, timeout de 5 s, cidade checada pelo código
  IBGE (3550308). `VIACEP_BASE_URL` existe só para testes locais.
- **Formulário em passos**: erros aparecem ao tentar avançar e somem ao editar o campo (evita o botão
  mudar de lugar no meio do clique).
- **Minha conta**: regras puras em `src/lib/account/rules.ts` (cancelamento ≥ 24h, situação da vacina com
  alerta em 30 dias, próximo banho = último banho concluído + 15 dias). Cancelar é um único `UPDATE` com
  dono + status + prazo no `WHERE` (atômico). Reforço de vacina marca a dose antiga como "dose anterior".
  Mutações usam `refresh()` (Next 16) para atualizar a página.
- **API de integração** (`/api/integracao/*`): limite de 60 req/min por IP checado ANTES da chave (força bruta
  também é limitada); `x-api-key` comparada com `timingSafeEqual` sobre SHA-256 dos dois lados; sem
  `HASH_SALT` responde 503. Limite em memória = por instância serverless (global exigiria Redis/Upstash).
  Seleção explícita de campos: nenhum dado pessoal; cliente vira `clienteHash`. Resumo calculado por
  função pura (`summarize`), testada.
- **SEO/deploy**: `siteUrl()` usa `NEXT_PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → `VERCEL_URL`. Só
  `VERCEL_ENV=production` é indexável (robots e meta robots); previews ficam fora dos buscadores. Canonical por
  página (não no layout). Open Graph gerado com `next/og` sem recursos externos. Sem `loading.tsx` global: ele
  transformava páginas estáticas em streaming (CLS 0,32); cada rota dinâmica tem esqueleto próprio.
  No Next 16, `error.tsx`/`global-error.tsx` recebem `retry` (não `reset`).
- **Movimento (motion)**: `LazyMotion` + `m.*` (bundle menor) e `MotionConfig reducedMotion="user"` no layout.
  `SplitText` e `Marquee` animam por CSS (`@keyframes`), começando no primeiro paint, sem esperar hidratação
  (bom para LCP); `Reveal`, `MagneticButton` e futuros parallax/tilt usam motion. Só transform/opacity.
  `CountUp` reserva a largura final (CLS 0) e expõe o valor final em sr-only. Marquee tem botão de pausa
  (WCAG 2.2.2) e cópia `inert`.
- **Tipografia (A2)**: títulos (h1–h3) em Fraunces com eixo SOFT (serifa arredondada), corpo em Nunito. Tokens de
  `@theme inline` não viram variáveis CSS, por isso a regra base usa `var(--font-fraunces)` direto. Caramelo de
  título `--primary-display` (#c2611e, 3,97:1) só em texto grande.
- **Hero (A2)**: título com SplitText (CSS), subtítulo só com deslocamento (sem opacidade 0, para contar no LCP desde o
  primeiro paint), CTAs e selos em sequência. Parallax só com mouse, via motion values (sem re-render), desligado com
  reduced motion. A "foto" é a ilustração própria até as fotos livres de direitos da A5.
- **Conteúdo institucional (A3)**: textos e dados fictícios em `src/content/*` (empresa, equipe, linha do tempo,
  depoimentos, FAQ, artigos, vagas) e em `src/lib/site.ts` (CNPJ com dígitos verificadores inválidos de propósito,
  redes só como texto, sem link). Regras citadas no FAQ/políticas vêm das constantes de `business-rules.ts`.
  História: fundado em 2019 na Vila Mariana, mudou para a Vila Madalena em 2022 (endereço atual).
- **Preços extras**: pelagem longa, adicionais e planos em `src/lib/pricing-extras.ts` (fonte única, também para o
  simulador da A4). Plano = banho avulso do banco × banhos/mês com desconto, arredondado para baixo em reais (`quotePlan`,
  testado). Pelagem longa e adicionais são confirmados na avaliação de chegada; o agendamento online cobra o serviço base.
- **Abas e carrossel**: linha do tempo e FAQ seguem o padrão WAI-ARIA Tabs (setas, Home, End; só a aba ativa no Tab);
  respostas do FAQ em `<details>`. Carrossel de depoimentos sem rolagem automática (scroll-snap + botões).
- **Trabalhe conosco**: modelo `JobApplication` (migração `job_applications`), Server Action com Zod, limite de 5 envios
  por 10 min por IP (em memória), campo-isca que finge sucesso e consentimento LGPD com data (`consentAt`).
- **Artigos**: `/dicas/[slug]` com `generateStaticParams` e `ensureStatic = "navigation"` (com Cache Components não há
  `dynamicParams=false`): slug desconhecido espera a renderização completa e `notFound()` responde 404 de verdade.
- **Menu**: 5 links no header a partir de `lg`; o resto está no mapa do site do rodapé (`SITEMAP_GROUPS`).
- **Simulador (A4)**: `estimateQuote` (puro, testado) com preços do banco + `pricing-extras`. O link para /agendar leva
  `servico`, `porte`, `pelo` e `adicionais`; o servidor transforma só valores de uma lista fechada em observações
  (`quoteNotes`), então um link de terceiros não injeta texto. Preço ao vivo com `AnimatedNumber` (rAF, sem lib extra).
- **Acompanhe o banho**: etapa em `Appointment.groomingStage` + `stageUpdatedAt` (migração `grooming_stage`). Etapas por
  serviço em `src/lib/tracking/stages.ts` (sem tosa no banho simples; corte de unhas só Recebido → Pronto). A tela do
  tutor consulta `GET /api/acompanhamento/[id]` a cada 30 s (pausa com a aba oculta), só o dono recebe 200 (outros: 404).
  A equipe avança em `/equipe` (ADMIN conferido no banco, não só no token); o UPDATE tem etapa esperada no WHERE, então
  cliques duplicados não pulam etapas. Depois de "Pronto", o próximo passo marca CONCLUIDO. Minha conta separa
  hoje / próximos (a partir de amanhã) / histórico. Seed cria um banho de hoje em "Secagem" para a conta demo (em dia
  aberto). `npm run admin:senha` gera nova senha para admin@example.com.
- **Antes/depois**: `<input type="range">` transparente sobre a imagem (mouse, toque e teclado nativos); recorte com
  clip-path e divisória com transform. Ilustrações próprias até as fotos da A5.
- **Microinterações**: `TiltCard` (motion values, só mouse, máx. 5°) em serviços, planos e equipe; botões afundam 3% ao
  clicar (desligado com reduced motion).
- **Fotos e créditos (A5)**: cadastro único em `src/content/photos.ts` (slot, alt, arquivo em /public/fotos, autor, fonte,
  licença). `<Photo>` usa next/image e SÓ publica foto com crédito; sem ela, mostra a ilustração própria do slot.
  `/creditos` lista fotos publicadas, ilustrações, fontes (OFL) e ícones (ISC). A rede deste ambiente bloqueia
  Unsplash/Pexels, então as fotos entram quando houver acesso ou arquivos enviados.
- **Layouts (A5)**: bento de diferenciais na home (dados reais: capacidade, taxas do táxi do banco, etapas, plano),
  serviços em grade assimétrica, passos em zigue-zague com caminho tracejado, bordas onduladas (`OrganicDivider`) e
  textura de papel/pontilhado (`.texture-paper`, `.texture-dots`, estáticas).
- **Performance (A6)**: o header lê a sessão no NAVEGADOR (`useSessionUser`, `GET /api/auth/session`, uma consulta por
  página), então todas as páginas públicas são 100% estáticas: sem parte dinâmica, o Next não envia o payload do React
  duas vezes (home: 305 → 198 KB de HTML). Não é controle de acesso: proxy, páginas e ações seguem checando no servidor.
  Recursos do motion carregados de forma assíncrona (`LazyMotion` com import dinâmico). Conteúdo do topo da página nunca
  usa `Reveal` (que começa invisível até o JS); usa `.slide-in` (CSS, só transform). Estrelas e patinhas repetidas são
  máscaras CSS (`.rating-stars`, `.icon-paw`) em vez de dezenas de `<svg>`. Cartões do carrossel e imagens do hero e do
  antes/depois são renderizados no servidor e passados como `ReactNode` aos componentes cliente (menos hidratação).
  Formulários de pet e vacina (react-hook-form + Zod) carregam com `next/dynamic` só ao abrir. O de "Trabalhe conosco"
  só carrega perto de entrar na tela (IntersectionObserver), com espaço reservado da mesma altura. Em /minha-conta, o
  título fica fora do `Suspense` (pintado antes dos dados). Transições só de `transform`/`opacity` (barra do
  agendamento usa `scaleX`). Lighthouse medido como mediana de 3 rodadas (a nota simulada oscila ±5 neste ambiente).

@AGENTS.md
