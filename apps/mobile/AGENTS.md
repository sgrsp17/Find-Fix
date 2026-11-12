# apps/mobile — Instruções para agentes

App Expo/React Native, exportada para web e distribuída como **PWA** (sem lojas). Complementa o `AGENTS.md` da raiz. Dar prioridade a padrões mobile-first, desempenho e compatibilidade com a web.

## O Expo muda: não confiar na memória

O Expo traz alterações incompatíveis a cada SDK. Antes de escrever código que toque em Expo, EAS ou React Native:

1. Ler a versão major do pacote `expo` no `package.json`.
2. Consultar a documentação dessa versão: `https://docs.expo.dev/versions/v<major>.0.0/`.
3. Para o resto, consultar https://docs.expo.dev/llms.txt e seguir as ligações para a página certa. Nunca responder de memória.

## Comandos

```bash
npx expo install <pacote>   # SEMPRE em vez de npm install: resolve versões compatíveis com o SDK
npm run web                 # app no browser (PWA), a partir da raiz do repositório
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnóstico de dependências e configuração
npx expo install --fix      # corrige versões incompatíveis
npm run build:web           # export estático para a Vercel
```

## Navegação

- Usar **Expo Router**. As rotas vivem em `src/app/`: cada ficheiro é um ecrã e os `_layout.tsx` definem os navegadores. O código que não é rota (componentes, hooks, utilitários) fica fora de `src/app/`.
- Importar `Link`, `router` e `useLocalSearchParams` de `expo-router`.

## Interface e estilos (NativeWind v5)

- O design (UX/UI, cores, temas, espaçamentos) está definido nos mockups do Figma. A implementação segue o Figma e não decide o aspeto por conta própria. Em caso de dúvida ou omissão no Figma, perguntar.
- Os tokens de design (cores, etc.) ficam em `src/global.css` e espelham o Figma. Não usar valores fixos no JSX: se faltar um token, criá-lo aí.
- `global.css` importa-se uma única vez, em `src/app/_layout.tsx`.
- Acessibilidade: nomes acessíveis nos botões de ícone, contraste adequado e foco visível.

## PWA e módulos nativos

- A app corre na web, por isso **antes de adicionar uma biblioteca confirmar que funciona em PWA**. Exemplos já avaliados: `react-native-maps` não funciona (usar MapLibre ou Leaflet) e `expo-notifications` não envia notificações para a web (usar Web Push).
- Não existem as pastas `ios/` e `android/` (são geradas pelo Expo). Nunca as criar nem editar à mão: configurar em `app.json` e com config plugins.
- Não usar `eas submit` nem publicar nas lojas.
- Preferir módulos recomendados do Expo a bibliotecas de terceiros.

### Nota para implementação futura: ecrã de instalação da PWA

Quem abre a app pelo link, no navegador, deve ver um ecrã que explica como adicioná-la ao ecrã principal e começar a usá-la como PWA. Este ecrã segue o UX do resto da app (Figma), mas o conteúdo são as instruções de instalação (diferentes em iOS e Android). Só deve aparecer quando a app **não** está a correr como PWA instalada; dentro da PWA instalada abre-se diretamente a app. Isto também importa para as notificações push: no iPhone só funcionam com a app instalada. Ainda não está implementado, e o desenho depende do Figma. Antes de implementar, confirmar como detetar o modo PWA (por exemplo `display-mode: standalone` e, no iOS, `navigator.standalone`) na versão do Expo em uso.

## API

- A app comunica com `apps/web` por HTTP. O token JWT vai no cabeçalho `Authorization: JWT <token>` (não `Bearer`).
- Validar com os esquemas de `@findfix/shared` o que é enviado e o que é recebido. A app nunca importa de `apps/web`.
- Os textos visíveis são em PT-PT.
