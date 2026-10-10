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

@AGENTS.md
