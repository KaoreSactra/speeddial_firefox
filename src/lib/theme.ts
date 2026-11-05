import { THEME_KEY } from './theme-key'

export type FxId = 'none' | 'stars' | 'pixelstars' | 'matrix' | 'snow' | 'sakura' | 'leaves' | 'bubbles' | 'embers'

export interface ThemeMeta {
  id: string
  name: string
  group: GroupId
  /** Efeito animado no fundo (ver components/bg) */
  fx: FxId
  /** Cores só para a miniatura na tela de configurações (o tema real está em styles/themes.css e globals.css) */
  preview: { page: string; bar: string; accent: string }
}

export type GroupId = 'kaore' | 'padrao' | 'neon' | 'natureza' | 'materiais' | 'minimal' | 'editor' | 'sazonais'

export const GROUPS: { id: GroupId; name: string }[] = [
  { id: 'kaore', name: 'Kaore Theme' },
  { id: 'padrao', name: 'Padrão' },
  { id: 'neon', name: 'Neon & Retrô' },
  { id: 'natureza', name: 'Natureza' },
  { id: 'materiais', name: 'Materiais' },
  { id: 'minimal', name: 'Minimalistas' },
  { id: 'editor', name: 'Editor de código' },
  { id: 'sazonais', name: 'Sazonais' },
]

const t = (id: string, name: string, group: GroupId, fx: FxId, page: string, bar: string, accent: string): ThemeMeta => ({ id, name, group, fx, preview: { page, bar, accent } })

export const THEMES: ThemeMeta[] = [
  // Kaore Theme
  t('intergalactic', 'Intergaláctico', 'kaore', 'stars', '#0f0f0f', '#1d1d32', '#786c9f'),
  t('cyber2077', 'Cyberpunk 2077', 'kaore', 'none', 'linear-gradient(100deg,#5a1486,#0a0414 50%,#8a1048)', '#100820', '#fcee0a'),
  // Padrão
  t('default-dark', 'Padrão escuro', 'padrao', 'none', 'linear-gradient(100deg,#3a3060,#1c1b22 50%,#4a2c2c)', '#2b2a33', '#7c6ae6'),
  t('default-light', 'Padrão claro', 'padrao', 'none', 'linear-gradient(100deg,#e4dcff,#f9f9fb 50%,#ffe3d6)', '#ffffff', '#5b4fd1'),
  // Neon & Retrô
  t('cyberpunk', 'Cyberpunk Neon', 'neon', 'none', 'linear-gradient(100deg,#3a0a4a,#0a0a14 50%,#00424d)', '#12121f', '#00f0ff'),
  t('crt-green', 'Terminal CRT verde', 'neon', 'none', 'radial-gradient(#0c3a1a,#020703)', '#04120a', '#33ff66'),
  t('crt-amber', 'Terminal CRT âmbar', 'neon', 'none', 'radial-gradient(#3d2800,#070400)', '#140c00', '#ffb000'),
  t('synthwave', 'Synthwave', 'neon', 'stars', 'linear-gradient(#14062b,#7a1a7e 60%,#ff4fa3)', '#1f0b3d', '#ff2fa8'),
  t('matrix', 'Matrix', 'neon', 'matrix', '#000', '#020b02', '#00ff41'),
  t('gameboy', 'Game Boy', 'neon', 'none', '#9bbc0f', '#8bac0f', '#0f380f'),
  t('pixelspace', 'Pixel Space 80s', 'neon', 'pixelstars', 'linear-gradient(#0b1030,#1b1b4b 55%,#ff7a45)', '#14163f', '#ff9f1c'),
  // Natureza
  t('forest', 'Floresta Zen', 'natureza', 'leaves', 'linear-gradient(120deg,#c4d3b5,#ece7d6 55%,#dfcfa8)', '#f6f2e6', '#4d7a4a'),
  t('ocean', 'Oceano', 'natureza', 'bubbles', 'linear-gradient(#06365a,#031a2e)', '#0b2f4d', '#22b8e6'),
  t('sakura', 'Sakura', 'natureza', 'sakura', 'linear-gradient(120deg,#ffd6e0,#fff1f4 55%,#ffe6d8)', '#ffffff', '#e0668a'),
  // Materiais
  t('glass', 'Glassmorphism', 'materiais', 'none', 'linear-gradient(120deg,#6d3fe0,#0e0b1f 50%,#0fa5c0)', 'rgba(255,255,255,.25)', '#8b5cf6'),
  t('paper', 'Papel & Caderno', 'materiais', 'none', 'repeating-linear-gradient(#f6f0de 0 7px,#c9d6ea 7px 8px)', '#fffdf5', '#c0463a'),
  t('neobrutal', 'Neobrutalismo', 'materiais', 'none', '#fffbeb', '#ffd93d', '#ff6b6b'),
  // Minimalistas
  t('nordic', 'Nórdico', 'minimal', 'none', '#eceff4', '#ffffff', '#5e81ac'),
  t('oled', 'Dark OLED', 'minimal', 'none', '#000', '#0c0c0c', '#4cc2ff'),
  // Editor de código
  t('dracula', 'Dracula', 'editor', 'none', '#282a36', '#343746', '#bd93f9'),
  t('mocha', 'Catppuccin Mocha', 'editor', 'none', '#1e1e2e', '#313244', '#cba6f7'),
  t('macchiato', 'Catppuccin Macchiato', 'editor', 'none', '#24273a', '#363a4f', '#c6a0f6'),
  t('frappe', 'Catppuccin Frappé', 'editor', 'none', '#303446', '#414559', '#ca9ee6'),
  t('latte', 'Catppuccin Latte', 'editor', 'none', '#eff1f5', '#ccd0da', '#8839ef'),
  t('nord', 'Nord', 'editor', 'none', '#2e3440', '#3b4252', '#88c0d0'),
  // Sazonais
  t('halloween', 'Halloween', 'sazonais', 'embers', 'radial-gradient(at 50% 100%,#6a2a08,#120a1c 70%)', '#1d1030', '#ff7a18'),
  t('natal', 'Natal', 'sazonais', 'snow', 'linear-gradient(#0f2e25,#0a1a16)', '#123a2e', '#e53935'),
]

