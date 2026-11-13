# Find&Fix

App (PWA) que torna reparações e remodelações de interiores mais acessíveis e transparentes: diagnóstico por IA e ligação a profissionais. Projeto de grupo de CVPBT (LIGE, ISCTE).

> **Estado:** protótipo (≈30% do MVP), a custo 0 €. Só serviços gratuitos, Stripe sempre em modo de teste e PWA sem publicação nas lojas. As regras de trabalho estão em [`AGENTS.md`](AGENTS.md) (raiz e em cada app); convém ler antes de começar.

## Estrutura do repositório

```
Find-Fix/
├── apps/
│   ├── mobile/              ← app Expo (React Native), exportada como PWA
│   └── web/                 ← Next.js + Payload: API REST, autenticação e /admin
├── packages/
│   └── shared/              ← tipos e esquemas Zod usados pelas duas apps
├── .github/workflows/       ← CI (GitHub Actions)
├── docker-compose.yml       ← PostgreSQL + PostGIS para desenvolvimento local
├── AGENTS.md                ← regras de trabalho (Git, segredos, fronteiras, testes)
└── (configuração na raiz: package.json, Prettier, tsconfig)
```

Cada app tem o seu `AGENTS.md` com as regras específicas.

## Porque está organizado assim

**Monorepo (npm workspaces).** A app e a API vivem no mesmo repositório para que:

- os tipos e as validações que as duas partilham fiquem sempre alinhados (`packages/shared`);
- uma alteração que mexe na app e na API seja um só PR, com um só CI;
- haja um único sítio para versões, formatação e regras.

**`apps/mobile` e `apps/web` são independentes.** A app nunca importa código da API. Só falam por HTTP (REST/JSON) e através do `packages/shared`:

```
 apps/mobile (PWA) ──HTTP REST──▶ apps/web (Next.js + Payload) ──SQL──▶ PostgreSQL + PostGIS
        │                                   │
        └──── @findfix/shared ◀─────────────┘   (tipos e esquemas Zod)
```

**`packages/shared` é pequeno de propósito.** Só entra aqui o que é usado pelos dois lados, e não pode depender de Expo, Next.js nem Payload. Os esquemas Zod validam o que vem de fora (por exemplo a resposta da IA): o TypeScript só garante tipos em tempo de compilação, e o Zod verifica os dados reais em execução.

**Payload como backend.** A API REST, a autenticação e o backoffice (`/admin`) vêm do Payload, dentro do Next.js. Evita escrever tudo de raiz e dá-nos o controlo de acesso por coleção.

## Autenticação

Há três coleções de autenticação separadas, porque têm campos e permissões muito diferentes:

| Coleção         | Quem            | Onde entra                         |
| --------------- | --------------- | ---------------------------------- |
| `equipa`        | Suporte e admin | `/admin` (backoffice web)          |
| `clientes`      | Clientes        | Só pela app, via API com token JWT |
| `profissionais` | Profissionais   | Só pela app, via API com token JWT |

O token JWT vai no cabeçalho `Authorization: JWT <token>` (não `Bearer`). As permissões são aplicadas no servidor (`access` do Payload); a app nunca é uma garantia de segurança.

## Arrancar

Requisitos: Node 24+ e Docker (para a base de dados).

```bash
npm install
cp apps/web/.env.example apps/web/.env   # e define o PAYLOAD_SECRET
npm run db:up                            # Postgres + PostGIS em localhost:5432
npm run dev -w apps/web                  # API + /admin em http://localhost:3000
npm run web                              # app no browser (PWA)
npm run mobile                           # Expo (QR code para Expo Go)
```

Em desenvolvimento o Payload cria as tabelas sozinho. Na primeira vez, cria o teu utilizador da equipa em <http://localhost:3000/admin>.

## Trabalhar com o modelo de dados (Payload)

As coleções ficam em `apps/web/src/collections/` e as regras de acesso em `apps/web/src/access.ts`.

