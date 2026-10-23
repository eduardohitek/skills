# eduardohitek/skills

Fonte única da verdade das minhas skills para harnesses de desenvolvimento, publicada como
marketplace de plugins para **Claude Code** e **Codex** e como plugin para o **OpenCode**.

- Marketplace: `eduardohitek`
- Plugin: `eduardohitek-skills` (skills invocadas como `/eduardohitek-skills:<skill>` no Claude Code)
- Plugin OpenCode: `eduardohitek.skills` (skills carregadas por ID, ex.: `@sabatina`)

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

### OpenCode

```
opencode plugin add github:eduardohitek/skills
```

O plugin registra as skills de `skills/` (o ID vem do nome da pasta) e adiciona a entrada ao
config global do OpenCode. Para instalar sem alterar o global, aponte a pasta direto no
`opencode.jsonc` do projeto: `"plugins": ["/caminho/para/skills"]`.

## Estrutura

```
.claude-plugin/marketplace.json   # marketplace do Claude Code
.claude-plugin/plugin.json        # manifest do plugin (Claude Code)
.agents/plugins/marketplace.json  # marketplace do Codex
.codex-plugin/plugin.json         # manifest do plugin (Codex)
package.json                      # manifest do plugin (OpenCode)
src/index.ts                      # plugin do OpenCode: lê skills/ e registra no OpenCode
skills/<nome>/SKILL.md            # skills, compartilhadas pelos três harnesses
```

## Adicionando ou alterando uma skill

1. Criar/editar `skills/<nome>/SKILL.md` em uma branch.
2. Se for skill nova, adicionar `"./skills/<nome>"` em `skills` de `.claude-plugin/plugin.json`
   (Codex e OpenCode leem a pasta `./skills/` inteira).
3. Validar: `claude plugin validate .` e `npm run typecheck`.
4. Abrir PR com título/commit no padrão [Conventional Commits](https://www.conventionalcommits.org/)
   e fazer merge na `main`.

**Não edite `version` à mão.**

## Releases

O versionamento é feito pelo [release-please](https://github.com/googleapis/release-please):

1. A cada push na `main`, a Action abre/atualiza um PR de release que incrementa `version` nos dois
   `plugin.json` (sincronizados), no `package.json` do OpenCode e atualiza o `CHANGELOG.md`.
2. O merge desse PR cria a tag `vX.Y.Z` e a GitHub Release.
3. Os harnesses detectam o novo `version` e atualizam o plugin.

Regras de bump: `fix:` → patch, `feat:` → minor, `feat!:`/`BREAKING CHANGE` → major.

Para atualizar nos harnesses:

- Claude Code: `/plugin marketplace update eduardohitek` (ou ativar auto-update em
  `/plugin` → Marketplaces → eduardohitek → Enable auto-update)
- Codex: `codex plugin marketplace upgrade eduardohitek`
- OpenCode: `opencode plugin update`
