# Rotina diária: cards novos do Sinapse

Você é a rotina que abastece o app Sinapse, um feed de estudo para vagas de dados no Brasil (Analista de Dados/BI, Cientista de Dados, ML Engineer, AI Engineer). O app lê `content/cards.json` e guarda no celular para uso offline.

**Objetivo do conteúdo:** que tudo vire óbvio pela repetição em situações reais. O aluno aprende melhor com código, casos de empresa e números do que com fórmulas, e quer render bem em reunião, no trabalho e na entrevista com o gestor técnico. Todo card parte de uma cena concreta (varejo, banco, fintech, telecom, saúde, e-commerce, SaaS de suporte), com números realistas, e termina numa frase que ele pode dizer literalmente.

## O que fazer em cada execução

1. Leia `content/cards.json` e `content/syllabus.json`.
2. Para cada trilha (`ana`, `ds`, `ml`, `ia`), conte quantos cards existem por tema da ementa e escolha os 4 temas menos cobertos (empate: escolha temas variados, não só os primeiros da lista).
3. Escreva **80 cards novos**: 20 por trilha, 5 por tema escolhido. Em cada grupo de 5:
   1. `quiz` com `mode: "reuniao"` ou `"trabalho"`: `ctx` é a fala de uma pessoa real (diretora, PM, CFO, gestor no Slack, engenheiro de dados). As alternativas são respostas possíveis. A certa responde com número, trade-off e próximo passo em linguagem de negócio; as erradas são respostas típicas de júnior (concordar sem checar, jargão sem tradução, "não dá", "vou investigar").
   2. `chain` com `mode: "entrevista"`: um gestor técnico pergunta e aprofunda em 3 rodadas (`steps`), cada uma com 4 alternativas, como numa entrevista de verdade.
   3. `quiz` com `mode: "codigo"`: `code` com até 8 linhas de Python, pandas, SQL ou scikit-learn, com um bug ou efeito surpreendente que acontece no trabalho real.
   4. `quiz` com `mode: "bolso"`: um número ou regra de bolso que um sênior sabe de cabeça (ordem de grandeza, conta rápida, régua de interpretação), com a conta no `why`. Se fizer sentido, inclua `chart` com dados realistas.
   5. `flip` com `mode: "entrevista"`: pergunta aberta de gestor e `ans` com resposta modelo de até 90 palavras (contexto, decisão, trade-off, resultado).
4. Regras para todos: a correta SEMPRE em `opts[0]`; as erradas são erros reais e plausíveis, nunca absurdas; `q` até 200 caracteres; `why` explica o porquê em até 60 palavras; `pro` é UMA frase de até 160 caracteres que o aluno pode dizer literalmente; conteúdo tecnicamente correto e atual; português do Brasil; sem markdown. Não repita nem parafraseie perguntas que já estão no arquivo. **Revise cada card antes de gravar: a alternativa em `opts[0]` precisa estar correta sem ambiguidade, e toda conta no `why` precisa fechar.**
5. Formatos (ids `dAAAAMMDD-<trilha>-NN`, únicos; `topic` é o tema exato da ementa):
   ```json
   {"id":"d20261010-ml-01","track":"ml","topic":"...","kind":"quiz","mode":"reuniao","ctx":{"who":"Diretora comercial","say":"..."},"q":"Qual a melhor resposta?","opts":["certa","errada","errada","errada"],"why":"...","pro":"..."}
   {"id":"d20261010-ml-02","track":"ml","topic":"...","kind":"chain","mode":"entrevista","ctx":{"who":"Gestor de dados","say":"..."},"steps":[{"q":"...","opts":["certa","...","...","..."],"why":"..."},{"q":"...","opts":["..."],"why":"..."},{"q":"...","opts":["..."],"why":"..."}],"pro":"..."}
   {"id":"d20261010-ml-03","track":"ml","topic":"...","kind":"quiz","mode":"codigo","q":"...","code":"...","opts":["..."],"why":"...","pro":"..."}
   {"id":"d20261010-ml-04","track":"ml","topic":"...","kind":"quiz","mode":"bolso","q":"...","opts":["..."],"why":"...","pro":"...","chart":{"type":"bar","title":"...","labels":["Jan","Fev","Mar"],"series":[{"name":"Receita","values":[120,135,98]}]}}
   {"id":"d20261010-ml-05","track":"ml","topic":"...","kind":"flip","mode":"entrevista","q":"...","ans":"...","pro":"..."}
   ```
   `chart` é opcional; `type` pode ser `bar`, `line` ou `scatter` (em `scatter` use `"points":[[x,y],...]` com 8 a 40 pontos, `"xLabel"` e `"yLabel"`).
6. Acrescente os cards ao fim de `cards` e atualize `updated` com a data de hoje (AAAA-MM-DD, fuso America/Sao_Paulo). Se passar de 1500 cards, remova os mais antigos do início da lista.
7. Rode `node scripts/validate.mjs`. Se falhar, corrija os cards apontados e rode de novo até passar.
8. Faça commit só de `content/cards.json` com a mensagem `conteúdo: +80 cards (AAAA-MM-DD)` e dê push na branch `main` (se o remoto tiver avançado, `git pull --rebase` antes).

Não altere nenhum outro arquivo do repositório.
