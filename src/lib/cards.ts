import defaults from '@/json/containers.json'
import presets from '@/json/presets.json'

/**
 * Aparência do card. É uma união discriminada para que novos tipos
 * (ex.: `pattern` com SVG vetorial) possam ser adicionados sem migrar os dados:
 * basta incluir o tipo aqui e tratá-lo em `CardArt`.
 */
export type CardArt =
  | { type: 'image'; src: string } // caminho em /public, URL externa ou data URL
  | { type: 'solid'; color: string; color2?: string } // cor ou gradiente

export const CONTAINER_COLORS = ['blue', 'turquoise', 'green', 'yellow', 'orange', 'red', 'pink', 'purple', 'toolbar'] as const
export const CONTAINER_ICONS = ['fingerprint', 'briefcase', 'dollar', 'cart', 'circle', 'gift', 'vacation', 'food', 'fruit', 'pet', 'tree', 'chill', 'fence'] as const
export type ContainerColor = (typeof CONTAINER_COLORS)[number]
export type ContainerIcon = (typeof CONTAINER_ICONS)[number]

/** Cores aproximadas das usadas pelo Firefox, só para a prévia/indicador. */
export const CONTAINER_HEX: Record<ContainerColor, string> = {
  blue: '#37adff',
  turquoise: '#00c79a',
  green: '#51cd00',
  yellow: '#ffcb00',
  orange: '#ff9f00',
  red: '#ff613d',
  pink: '#ff4bda',
  purple: '#af51f5',
  toolbar: '#7c7c7d',
}

/**
 * Container do Firefox onde o card deve abrir. Uma página web não consegue
 * escolher o container sozinha, então o link usa o protocolo `ext+container:`
 * da extensão "Open external links in a container".
 * Cor e ícone fazem a extensão criar o container caso ele ainda não exista.
 */
export interface CardContainer {
  name: string
  color?: ContainerColor
  icon?: ContainerIcon
  pinned?: boolean
  reader?: boolean
  mute?: boolean
}

export interface CardData {
  id: string
  name: string
  url: string
  art: CardArt
  container?: CardContainer
}

/** URL que abre o card: direta ou via `ext+container:` quando há container. */
export function cardHref(card: CardData): string {
  const c = card.container
  if (!c?.name) return card.url
  const params = new URLSearchParams({ name: c.name })
  if (c.color) params.set('color', c.color)
  if (c.icon) params.set('icon', c.icon)
  if (c.pinned) params.set('pinned', 'true')
  if (c.reader) params.set('openInReaderMode', 'true')
  if (c.mute) params.set('mute', 'true')
  params.set('url', card.url) // codificada, para não quebrar com &, ? ou #
  return `ext+container:${params.toString()}`
}

function isContainer(value: unknown): value is CardContainer {
  if (!value || typeof value !== 'object') return false
  const c = value as Partial<CardContainer>
  if (typeof c.name !== 'string' || !c.name.trim()) return false
  if (c.color !== undefined && !CONTAINER_COLORS.includes(c.color)) return false
  if (c.icon !== undefined && !CONTAINER_ICONS.includes(c.icon)) return false
  return true
}

export const STORAGE_KEY = 'speeddial:cards:v1'

export interface PresetFolder {
  id: string
  name: string
  images: { name: string; src: string }[]
}

/** Gerado por scripts/gen-presets.mjs a partir de public/img/containers/<pasta>/ */
export const PRESET_FOLDERS: PresetFolder[] = presets

export const DEFAULT_CARDS: CardData[] = defaults.map((c) => ({
  id: `default-${c.id}`,
  name: c.name,
  url: c.url,
  art: { type: 'solid', color: c.color, color2: c.color2 },
}))

/** Aceita "youtube.com", "http://x.com"… e devolve uma URL http(s) válida ou null. */
export function normalizeUrl(input: string): string | null {
  const value = input.trim()
  if (!value) return null
  const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`
  try {
    const parsed = new URL(withProtocol)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null
    if (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost') return null
    return parsed.href
  } catch {
    return null
  }
}

/** Só permite fontes de imagem seguras para uso em <img>. */
export function isSafeImageSrc(src: string): boolean {
  if (src.startsWith('/') && !src.startsWith('//')) return true
  if (/^data:image\/(png|jpe?g|webp|gif|svg\+xml|avif);/i.test(src)) return true
  try {
    const { protocol } = new URL(src)
    return protocol === 'https:' || protocol === 'http:'
  } catch {
    return false
  }
}

function isCard(value: unknown): value is CardData {
  if (!value || typeof value !== 'object') return false
  const c = value as Partial<CardData>
  if (typeof c.id !== 'string' || typeof c.name !== 'string' || typeof c.url !== 'string' || !c.art) return false
  if (normalizeUrl(c.url) === null) return false
  if (c.container !== undefined && !isContainer(c.container)) return false
  if (c.art.type === 'image') return typeof c.art.src === 'string' && isSafeImageSrc(c.art.src)
  if (c.art.type === 'solid') return typeof c.art.color === 'string'
  return false
}

/** Cards salvos antes das pastas apontavam para /img/containers/X.png (agora em /gatos/). */
function migrate(card: CardData): CardData {
  if (card.art.type === 'image' && /^\/img\/containers\/[^/]+\.png$/.test(card.art.src)) {
    return { ...card, art: { type: 'image', src: card.art.src.replace('/img/containers/', '/img/containers/gatos/') } }
  }
  return card
}

export function loadCards(): CardData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CARDS
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return DEFAULT_CARDS
    return parsed.filter(isCard).map(migrate)
  } catch {
    return DEFAULT_CARDS
  }
}

export function saveCards(cards: CardData[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
    return true
  } catch {
    return false // cota excedida ou storage bloqueado
  }
}

export function newId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `c-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/** Redimensiona uma imagem enviada para caber no card (3:2) e devolve um data URL leve. */
export async function fileToCardImage(file: File, width = 450, height = 300): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas indisponível')
  // "cover": preenche o card recortando o excesso
  const scale = Math.max(width / bitmap.width, height / bitmap.height)
  const w = bitmap.width * scale
  const h = bitmap.height * scale
  ctx.drawImage(bitmap, (width - w) / 2, (height - h) / 2, w, h)
  bitmap.close()
  return canvas.toDataURL('image/webp', 0.85)
}
