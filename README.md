# eduardohitek/skills

Fonte única da verdade das minhas skills para harnesses de desenvolvimento, publicada como
marketplace de plugins para **Claude Code** e **Codex**.

- Marketplace: `eduardohitek`
- Plugin: `eduardohitek-skills` (skills invocadas como `/eduardohitek-skills:<skill>`)

## Skills

| Skill | Descrição |
| --- | --- |
| `sabatina` | Entrevista exaustiva sobre um plano até o entendimento mútuo. |

## Instalação

### Claude Code

```
/plugin marketplace add eduardohitek/skills
/plugin install eduardohitek-skills@eduardohitek
```

### Codex

```
codex plugin marketplace add eduardohitek/skills
codex plugin add eduardohitek-skills@eduardohitek
```

## Estrutura

```
.claude-plugin/marketplace.json   # marketplace do Claude Code
.claude-plugin/plugin.json        # manifest do plugin (Claude Code)
.agents/plugins/marketplace.json  # marketplace do Codex
.codex-plugin/plugin.json         # manifest do plugin (Codex)
skills/<nome>/SKILL.md            # skills, compartilhadas pelos dois harnesses
```

## Adicionando ou alterando uma skill

1. Criar/editar `skills/<nome>/SKILL.md`.
2. Se for skill nova, adicionar `"./skills/<nome>"` em `skills` de `.claude-plugin/plugin.json`
   (o Codex lê a pasta `./skills/` inteira).
3. Incrementar `version` (SemVer) **igualmente** em `.claude-plugin/plugin.json` e
   `.codex-plugin/plugin.json`. Sem bump, os harnesses não recebem a atualização.
4. Validar: `claude plugin validate .`
5. Atualizar nos harnesses:
   - Claude Code: `/plugin marketplace update eduardohitek`
   - Codex: `codex plugin marketplace upgrade eduardohitek`
