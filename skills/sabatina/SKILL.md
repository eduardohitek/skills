---
name: sabatina
description: >
  Entrevista exaustiva sobre um plano até o entendimento mútuo. Use ao criar um plano de
  implementação, quando surgir durante a execução uma dúvida que muda o resultado (modelo de
  dados, comportamento visível, segurança), ou quando o usuário pedir uma sabatina.
---

# Sabatina

Entreviste o usuário incansavelmente até chegarem a um entendimento compartilhado. Mapeie o plano
como uma **árvore de decisões**: cada decisão abre as decisões que dependem dela.

## Passos

1. **Ler o contexto.** Leia o plano, a issue/spec, o roadmap e o código relevante. Esboce os ramos
   da árvore: arquitetura, modelo de dados, dependências, sequenciamento, integrações, riscos e
   casos de borda.

2. **Perguntar em rodadas.** A **fronteira** é o conjunto de decisões cujos pré-requisitos já
   estão decididos: o que dá para perguntar _agora_ sem chutar respostas que você ainda não ouviu.
   Pergunte a fronteira inteira em uma rodada e espere as respostas. Uma pergunta que depende de
   outra ainda aberta na mesma rodada fica para a rodada seguinte. Decida primeiro a abordagem
   arquitetural e só depois os detalhes que dependem dela.

3. **Recalcular a fronteira.** Cada resposta empurra a fronteira para fora e libera perguntas que
   dependiam dela. Atualize a árvore e faça a próxima rodada. Mantenha um resumo das decisões
   tomadas.

4. **Encerrar** quando a fronteira estiver vazia: todos os ramos foram decididos ou adiados de
   propósito, e nada ficou assumido em silêncio. Apresente o resumo das decisões como lista, pronto
   para entrar no plano ou no `CLAUDE.md`, e **espere a confirmação do usuário** de que o
   entendimento é compartilhado antes de agir.

## Fatos e decisões

Descobrir **fatos** é trabalho seu. Quando uma pergunta depende de algo que está no ambiente
(código, configuração, documentação de bibliotecas e serviços, `node_modules`, CLIs, MCPs), descubra
você mesmo e mostre o que encontrou. Pergunte ao usuário apenas o que só ele sabe. Confirme cada
premissa externa (o que um serviço suporta, limites, credenciais necessárias) na documentação antes
de transformá-la em opção.

Para buscas demoradas, use um subagente e siga sem bloquear: só as perguntas que dependem daquela
busca esperam o resultado, e o resto da fronteira é perguntado agora.

As **decisões** são do usuário: apresente cada uma e espere a resposta.

## Formato das perguntas

Use a ferramenta `AskUserQuestion`. Para cada pergunta:

- `header`: o tópico, curto (ex: "Throttle", "Escopo").
- `question`: a pergunta objetiva, com o contexto breve de por que a decisão importa.
- `options`: sua recomendação como primeira opção, com `(Recomendado)` no final do `label` e a
  justificativa na `description`.

Coloque as perguntas da mesma rodada na mesma chamada, uma entrada em `questions` por pergunta,
cada uma com sua recomendação. O limite é 4 por chamada; se a fronteira tiver mais, use chamadas
seguidas na mesma rodada. Na dúvida sobre se duas perguntas são independentes, trate-as como
dependentes e deixe a segunda para a próxima rodada.
