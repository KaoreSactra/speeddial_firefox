export type ThemeId = 'intergalactic' | 'default-dark' | 'default-light'
export type ThemeChoice = ThemeId | 'auto'

export interface ThemeMeta {
  id: ThemeId
  name: string
  scheme: 'dark' | 'light'
  /** Partículas animadas no fundo */
  particles: boolean
  /** Cores só para a miniatura na tela de configurações (o tema real está em globals.css) */
  preview: { page: string; bar: string; accent: string }
}

export const THEMES: ThemeMeta[] = [
  { id: 'intergalactic', name: 'Intergaláctico', scheme: 'dark', particles: true, preview: { page: '#0f0f0f', bar: '#1d1d32', accent: '#786c9f' } },
  { id: 'default-dark', name: 'Padrão escuro', scheme: 'dark', particles: false, preview: { page: 'linear-gradient(100deg,#3a3060,#1c1b22 50%,#4a2c2c)', bar: '#2b2a33', accent: '#7c6ae6' } },
  { id: 'default-light', name: 'Padrão claro', scheme: 'light', particles: false, preview: { page: 'linear-gradient(100deg,#e4dcff,#f9f9fb 50%,#ffe3d6)', bar: '#ffffff', accent: '#5b4fd1' } },
]

export const THEME_KEY = 'speeddial:theme:v1'
export const DEFAULT_THEME: ThemeChoice = 'intergalactic'

export function isThemeChoice(v: unknown): v is ThemeChoice {
  return v === 'auto' || THEMES.some((t) => t.id === v)
}

export function resolveTheme(choice: ThemeChoice, systemLight: boolean): ThemeId {
  return choice === 'auto' ? (systemLight ? 'default-light' : 'default-dark') : choice
}

/** Roda antes da hidratação para o tema certo aparecer sem "piscar". */
export const THEME_INIT_SCRIPT = `try{var ids=${JSON.stringify(THEMES.map((t) => t.id))};var c=localStorage.getItem(${JSON.stringify(THEME_KEY)})||${JSON.stringify(DEFAULT_THEME)};var t=c==='auto'?(matchMedia('(prefers-color-scheme: light)').matches?'default-light':'default-dark'):(ids.indexOf(c)>-1?c:${JSON.stringify(DEFAULT_THEME)});document.documentElement.dataset.theme=t}catch(e){}`
