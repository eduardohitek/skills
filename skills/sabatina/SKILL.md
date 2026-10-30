---
name: sabatina
description: >
  Entrevista exaustiva sobre um plano até o entendimento mútuo. Use ao criar um plano de
  implementação, quando surgir durante a execução uma dúvida que muda o resultado (modelo de
  dados, comportamento visível, segurança), ou quando o usuário pedir uma sabatina.
---

# Sabatina

Entreviste o usuário até chegarem a um entendimento compartilhado, sem deixar nenhuma decisão
relevante para trás. Mapeie o plano como uma **árvore de decisões**: cada decisão abre as decisões
que dependem dela.

## Fatos, defaults e decisões

Cada nó da árvore cai em uma de três categorias:

- **Fatos** são trabalho seu. Quando uma pergunta depende de algo que está no ambiente (código,
  configuração, documentação de bibliotecas e serviços, `node_modules`, CLIs, MCPs), descubra você
  mesmo e mostre o que encontrou. Confirme cada premissa externa (o que um serviço suporta, limites,
  credenciais necessárias) na documentação antes de transformá-la em opção.
- **Defaults** são escolhas com um padrão convencional ou já estabelecido no projeto (nomes,
  estrutura de pastas, a biblioteca que o projeto já usa). Não pergunte: escolha e declare no resumo
  final, onde o usuário pode vetar.
- **Decisões** são do usuário: o que só ele sabe ou o que muda o resultado (escopo, modelo de dados,
  comportamento visível, segurança, custo). Apresente cada uma e espere a resposta.

Na dúvida entre default e decisão, trate como decisão.

Faça as buscas de fatos você mesmo, em paralelo. Use um subagente só para varreduras amplas, e siga
sem bloquear: só as perguntas que dependem daquela busca esperam o resultado.

## Passos

1. **Ler o contexto.** Leia o plano, a issue/spec, o roadmap e o código relevante. Esboce os ramos
   da árvore: arquitetura, modelo de dados, dependências, sequenciamento, integrações, riscos e
   casos de borda.

2. **Dimensionar.** Se a fronteira inicial tiver até duas decisões, faça uma única rodada (ou, se não
   houver nenhuma, apenas apresente os defaults) e vá direto ao encerramento.

3. **Perguntar em rodadas.** A **fronteira** é o conjunto de decisões cujos pré-requisitos já
   estão decididos: o que dá para perguntar _agora_ sem chutar respostas que você ainda não ouviu.
   Pergunte a fronteira inteira em uma rodada e espere as respostas. Uma pergunta que depende de
   outra ainda aberta na mesma rodada fica para a rodada seguinte. Decida primeiro a abordagem
   arquitetural e só depois os detalhes que dependem dela.

4. **Recalcular a fronteira.** Cada resposta empurra a fronteira para fora e libera perguntas que
   dependiam dela. Atualize a árvore e faça a próxima rodada. Se uma resposta contradiz uma decisão
   anterior, reabra os ramos que dependiam dela e avise o usuário. Se o usuário delegar ("decide
   você"), adote sua recomendação e marque-a como delegada. Mantenha o resumo das decisões para
   você; entre rodadas, no máximo uma linha de progresso.

5. **Encerrar** quando a fronteira estiver vazia: todos os ramos foram decididos, delegados ou
   adiados de propósito, e nada ficou assumido em silêncio. Apresente o resumo em lista, separando
   decisões, defaults declarados e itens adiados, e **espere a confirmação do usuário** antes de
   agir. As decisões vão para o plano; só convenções duradouras do projeto vão para o `CLAUDE.md`.
   Em plan mode, a aprovação do plano (`ExitPlanMode`) vale como essa confirmação: não pergunte
   separadamente se o plano está pronto.

## Durante a execução

Quando a sabatina é aberta por uma dúvida no meio da execução de um plano já aprovado, não reabra a
árvore inteira. Entreviste só o ramo da dúvida e os que dependem dele, registre a decisão no plano e
continue a execução.

## Formato das perguntas

Use a ferramenta de perguntas estruturadas do harness (`AskUserQuestion` no Claude Code). Se não
houver uma, faça perguntas numeradas em texto, cada uma com as opções e a recomendada marcada.

Para cada pergunta:

- `header`: o tópico, curto (ex: "Throttle", "Escopo").
- `question`: a pergunta objetiva e autossuficiente. O usuário pode ver só o diálogo, então inclua
  nela o fato que você descobriu e por que a decisão importa (ex: "O projeto já usa Zod em `src/`;
  validar o payload com ele ou…?").
- `options`: de 2 a 4, com sua recomendação como primeira opção, `(Recomendado)` no final do
  `label` e a justificativa na `description`. Não crie uma opção "Outro": ela já é oferecida
  automaticamente.
- Use `multiSelect` quando as opções não forem exclusivas, e `preview` quando o usuário precisar
  comparar trechos de código, layouts ou configurações.

Coloque as perguntas da mesma rodada na mesma chamada, uma entrada em `questions` por pergunta. O
limite é 4 por chamada; se a fronteira tiver mais, use chamadas seguidas na mesma rodada. Na dúvida
sobre se duas perguntas são independentes, trate-as como dependentes e deixe a segunda para a
próxima rodada.
