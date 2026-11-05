export interface Engine {
  id: string
  name: string
  /** `%s` é substituído pela busca */
  url: string
  /** Identificador usado por /api/suggest (null = sem sugestões) */
  suggest: string | null
}

export const ENGINES: Engine[] = [
  { id: 'google', name: 'Google', url: 'https://www.google.com/search?q=%s', suggest: 'google' },
  { id: 'duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=%s', suggest: 'duckduckgo' },
  { id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=%s', suggest: 'bing' },
  { id: 'brave', name: 'Brave Search', url: 'https://search.brave.com/search?q=%s', suggest: 'brave' },
  { id: 'youtube', name: 'YouTube', url: 'https://www.youtube.com/results?search_query=%s', suggest: 'youtube' },
]

export interface Shortcut {
  prefix: string
  name: string
  url: string
}

export interface SearchSettings {
  engine: string
  shortcuts: Shortcut[]
}

export const DEFAULT_SHORTCUTS: Shortcut[] = [
  { prefix: 'yt', name: 'YouTube', url: 'https://www.youtube.com/results?search_query=%s' },
  { prefix: 'gh', name: 'GitHub', url: 'https://github.com/search?q=%s' },
  { prefix: 'a', name: 'Amazon', url: 'https://www.amazon.com.br/s?k=%s' },
  { prefix: 'ml', name: 'Mercado Livre', url: 'https://lista.mercadolivre.com.br/%s' },
  { prefix: 'w', name: 'Wikipédia', url: 'https://pt.wikipedia.org/w/index.php?search=%s' },
  { prefix: 'img', name: 'Google Imagens', url: 'https://www.google.com/search?tbm=isch&q=%s' },
]

export const DEFAULT_SETTINGS: SearchSettings = { engine: 'google', shortcuts: DEFAULT_SHORTCUTS }

const SETTINGS_KEY = 'speeddial:search-settings:v1'
const HISTORY_KEY = 'speeddial:search-history:v1'
export const HISTORY_MAX = 20

export function getEngine(id: string): Engine {
  return ENGINES.find((e) => e.id === id) ?? ENGINES[0]
}

/** Valida um modelo de URL de busca: http(s) e contendo %s. */
export function isValidTemplate(template: string): boolean {
  if (!template.includes('%s')) return false
  try {
    const { protocol } = new URL(template.replace('%s', 'x'))
    return protocol === 'https:' || protocol === 'http:'
  } catch {
    return false
  }
}

export function buildSearchUrl(template: string, query: string): string {
  return template.replace('%s', encodeURIComponent(query))
}

export function loadSettings(): SearchSettings {
  try {
    const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? 'null') as Partial<SearchSettings> | null
    if (!parsed) return DEFAULT_SETTINGS
    const shortcuts = Array.isArray(parsed.shortcuts)
      ? parsed.shortcuts.filter((s): s is Shortcut => !!s && typeof s.prefix === 'string' && typeof s.name === 'string' && typeof s.url === 'string' && isValidTemplate(s.url))
      : DEFAULT_SHORTCUTS
    return { engine: getEngine(String(parsed.engine)).id, shortcuts }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: SearchSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {}
}

export function loadHistory(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string').slice(0, HISTORY_MAX) : []
  } catch {
    return []
  }
}

export function saveHistory(history: string[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch {}
}

/** "yt gatos" → { shortcut: yt, rest: "gatos" } */
export function matchShortcut(query: string, shortcuts: Shortcut[]): { shortcut: Shortcut; rest: string } | null {
  const match = /^(\S+)\s+(.+)$/.exec(query.trim())
  if (!match) return null
  const shortcut = shortcuts.find((s) => s.prefix.toLowerCase() === match[1].toLowerCase())
  return shortcut ? { shortcut, rest: match[2].trim() } : null
}

/** Se o texto parece um endereço, devolve a URL completa. */
export function looksLikeUrl(value: string): string | null {
  const v = value.trim()
  if (!v || /\s/.test(v)) return null
  try {
    if (/^https?:\/\//i.test(v)) return new URL(v).href
    if (/^([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?([/?#].*)?$/i.test(v)) return new URL(`https://${v}`).href
  } catch {}
  return null
}

export function normalizeText(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/** Calculadora segura (sem eval): + - * / % ^ e parênteses. Devolve null se não for uma conta. */
export function evaluate(input: string): number | null {
  const src = input
    .replace(/,/g, '.')
    .replace(/[×x]/gi, (m, offset: number, str: string) => (/\d|\)/.test(str[offset - 1] ?? '') || /\s/.test(str[offset - 1] ?? '') ? '*' : m))
    .replace(/÷/g, '/')
    .replace(/\s+/g, '')
  if (!/^[\d+\-*/%^().]+$/.test(src) || !/\d[+\-*/%^]+[\d(.-]/.test(src)) return null

  let pos = 0
  const peek = () => src[pos]
  function number(): number {
    const m = /^\d*\.?\d+(?:\.\d*)?/.exec(src.slice(pos))
    if (!m) throw new Error('num')
    pos += m[0].length
    const n = Number(m[0])
    if (Number.isNaN(n)) throw new Error('num')
    return n
  }
  function primary(): number {
    if (peek() === '(') {
      pos++
      const v = expr()
      if (peek() !== ')') throw new Error('paren')
      pos++
      return v
    }
    return number()
  }
  function unary(): number {
    if (peek() === '-') {
      pos++
      return -unary()
    }
    if (peek() === '+') {
      pos++
      return unary()
    }
    return primary()
  }
  function power(): number {
    const base = unary()
    if (peek() === '^') {
      pos++
      return Math.pow(base, power())
    }
    return base
  }
  function term(): number {
    let v = power()
    while (peek() === '*' || peek() === '/' || peek() === '%') {
      const op = src[pos++]
      const r = power()
      v = op === '*' ? v * r : op === '/' ? v / r : v % r
    }
    return v
  }
  function expr(): number {
    let v = term()
    while (peek() === '+' || peek() === '-') {
      const op = src[pos++]
      const r = term()
      v = op === '+' ? v + r : v - r
    }
    return v
  }

  try {
    const result = expr()
    return pos === src.length && Number.isFinite(result) ? result : null
  } catch {
    return null
  }
}

export function formatNumber(n: number): string {
  return Number(n.toPrecision(12)).toLocaleString('pt-BR', { maximumFractionDigits: 10 })
}
