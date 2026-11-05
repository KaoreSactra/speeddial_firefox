/**
 * Persistência dupla: localStorage + cookie (espelho).
 * Usada para tema e configurações de busca (pequenos). O cookie serve de reserva se o
 * localStorage for limpo, e permite que o script do tema leia a escolha antes de renderizar.
 * Cards ficam só no localStorage (podem conter imagens grandes, que não cabem em cookies).
 */
const MAX_COOKIE = 3500
const ONE_YEAR = 60 * 60 * 24 * 365

const cookieName = (key: string) => key.replace(/[^a-z0-9]/gi, '_')

function readCookie(key: string): string | null {
  try {
    const name = `${cookieName(key)}=`
    const part = document.cookie.split('; ').find((c) => c.startsWith(name))
    return part ? decodeURIComponent(part.slice(name.length)) : null
  } catch {
    return null
  }
}

function writeCookie(key: string, value: string) {
  try {
    const encoded = encodeURIComponent(value)
    if (encoded.length > MAX_COOKIE) return
    const secure = location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${cookieName(key)}=${encoded}; max-age=${ONE_YEAR}; path=/; SameSite=Lax${secure}`
  } catch {}
}

export function readStored(key: string): string | null {
  let value: string | null = null
  try {
    value = localStorage.getItem(key)
  } catch {}
  if (value !== null) {
    if (readCookie(key) === null) writeCookie(key, value) // reforça o espelho
    return value
  }
  return readCookie(key)
}

export function writeStored(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {}
  writeCookie(key, value)
}
