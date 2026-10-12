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

1. Criar/editar `skills/<nome>/SKILL.md` em uma branch.
2. Se for skill nova, adicionar `"./skills/<nome>"` em `skills` de `.claude-plugin/plugin.json`
   (o Codex lê a pasta `./skills/` inteira).
3. Validar: `claude plugin validate .`
4. Abrir PR com título/commit no padrão [Conventional Commits](https://www.conventionalcommits.org/)
   e fazer merge na `main`.

**Não edite `version` à mão.**

## Releases

O versionamento é feito pelo [release-please](https://github.com/googleapis/release-please):

1. A cada push na `main`, a Action abre/atualiza um PR de release que incrementa `version` nos dois
   `plugin.json` (sincronizados) e atualiza o `CHANGELOG.md`.
2. O merge desse PR cria a tag `vX.Y.Z` e a GitHub Release.
3. Os harnesses detectam o novo `version` e atualizam o plugin.

Regras de bump (antes da 1.0): `feat:` → minor, `fix:` → patch, `feat!:` → minor.

Para atualizar nos harnesses:

- Claude Code: `/plugin marketplace update eduardohitek` (ou ativar auto-update em
  `/plugin` → Marketplaces → eduardohitek → Enable auto-update)
- Codex: `codex plugin marketplace upgrade eduardohitek`
