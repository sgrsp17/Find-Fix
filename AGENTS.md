# Find&Fix — Instruções para agentes

Estas regras aplicam-se a todo o repositório e a qualquer agente de IA que nele trabalhe. As instruções explícitas do utilizador prevalecem sobre este ficheiro. Cada app tem um `AGENTS.md` próprio com as regras específicas (`apps/mobile`, `apps/web`). Antes de intervir, consultar o `README.md`.

## 1. Contexto

- Monorepo (npm workspaces): `apps/mobile` (Expo, PWA), `apps/web` (Next.js + Payload: API REST, autenticação e `/admin`) e `packages/shared` (tipos e esquemas Zod usados pelos dois lados).
- Base de dados PostgreSQL + PostGIS: Docker em local (`npm run db:up`), Neon online. Cada merge na `main` faz deploy automático na Vercel.
- Projeto académico, protótipo de cerca de 30% do MVP, a custo 0 €: só serviços gratuitos, Stripe **sempre em modo de teste** (nunca pagamentos reais) e PWA sem publicação nas lojas.
- Fora do âmbito do protótipo: remodelação por imagem, avaliação mútua, chat em tempo real e pagamentos reais.
- Os textos visíveis ao utilizador são em português (PT-PT).
- Os documentos do projeto (relatório, sprints, diagramas) vivem fora deste repositório. Não os copiar para cá.

## 2. Git e GitHub

- Nunca fazer referência a IA, ao Claude, à Anthropic, à OpenAI ou a outro agente em commits, títulos ou descrições de PR. Sem linhas automáticas como `Co-Authored-By` ou `Generated with ...`.
- **Conventional Commits**, com o tipo em inglês e a descrição em português, scope opcional: `feat(web): adicionar coleção de pedidos`.
  Tipos: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`, `perf`, `build`, `ci`.
- Um commit = uma alteração lógica. Não misturar funcionalidades, correções e formatação.
- **Nunca fazer commit, push, merge nem criar PR sem autorização explícita do utilizador**, mesmo em modo automático. A aprovação é dada commit a commit.
- Antes de abrir um PR, aguardar a confirmação do utilizador de que os testes manuais foram concluídos com sucesso.
- Não alterar a `main` diretamente: desenvolver em ramos próprios (`feat/...`, `fix/...`). Como o merge publica em produção, só se faz merge com o CI verde.
- Nunca fazer `push --force` nem reescrever histórico já partilhado sem autorização.
- Antes de cada commit, verificar os ficheiros preparados para detetar credenciais (incluindo `.env`). Se existirem, removê-las sem as reproduzir em mensagens ou logs.

## 3. Segredos, dados pessoais e serviços externos

- Nunca incluir passwords, tokens, chaves ou credenciais no código, nem em comentários ou valores por omissão.
- Os `.env` não são versionados. Só o `.env.example`, com valores fictícios.
- As variáveis `EXPO_PUBLIC_*` entram no bundle da app e são **públicas**. Segredos (`PAYLOAD_SECRET`, `DATABASE_URL`, chaves do Stripe, do Gemini ou de SMTP) existem apenas no servidor (`apps/web`).
- As fotografias e os dados dos utilizadores são dados pessoais (RGPD). Nos testes com IA, usar fotografias sem pessoas nem dados pessoais.
- Não executar operações externas sem autorização: escritas no Neon ou em produção, envio de emails, chamadas à IA com custo ou quota, criação de dados de teste em serviços partilhados. A base de dados local (Docker) pode ser usada à vontade.
- Não executar deploys sem autorização. Fazer merge, aplicar migrações ou alterar a Vercel e o Neon são passos com publicação própria.

## 4. Qualidade do código

- Código simples, legível e fácil de manter. Respeitar a estrutura e as convenções existentes.
- Antes de escrever código novo, procurar o que já existe para reutilizar. Evitar duplicação, mas sem criar abstrações, ficheiros ou funções desnecessários.
- Nomes descritivos. Funções curtas, com uma responsabilidade clara.
- TypeScript estrito: evitar `any` e asserções de não nulidade (`!`) para esconder valores que podem faltar. Tratar `null`, `undefined` e erros.
- Comentários em português, só quando explicam o porquê (regras de negócio, validações, decisões não óbvias). Sem comentários que repetem o código. Mantê-los atualizados.
- Não adicionar dependências sem justificação e aprovação do utilizador.
- Não alterar o que não foi pedido. Alterações pequenas, objetivas e fáceis de rever.

## 5. Monorepo e fronteiras entre módulos

- `apps/mobile` **nunca importa de `apps/web`**. Só comunicam por HTTP (API REST) e através de `@findfix/shared`.
- `packages/shared` só contém o que é usado pelos dois lados e não depende de Expo, Next.js nem Payload (é importado por ambos).
- Os dados que vêm de fora (resposta da IA, corpo de pedidos, JSON de APIs) validam-se com Zod, usando os esquemas de `@findfix/shared`, antes de serem usados. Os tipos inferem-se dos esquemas, não se duplicam.
- Uma só versão do React no monorepo (hoje 19.3.0, a que o React Native exige). Ao atualizar, manter as duas apps alinhadas.
- Instalar dependências com `npm install <pacote> -w <workspace>`. Na app mobile usar `npx expo install <pacote>`.

## 6. Testes e validação

- Antes de dar uma tarefa por concluída, executar o que se aplica: `npm run lint`, `npm run typecheck`, `npm run format:check` e as builds (`npm run build:web -w apps/mobile`, `npm run build -w apps/web`). O CI repete estas verificações em cada PR.
- Se for alterada uma coleção do Payload, correr `npm run generate:types -w apps/web` e incluir o resultado.
- Tratar e testar os estados de carregamento, erro e ausência de dados, e evitar submissões duplicadas.
- Distinguir falhas anteriores de regressões introduzidas pela tarefa e reportar o que não foi possível validar.
- **Nunca afirmar que algo foi testado sem o ter testado.** Informar o utilizador das alterações e dos testes executados.

## 7. Comportamento do agente

- Antes de modificar código, compreender o pedido e ler os ficheiros relevantes. Em caso de dúvida que possa levar a alterações significativas, perguntar primeiro.
- Explicar resumidamente as decisões relevantes, sobretudo quando há alternativas.
- Quando detetar duplicação, problemas de organização ou melhorias, informar e propor, sem as implementar por iniciativa própria.
- Não implementar funcionalidades que não foram pedidas. Preservar o comportamento existente, salvo quando a tarefa o exigir.
- Atualizar o `README.md` quando a tarefa alterar contratos, arquitetura ou o modo de arrancar o projeto.

## 8. Princípio geral

Uma aplicação simples, organizada e sustentável, com código que qualquer elemento do grupo consiga compreender e manter. Em caso de conflito, privilegiar por esta ordem: clareza, reutilização do que já existe, simplicidade e validação antes de integrar.
