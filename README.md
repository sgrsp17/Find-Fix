# Find&Fix

App (PWA) que torna reparações e remodelações de interiores mais acessíveis e transparentes: diagnóstico por IA e ligação a profissionais. Projeto de grupo de CVPBT (LIGE, ISCTE).

## Estrutura (monorepo, npm workspaces)

| Pasta                | Conteúdo                                              |
| -------------------- | ----------------------------------------------------- |
| `apps/mobile`        | App Expo (React Native, Expo Router, NativeWind)      |
| `packages/shared`    | Tipos e código partilhado (`@findfix/shared`)         |
| `apps/web`           | Next.js + Payload (API REST, autenticação e `/admin`) |
| `docker-compose.yml` | PostgreSQL + PostGIS para desenvolvimento local       |

## Arrancar

Requisitos: Node 24+, Docker (para a base de dados).

```bash
npm install
cp .env.example .env
cp apps/web/.env.example apps/web/.env   # e define o PAYLOAD_SECRET
npm run db:up        # Postgres + PostGIS em localhost:5432
npm run dev -w apps/web   # API + /admin em http://localhost:3000
npm run web          # app no browser (PWA)
npm run mobile       # Expo (QR code para Expo Go)
```

## Qualidade

```bash
npm run lint
npm run typecheck
npm run format       # Prettier
```

O CI (GitHub Actions) corre formatação, lint, typecheck e build web a cada PR e push para `main`.

## Deploy

Vercel (plano Hobby) liga-se ao repositório: cada merge em `main` faz deploy da build web (`vercel.json`). Base de dados da demo: Neon (Postgres + PostGIS, UE).

## Design

O design de referência são os mockups do Figma. **Os ecrãs atuais ainda não são coerentes com os mockups: são apenas páginas demonstrativas**, até à transposição dos mockups. Os tokens de estilo estão em `apps/mobile/src/global.css`.

## Fluxo de trabalho

Branches curtas a partir de `main`, PR com CI verde, merge → deploy.
