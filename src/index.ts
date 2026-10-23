import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { Plugin, type Skill } from "@opencode/plugin"

/**
 * Plugin que expõe as skills deste repositório (`skills/<id>/SKILL.md`) ao OpenCode.
 *
 * Os arquivos são lidos no momento em que o plugin carrega, então não há manifesto
 * intermediário: adicionar uma skill é só criar a pasta com o `SKILL.md`.
 */
const PLUGIN_ID = "eduardohitek.skills"
const SKILLS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "skills")

type FrontmatterValue = string | boolean | { [key: string]: FrontmatterValue }
type Frontmatter = Record<string, FrontmatterValue>

export default Plugin.define({
  id: PLUGIN_ID,
  async setup(ctx) {
    const skills = await loadSkills()
    if (skills.length === 0) return

    await ctx.skill.transform((editor) => {
      for (const skill of skills) {
        // Skills descobertas por arquivo (`.claude/skills`, `.agents/skills`,
        // `.opencode/skills`) são aplicadas depois dos transforms de plugin, então
        // mantêm a precedência quando o ID já existe na máquina.
        editor.add(skill)
      }
    })
  },
})

async function loadSkills(): Promise<Skill.Info[]> {
  let entries
  try {
    entries = await readdir(SKILLS_DIR, { withFileTypes: true })
  } catch {
    return []
  }

  const skills: Skill.Info[] = []
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isDirectory()) continue

    const file = path.join(SKILLS_DIR, entry.name, "SKILL.md")
    let source: string
    try {
      source = await readFile(file, "utf8")
    } catch {
      continue
    }

    skills.push(defineSkill(entry.name, file, source))
  }
  return skills
}

function defineSkill(id: string, file: string, source: string): Skill.Info {
  const { data, body } = splitFrontmatter(source)
  const description = asText(data.description)
  const autoinvoke = readAutoinvoke(data)

  // `id`, `name` e `path` são strings com brand no schema; os valores já vêm validados
  // (id = nome da pasta, path = caminho absoluto real).
  return {
    id,
    name: asText(data.name) ?? id,
    ...(description ? { description } : {}),
    ...(autoinvoke === undefined ? {} : { autoinvoke }),
    path: file,
    content: body,
  } as Skill.Info
}

function splitFrontmatter(source: string): { data: Frontmatter; body: string } {
  const normalized = source.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n")
  const match = /^---\n([\s\S]*?)\n---(?:\n|$)/.exec(normalized)
  if (!match) return { data: {}, body: normalized.trim() }

  return {
    data: parseFrontmatter(match[1] ?? ""),
    body: normalized.slice(match[0].length).trim(),
  }
}

function readAutoinvoke(data: Frontmatter): boolean | undefined {
  const metadata = data.metadata
  if (metadata && typeof metadata === "object") {
    const value = asBoolean(metadata["opencode/autoinvoke"])
    if (value !== undefined) return value
  }
  return asBoolean(data["disable-model-invocation"])
}

/**
 * Parser de um subconjunto de YAML suficiente para frontmatter de skill: mapas por
 * indentação, escalares simples e block scalars (`>` e `|`).
 */
function parseFrontmatter(yaml: string): Frontmatter {
  const lines = yaml.split("\n")
  const root: Frontmatter = {}
  const stack: { indent: number; node: Frontmatter }[] = [{ indent: -1, node: root }]
  let index = 0

  while (index < lines.length) {
    const line = lines[index] ?? ""
    index++
    if (!line.trim() || line.trimStart().startsWith("#")) continue

    const match = /^([^:\s][^:]*?)\s*:(?:\s+(.*))?$/.exec(line.trim())
    if (!match) continue

    const indent = line.length - line.trimStart().length
    while (stack.length > 1 && (stack[stack.length - 1]?.indent ?? -1) >= indent) stack.pop()
    const parent = stack[stack.length - 1]?.node ?? root
    const key = unquote(match[1] ?? "")
    const value = (match[2] ?? "").trim()

    if (/^[>|][+-]?$/.test(value)) {
      const block = readBlockScalar(lines, index, indent, value)
      parent[key] = block.value
      index = block.next
      continue
    }

    if (!value) {
      const child: Frontmatter = {}
      parent[key] = child
      stack.push({ indent, node: child })
      continue
    }

    parent[key] = parseScalar(value)
  }

  return root
}

function readBlockScalar(
  lines: string[],
  start: number,
  parentIndent: number,
  marker: string,
): { value: string; next: number } {
  const literal = marker.startsWith("|")
  const collected: string[] = []
  let blockIndent: number | undefined
  let index = start

  while (index < lines.length) {
    const line = lines[index] ?? ""
    if (!line.trim()) {
      collected.push("")
      index++
      continue
    }

    const indent = line.length - line.trimStart().length
    if (indent <= parentIndent) break

    blockIndent ??= indent
    collected.push(line.slice(blockIndent))
    index++
  }

  while (collected.length > 0 && collected[collected.length - 1] === "") collected.pop()
  return { value: literal ? collected.join("\n") : fold(collected), next: index }
}

function fold(lines: string[]): string {
  const parts: string[] = []
  let paragraph: string[] = []

  const flush = () => {
    if (paragraph.length > 0) parts.push(paragraph.join(" "))
    paragraph = []
  }

  for (const line of lines) {
    if (line === "") {
      flush()
      parts.push("")
      continue
    }
    paragraph.push(line)
  }
  flush()

  return parts.join("\n").trim()
}

function parseScalar(value: string): string | boolean {
  const text = unquote(value)
  if (text === "true") return true
  if (text === "false") return false
  return text
}

function unquote(value: string): string {
  const text = value.trim()
  if (text.length >= 2) {
    const first = text[0]
    const last = text[text.length - 1]
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return text.slice(1, -1)
    }
  }
  return text
}

function asText(value: FrontmatterValue | undefined): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

function asBoolean(value: FrontmatterValue | undefined): boolean | undefined {
  if (typeof value === "boolean") return value
  if (typeof value !== "string") return undefined

  const text = value.trim().toLowerCase()
  if (text === "true") return true
  if (text === "false") return false
  return undefined
}
