# Pelagem Studio 🐾

**[Português](#português) · [English](#english)**

> Projeto fictício desenvolvido para portfólio por **Victoria Fernandes Vieira**.
> Fictional project built for portfolio purposes by **Victoria Fernandes Vieira**.

---

## Português

Pet spa fictício de banho e tosa em São Paulo, com **agendamento online de verdade**: disponibilidade por
capacidade, táxi dog com CEP, área do tutor e uma API de integração para dashboards.

**Conta de demonstração:** `demo@example.com` / `pelagem-demo`

### O que o projeto demonstra

| Área | Destaques |
| --- | --- |
| **Lógica de agendamento** | Motor de disponibilidade como **função pura** testada: terça a sábado, 9h–18h, slots de 30 min, 2 banhistas por slot, serviço ocupando vários slots, sem passado e até 30 dias à frente. |
| **Concorrência** | A confirmação roda numa transação com `pg_advisory_xact_lock` por dia: 6 pedidos simultâneos para o último horário → exatamente 2 confirmados (a capacidade). |
| **Back-end** | PostgreSQL (Neon) + Prisma, Server Actions e Route Handlers, preço/duração **sempre recalculados no servidor**, todo acesso checa o dono do recurso. |
| **Autenticação** | Auth.js v5 com credenciais, bcrypt, JWT em cookie `httpOnly`, rotas protegidas pelo `proxy` (Next 16) **e** de novo em cada página/ação, sem enumeração de contas (mensagem e tempo constantes), `callbackUrl` só interno. |
| **Segurança da API** | `x-api-key` com `crypto.timingSafeEqual`, limite de 60 req/min por IP antes da autenticação, nenhum dado pessoal (cliente vira `SHA-256(id + salt)`). |
| **Integrações** | ViaCEP consultado no servidor, com timeout, resposta validada por Zod e cidade checada pelo código IBGE. |
| **UI e acessibilidade** | Tailwind + shadcn/ui, mobile first, abas e carrossel no padrão WAI-ARIA, foco visível em todos os elementos (auditado com teclado), contraste AA, Lighthouse mobile ≥ 90 em Performance e 100 em Acessibilidade. |
| **Tempo real** | "Acompanhe o banho": etapa salva no banco, tela do tutor atualizada a cada 30 s (pausa com a aba oculta) e anunciada a leitores de tela; painel da equipe com atualização atômica. |
| **Movimento** | Animações só com `transform`/`opacity`, texto animado por CSS desde o primeiro paint, parallax e tilt só com mouse, tudo desligado com `prefers-reduced-motion`. |
| **Qualidade** | TypeScript estrito sem `any`, Zod no cliente e no servidor, 138 testes Vitest, seed idempotente e determinístico. |

### Funcionalidades

- **Home**: hero animado com selos em parallax, faixas de serviços e bairros, diferenciais em bento, serviços em
  destaque (do banco, em cache), como funciona, antes e depois com slider, números, depoimentos em carrossel e
  localização.
- **Páginas institucionais**: /sobre (linha do tempo e equipe), /seguranca, /precos (simulador de orçamento,
  pelagem longa, adicionais e planos), /politicas, /perguntas-frequentes (17 perguntas em abas), /dicas (6 artigos),
  /trabalhe-conosco (formulário com Zod, limite por IP e consentimento LGPD) e /creditos.
- **/servicos**: seletor P/M/G que atualiza preço e duração sem recarregar; tabela completa e taxas do táxi dog.
- **/agendar**: assistente em 5 passos (pet → serviço → data/horário → táxi dog → revisão) com barra de progresso.
- **/minha-conta**: acompanhe o banho ao vivo, próximo banho sugerido (15 dias após o último), cancelamento até
  24h antes, pets com carteirinha de vacinas e alertas de vencimento, histórico.
- **/equipe** (admin): avança as etapas dos atendimentos do dia.
- **API para dashboard**: `GET /api/integracao/agendamentos` e `GET /api/integracao/resumo`.
- **SEO**: metadata, Open Graph gerado por código, sitemap, robots (previews não indexados), JSON-LD `PetStore`.

### Stack

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · shadcn/ui · PostgreSQL na Neon ·
Prisma 6 · Auth.js v5 · Zod · react-hook-form · date-fns · bcryptjs · lucide-react · Vitest · @faker-js/faker · tsx ·
Vercel.

### Decisões técnicas

- **Fuso horário**: São Paulo é UTC−03:00 fixo desde 2019. Instantes ficam em `timestamptz` (UTC) e todas as
  conversões estão em `src/lib/business-rules.ts`, a fonte única das regras.
- **Prisma 6**: suporta `url` (pooling) + `directUrl` (direta) da Neon sem driver adapter extra.
- **Trava por dia** em vez de isolamento serializável: comportamento determinístico e sem retentativas, porque
  atendimentos nunca cruzam a meia-noite.
- **Defesa em profundidade**: o `proxy` redireciona, mas páginas e Server Actions conferem a sessão de novo.
- **Limite de requisições em memória**: vale por instância serverless; um limite global usaria Redis/Upstash.
- Mais detalhes em [`CLAUDE.md`](./CLAUDE.md), seção *Decisões técnicas*.

### Como rodar localmente (Windows / PowerShell)

Pré-requisitos: Node.js 22+ e um banco PostgreSQL (recomendado: projeto gratuito na [Neon](https://neon.tech)).

```powershell
git clone https://github.com/Vicfvieira/Pelagem-Studio.git
cd Pelagem-Studio
npm install
Copy-Item .env.example .env
```

Gere as chaves e cole no `.env`:

```powershell
node -e "const c=require('crypto');console.log('AUTH_SECRET=\"'+c.randomBytes(32).toString('base64')+'\"');console.log('INTEGRATION_API_KEY=\"'+c.randomBytes(32).toString('hex')+'\"');console.log('HASH_SALT=\"'+c.randomBytes(32).toString('hex')+'\"')"
```

| Variável | Descrição |
| --- | --- |
| `DATABASE_URL` | URL da Neon **com pooling** (host com `-pooler`) + `&pgbouncer=true&connect_timeout=15` |
| `DIRECT_URL` | URL da Neon **direta** (sem `-pooler`), usada pelas migrações |
| `AUTH_SECRET` | Segredo do Auth.js (32 bytes em base64) |
| `INTEGRATION_API_KEY` | Chave da API de integração (header `x-api-key`) |
| `HASH_SALT` | Salt do `clienteHash` (não troque depois de publicar) |
| `NEXT_PUBLIC_SITE_URL` | Opcional: domínio próprio para SEO |

Depois:

```powershell
npx prisma migrate deploy
npm run db:seed   # mostra a senha do admin uma única vez
npm run dev       # http://localhost:3000
```

### Scripts

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | `prisma generate` + `prisma migrate deploy` + `next build` |
| `npm test` | Testes Vitest |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Cria/aplica migrações em desenvolvimento |
| `npm run db:seed` | Seed idempotente: 40 tutores, 60 pets, 300 agendamentos |
| `npm run db:studio` | Prisma Studio |
| `npm run admin:senha` | Gera e mostra uma nova senha para `admin@example.com` (painel /equipe) |

### API de integração

Todas as rotas exigem o header `x-api-key` e respondem sem cache. Limite: 60 requisições por minuto por IP
(headers `X-RateLimit-*`; ao estourar, `429` com `Retry-After`).

```powershell
$k = @{ "x-api-key" = "SUA_INTEGRATION_API_KEY" }
Invoke-RestMethod "http://localhost:3000/api/integracao/agendamentos?desde=2026-10-01&ate=2026-10-31&pagina=1&porPagina=20" -Headers $k
Invoke-RestMethod "http://localhost:3000/api/integracao/resumo?desde=2026-10-01&ate=2026-10-31" -Headers $k
```

- **`/agendamentos`**: `pagina` (≥ 1), `porPagina` (1–100), `desde`/`ate` (`AAAA-MM-DD`, datas de São Paulo,
  inclusivas). Cada item traz `clienteHash`, serviço, porte, espécie do pet (`CACHORRO` ou `GATO`), status, horários e valores, e **nenhum** dado pessoal.
- **`/resumo`**: status, receita, receita prevista, ticket médio, taxa de cancelamento, clientes únicos, serviços,
  portes, táxi dog e ocupação da agenda. Sem datas: últimos 30 dias.
- Erros: `400` (parâmetros, com detalhes por campo), `401` (chave), `429` (limite), `503` (sem `HASH_SALT`).

### Deploy (Vercel + Neon)

1. Importe o repositório na Vercel (framework: Next.js).
2. Em **Settings → Environment Variables**, cadastre as 5 variáveis para **Production e Preview**.
3. O build roda `prisma migrate deploy` automaticamente; rode o seed uma vez apontando para a Neon.

### Estrutura

```
prisma/              schema, migrações e seed
src/app/             rotas (páginas, Route Handlers, metadata)
src/components/      UI (ui/, layout/, home/, content/, motion/, quote/, booking/, account/, staff/, ...)
src/content/         textos e dados fictícios (empresa, equipe, FAQ, artigos, depoimentos, fotos)
src/lib/             regras de negócio, agenda, auth, booking, conta, preços, acompanhamento, integração, Zod
src/proxy.ts         proteção de rotas (antigo middleware no Next 16)
```

---

## English

A fictional pet grooming spa in São Paulo, Brazil, with **real online booking**: capacity-based availability,
pet-taxi pricing by ZIP code, a customer area and an integration API for dashboards.

**Demo account:** `demo@example.com` / `pelagem-demo`

### What this project demonstrates

| Area | Highlights |
| --- | --- |
| **Scheduling logic** | Availability engine as a tested **pure function**: Tuesday–Saturday, 9am–6pm, 30-minute slots, 2 groomers per slot, services spanning several slots, no past dates, up to 30 days ahead. |
| **Concurrency** | Booking runs in a transaction with a per-day `pg_advisory_xact_lock`: 6 simultaneous requests for the last slot → exactly 2 confirmed (the capacity). |
| **Back end** | PostgreSQL (Neon) + Prisma, Server Actions and Route Handlers, price and duration **always recomputed on the server**, every access checks resource ownership. |
| **Authentication** | Auth.js v5 credentials, bcrypt, JWT in an `httpOnly` cookie, routes guarded by the Next 16 `proxy` **and** again in every page/action, no account enumeration (constant message and timing), internal-only `callbackUrl`. |
| **API security** | `x-api-key` compared with `crypto.timingSafeEqual`, 60 req/min per IP rate limit enforced before authentication, no personal data (customers become `SHA-256(id + salt)`). |
| **Integrations** | ViaCEP (Brazilian ZIP API) called server-side with a timeout, Zod-validated response and city checked by IBGE code. |
| **UI & accessibility** | Tailwind + shadcn/ui, mobile first, WAI-ARIA tabs and carousel, visible focus on every element (keyboard-audited), WCAG AA contrast, mobile Lighthouse ≥ 90 Performance and 100 Accessibility. |
| **Real time** | "Track the bath": stage stored in the database, the customer screen refreshes every 30 s (paused in hidden tabs) and announces changes to screen readers; staff panel with atomic updates. |
| **Motion** | Animations use only `transform`/`opacity`, CSS-animated headline from the first paint, mouse-only parallax and tilt, everything disabled with `prefers-reduced-motion`. |
| **Quality** | Strict TypeScript with no `any`, Zod on client and server, 138 Vitest tests, idempotent and deterministic seed. |

### Features

- **Home**: animated hero with parallax badges, services/neighborhoods marquee, bento highlights, featured services
  (from the database, cached), how it works, before/after slider, stats, testimonial carousel and location.
- **Company pages**: about (timeline and team), safety, prices (quote simulator, long-coat surcharge, add-ons and
  plans), policies, FAQ (17 questions in tabs), tips (6 articles), careers (Zod form, per-IP limit, LGPD consent)
  and credits.
- **/servicos**: S/M/L size selector that updates price and duration without reloading; full price table.
- **/agendar**: 5-step booking wizard (pet → service → date/time → pet taxi → review) with a progress bar.
- **/minha-conta**: live bath tracking, suggested next bath (15 days after the last one), cancellation up to 24h
  before, pets with vaccination cards and expiry alerts, history.
- **/equipe** (admin): moves today's appointments through the grooming stages.
- **Dashboard API**: `GET /api/integracao/agendamentos` and `GET /api/integracao/resumo`.
- **SEO**: metadata, code-generated Open Graph image, sitemap, robots (previews not indexed), `PetStore` JSON-LD.

### Tech stack

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · shadcn/ui · PostgreSQL on Neon ·
Prisma 6 · Auth.js v5 · Zod · react-hook-form · date-fns · bcryptjs · lucide-react · Vitest · @faker-js/faker · tsx ·
Vercel.

### Running locally

Requirements: Node.js 22+ and a PostgreSQL database (a free [Neon](https://neon.tech) project works well).

```bash
git clone https://github.com/Vicfvieira/Pelagem-Studio.git
cd Pelagem-Studio
npm install
cp .env.example .env   # fill in the variables (see the table in the Portuguese section)
npx prisma migrate deploy
npm run db:seed        # prints the admin password once
npm run dev            # http://localhost:3000
```

Generate the secrets with Node's `crypto`:

```bash
node -e "const c=require('crypto');console.log(c.randomBytes(32).toString('base64'))"   # AUTH_SECRET
node -e "const c=require('crypto');console.log(c.randomBytes(32).toString('hex'))"      # INTEGRATION_API_KEY, HASH_SALT
```

### Integration API

Every route requires the `x-api-key` header and is never cached. Rate limit: 60 requests per minute per IP.

```bash
curl -H "x-api-key: $INTEGRATION_API_KEY" "http://localhost:3000/api/integracao/agendamentos?desde=2026-10-01&ate=2026-10-31&pagina=1&porPagina=20"
curl -H "x-api-key: $INTEGRATION_API_KEY" "http://localhost:3000/api/integracao/resumo"
```

`desde`/`ate` are inclusive São Paulo dates (`YYYY-MM-DD`). Responses contain no personal data; errors are
`400`, `401`, `429` and `503`.

### Deployment

Import the repository on Vercel, add the 5 environment variables for **Production and Preview**, and deploy:
the build runs `prisma generate`, `prisma migrate deploy` and `next build`. Run the seed once against Neon.

---

Projeto fictício desenvolvido para portfólio por Victoria Fernandes Vieira. Dados, endereço, telefone,
depoimentos e ilustrações são fictícios ou criados para o projeto.