export type ThemeId = string
export type ThemeChoice = string // 'auto' ou id de THEMES

export { THEME_KEY }
export const DEFAULT_THEME: ThemeChoice = 'auto'

export function isThemeChoice(v: unknown): v is ThemeChoice {
  return v === 'auto' || THEMES.some((m) => m.id === v)
}

export function getTheme(id: string): ThemeMeta {
  return THEMES.find((m) => m.id === id) ?? THEMES.find((m) => m.id === 'default-dark')!
}

export function resolveTheme(choice: ThemeChoice, systemLight: boolean): ThemeId {
  return choice === 'auto' ? (systemLight ? 'default-light' : 'default-dark') : choice
}

/** Roda antes da hidratação (lê localStorage ou o cookie espelho) para o tema certo aparecer sem "piscar". */
export const THEME_INIT_SCRIPT = `try{var ids=${JSON.stringify(THEMES.map((m) => m.id))};var k=${JSON.stringify(THEME_KEY)};var c=null;try{c=localStorage.getItem(k)}catch(e){}if(c===null){var n=k.replace(/[^a-z0-9]/gi,'_')+'=',p=document.cookie.split('; ').filter(function(x){return x.indexOf(n)===0})[0];if(p)c=decodeURIComponent(p.slice(n.length))}c=c||${JSON.stringify(DEFAULT_THEME)};if(ids.indexOf(c)<0)c='auto';document.documentElement.dataset.theme=c==='auto'?(matchMedia('(prefers-color-scheme: light)').matches?'default-light':'default-dark'):c}catch(e){}`