Depois de alterar coleções:

```bash
cd apps/web
npm run generate:types                   # atualiza src/payload-types.ts
npm run payload migrate:create <nome>    # gera a migração para produção
```

Commitar os tipos e a migração gerada. **Em produção (Neon) nunca se usa o `push` do esquema: só migrações.**

### Aplicar migrações no Neon

A API não aplica as migrações sozinha ao arrancar. Aplicam-se à mão, uma vez por migração nova:

1. Cria o ficheiro `apps/web/.env.neon` com uma linha `DATABASE_URL=...`, com a ligação **direta** (sem pooler) copiada do painel do Neon. O ficheiro está ignorado pelo Git: nunca o commites nem partilhes a ligação.
2. Corre, a partir de `apps/web` (testado em Git Bash):

```bash
NODE_ENV=production NODE_OPTIONS=--no-deprecation node --no-warnings --env-file=.env.neon ../../node_modules/payload/bin.js migrate
```

Usa-se o `node` diretamente porque o `npx payload` não aceita o `--env-file` dentro do `NODE_OPTIONS`. O `NODE_ENV=production` desliga o `push` do esquema. Se a migração já estiver aplicada, não repete nada.

## Qualidade

```bash
npm run lint
npm run typecheck
npm run format:check     # (npm run format para corrigir)
```

O CI (GitHub Actions) corre formatação, lint, typecheck e as builds da app e da API a cada PR e push para `main`.

## Deploy

Tudo em planos gratuitos:

- **Neon:** PostgreSQL + PostGIS, região UE. Adormece sem pedidos e demora a acordar.
- **Dois projetos Vercel (plano Hobby) a partir deste repositório**, cada um com a sua pasta raiz:
  - `apps/mobile` → a PWA (build estática): <https://find-fix-mobile.vercel.app>
  - `apps/web` → a API e o `/admin` (funções serverless): <https://find-fix-website.vercel.app> (backoffice em <https://find-fix-website.vercel.app/admin>)
- **Porquê dois projetos e não um:** cada app tem o seu deploy e as suas pré-visualizações por PR, e uma não parte a outra. O preço é que a PWA e a API ficam em domínios diferentes, por isso a API só aceita chamadas das origens listadas na variável `CORS_ORIGINS`.
- Cada merge na `main` publica em produção. Cada app tem o seu `vercel.json` (instalação a partir da raiz do monorepo e comandos de build).

Variáveis de ambiente do servidor (`apps/web`): `DATABASE_URL`, `PAYLOAD_SECRET` e `CORS_ORIGINS`. Nunca vão para o repositório (só o `.env.example`). Na Vercel as variáveis só se aplicam a deploys novos: depois de as alterar, fazer Redeploy.

O `CORS_ORIGINS` também alimenta a proteção CSRF do Payload, que só aceita o cookie de sessão se a origem do pedido estiver na lista. Por isso tem de incluir **o URL da própria API** (para o `/admin` poder guardar e apagar), o da PWA e, se for preciso, o de desenvolvimento, sem espaços nem barra final:

```
CORS_ORIGINS=https://find-fix-website.vercel.app,https://find-fix-mobile.vercel.app,http://localhost:8081
```

## Design

O design de referência são os mockups do Figma. **Os ecrãs atuais ainda não são coerentes com os mockups: são apenas páginas demonstrativas**, até à transposição dos mockups. Os tokens de estilo estão em `apps/mobile/src/global.css`.

## Fluxo de trabalho

1. Cria um ramo a partir da `main` (`feat/...`, `fix/...`).
2. Commits pequenos, no formato Conventional Commits (tipo em inglês, descrição em português): `feat(web): adicionar coleção de pedidos`.
3. Abre um PR com o CI verde e os testes manuais feitos.
4. O merge na `main` publica em produção.

Não se mexe diretamente na `main`.
