# Sinapse

Feed de estudo no formato de vídeo curto para Análise de Dados, Ciência de Dados, Machine Learning e IA: simulações interativas, quizzes de previsão, combos de XP e revisão espaçada dos erros.

- **App (abre offline):** https://isantodev.github.io/sinapse/ — no celular, use "Adicionar à tela inicial".
- **Conteúdo:** `content/cards.json`, abastecido todo dia pela rotina descrita em `ROUTINE.md`.
- **Fonte única:** `sinapse.html`. `node scripts/build.mjs` gera `index.html` e `sw.js`; `node scripts/validate.mjs` confere os cards.
