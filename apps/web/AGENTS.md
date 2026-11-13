# apps/web — Instruções para agentes

Next.js + Payload: API REST, autenticação e backoffice `/admin`. Complementa o `AGENTS.md` da raiz.

## Versões novas: não confiar na memória

Next.js e Payload mudam muito entre versões. Antes de escrever código, ler a documentação da versão instalada (ver `package.json`): para o Next.js em `node_modules/next/dist/docs/` (num monorepo o pacote está na `node_modules` da raiz do repositório) e para o Payload em https://payloadcms.com/docs. Atender aos avisos de depreciação.

## Autenticação e permissões

- Existem **três coleções de autenticação separadas**, e não se fundem: `equipa` (suporte e admin, entra no `/admin`), `clientes` e `profissionais` (entram só pela app, por JWT no cabeçalho `Authorization: JWT <token>`).
- As permissões são garantidas **no servidor**, pelo `access` do Payload (ver `src/access.ts`). A app não é uma garantia de segurança. Não confiar em perfis, IDs ou dados sensíveis enviados pelo cliente.
- Nunca alargar um `access` só para fazer uma consulta passar; acrescentar os filtros certos.
- A Local API do Payload ignora o `access` por omissão. Quando se passa um `user`, usar `overrideAccess: false`; usar o valor por omissão só com justificação clara.
- O `/admin` só aceita a coleção `equipa`. Com a base vazia, `first-register` está aberto: criar o primeiro admin logo no primeiro deploy.
- O CORS usa a variável `CORS_ORIGINS` (origens separadas por vírgulas). Nunca `*`.
- O `CORS_ORIGINS` também define o `csrf`: o Payload só aceita o cookie de sessão se o `Origin` do pedido estiver na lista. Tem de incluir **o URL da própria API**, senão o `/admin` abre mas não deixa guardar, apagar nem fazer logout ("You are not allowed to perform this action").

## Base de dados

- O `push` do schema só existe em desenvolvimento local (Docker). **Nunca contra o Neon nem em produção**: aí usam-se migrações (`npm run payload migrate:create` e `migrate`), revistas antes de aplicar.
- O PostGIS está declarado em `extensions` no adaptador. Não remover: sem isso o `push` tenta apagar as tabelas e vistas do PostGIS.
- Depois de alterar coleções, correr `npm run generate:types` (e `generate:importmap` se mudarem componentes do admin) e incluir o resultado.

## IA e integrações

- O módulo de IA fica isolado, com modo simulado de recurso, para ser possível trocar de fornecedor e testar sem gastar quota.
- Validar com Zod (`@findfix/shared`) a resposta do modelo antes de a usar.
- As funções na Vercel são serverless e têm limite de tempo: tarefas longas têm de ser assíncronas.
- O Neon adormece sem pedidos e demora a acordar. Ter isso em conta ao medir tempos de resposta.

## Configuração

- O `agentRules` está desligado em `next.config.ts`, para o `next dev` não reescrever este ficheiro. Não o voltar a ligar.
- Os textos visíveis (admin, emails) são em PT-PT.
