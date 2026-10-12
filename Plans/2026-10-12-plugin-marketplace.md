# Plan: Marketplace de skills para Claude Code e Codex

**Date:** 2026-10-12
**Status:** Approved

---

## Objective

Transformar este repo (`eduardohitek/skills`, público) em um marketplace de plugins consumido pelo
Claude Code e pelo Codex, como fonte única da verdade das skills. Plugin único `eduardohitek-skills`
no marketplace `eduardohitek`; primeira leva apenas `sabatina` (versão do Claude como canônica).

---

## Implementation Steps

1. Commit vazio `chore: init` na `main` + push; criar branch `feat/plugin-marketplace`.
2. Criar `.claude-plugin/{marketplace,plugin}.json`, `.agents/plugins/marketplace.json`,
   `.codex-plugin/plugin.json`, `skills/sabatina/SKILL.md` e `README.md`.
3. Validar JSON (`jq`) e `claude plugin validate .`.
4. Commit, push e PR.
5. Após merge, instalar nos dois harnesses e validar `/eduardohitek-skills:sabatina`.
6. Remover cópias locais da `sabatina` e atualizar `~/.claude/CLAUDE.md`.

---

## Expected Outcomes

- Skills versionadas em um só lugar, instaláveis via `marketplace add eduardohitek/skills` nos dois harnesses.
- Fim do drift entre `~/.claude/skills` e `~/.codex/skills`.

---

## Risks & Considerations

- Versão (SemVer) precisa ser incrementada manualmente e igual nos dois `plugin.json`, senão updates não chegam.
- Namespace muda a invocação para `/eduardohitek-skills:sabatina`; referências em CLAUDE.md precisam ser atualizadas.
- Remover cópias locais só depois de validar o carregamento do plugin.
