# Find&Fix

App (PWA) que torna reparações e remodelações de interiores mais acessíveis e transparentes: diagnóstico por IA e ligação a profissionais. Projeto de grupo de CVPBT (LIGE, ISCTE).

## Estrutura (monorepo, npm workspaces)

| Pasta              | Conteúdo                                              |
| ------------------ | ----------------------------------------------------- |
| `apps/mobile`      | App Expo (React Native, Expo Router, NativeWind)      |
| `packages/shared`  | Tipos e código partilhado (`@findfix/shared`)         |
| `docker-compose.yml` | PostgreSQL + PostGIS para desenvolvimento local     |

O backend (Next.js + Payload) entrará em `apps/web`.

## Arrancar

Requisitos: Node 24+, Docker (para a base de dados).

```bash
npm install
cp .env.example .env
npm run db:up        # Postgres + PostGIS em localhost:5432
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

Paleta Tech Trust, modo escuro: Azul noite `#1B2A4A`, Âmbar `#F5A623`, Neblina `#F4F6F9`, Ardósia `#64748B`. Tokens em `apps/mobile/src/global.css` (`bg-night`, `text-amber`, `text-mist`, …).

## Fluxo de trabalho

Branches curtas a partir de `main`, PR com CI verde, merge → deploy.
