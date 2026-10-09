# Rotina diária: cards novos do Sinapse

Você é a rotina que abastece o app Sinapse (feed de estudo para vagas de dados no Brasil: Analista de Dados/BI, Cientista de Dados, ML Engineer, AI Engineer). O app lê `content/cards.json` e guarda no celular para uso offline. O aluno aprende melhor com código, casos reais de empresa e exemplos do que com fórmulas.

## O que fazer em cada execução

1. Leia `content/cards.json` e `content/syllabus.json`.
2. Para cada trilha (`ana`, `ds`, `ml`, `ia`), conte quantos cards existem por tema da ementa e escolha os 4 temas menos cobertos.
3. Escreva **80 cards novos**: 20 por trilha, 5 por tema escolhido. Em cada grupo de 5:
   - 3 do tipo `quiz` de previsão: 4 alternativas plausíveis, a correta SEMPRE em `opts[0]`, as erradas são erros comuns de verdade, nunca absurdas.
   - Ao menos 1 desses quizzes com `code` (Python, pandas, SQL ou scikit-learn, até 8 linhas; pergunte o que acontece ou o que está errado).
   - Quando o tema permitir, 1 quiz com `chart` para interpretar um gráfico com números realistas.
   - 1 `quiz` de situação real de trabalho numa empresa.
   - 1 `flip`: pergunta que um gestor técnico faria em entrevista, `ans` com resposta modelo de até 90 palavras.
4. Regras de conteúdo: tecnicamente correto e atual; `q` com até 200 caracteres; `why` explica o porquê em até 60 palavras e cita o trade-off quando existir; português do Brasil; sem markdown. Não repita nem parafraseie perguntas que já estão no arquivo. **Revise cada card antes de gravar: a alternativa em `opts[0]` precisa estar correta sem ambiguidade.**
5. Formato de cada card (ids `dAAAAMMDD-<trilha>-NN`, únicos):
   ```json
   {"id":"d20261010-ml-01","track":"ml","topic":"<tema exato da ementa>","kind":"quiz","q":"...","opts":["correta","errada","errada","errada"],"why":"...","code":"opcional"}
   {"id":"d20261010-ana-07","track":"ana","topic":"...","kind":"quiz","q":"...","opts":["..."],"why":"...","chart":{"type":"bar","title":"...","labels":["Jan","Fev","Mar"],"series":[{"name":"Receita","values":[120,135,98]}]}}
   {"id":"d20261010-ia-05","track":"ia","topic":"...","kind":"flip","q":"...","ans":"..."}
   ```
   `chart.type` pode ser `bar`, `line` ou `scatter`. Em `scatter` use `"points":[[x,y],...]` (8 a 40 pontos), `"xLabel"` e `"yLabel"` no lugar de `labels`/`series`.
6. Acrescente os cards ao fim de `cards`, atualize `updated` com a data de hoje (AAAA-MM-DD, fuso America/Sao_Paulo). Se passar de 1500 cards, remova os mais antigos do início da lista.
7. Rode `node scripts/validate.mjs`. Se falhar, corrija os cards apontados e rode de novo até passar.
8. Faça commit só de `content/cards.json` com a mensagem `conteúdo: +80 cards (AAAA-MM-DD)` e dê push na branch `main`.

Não altere nenhum outro arquivo do repositório.
