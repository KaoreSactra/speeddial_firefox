import defaults from '@/json/containers.json'

/**
 * Aparência do card. É uma união discriminada para que novos tipos
 * (ex.: `pattern` com SVG vetorial) possam ser adicionados sem migrar os dados:
 * basta incluir o tipo aqui e tratá-lo em `CardArt`.
 */
export type CardArt =
  | { type: 'image'; src: string } // caminho em /public, URL externa ou data URL
  | { type: 'solid'; color: string; color2?: string } // cor ou gradiente

export interface CardData {
  id: string
  name: string
  url: string
  art: CardArt
}

export const STORAGE_KEY = 'speeddial:cards:v1'

export const PRESET_IMAGES = [
  'AmazonShopping',
  'ChatGPT',
  'Crunchyroll',
  'GitHub',
  'Gmail',
  'Google',
  'Instagram',
  'MercadoLivre',
  'Netflix',
  'Pinterest',
  'PrimeVideo',
  'Youtube',
].map((file) => ({ name: file, src: `/img/containers/${file}.png` }))

export const DEFAULT_CARDS: CardData[] = defaults.map((c) => ({
  id: `default-${c.id}`,
  name: c.name,
  url: c.url,
  art: { type: 'image', src: c.img },
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
  if (c.art.type === 'image') return typeof c.art.src === 'string' && isSafeImageSrc(c.art.src)
  if (c.art.type === 'solid') return typeof c.art.color === 'string'
  return false
}

export function loadCards(): CardData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CARDS
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return DEFAULT_CARDS
    return parsed.filter(isCard)
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
