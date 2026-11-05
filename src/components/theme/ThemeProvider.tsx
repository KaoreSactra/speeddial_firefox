'use client'
import { DEFAULT_THEME, isThemeChoice, resolveTheme, THEME_KEY, type ThemeChoice, type ThemeId } from '@/lib/theme'
import { createContext, useContext, useEffect, useState } from 'react'

interface ThemeCtx {
  choice: ThemeChoice
  theme: ThemeId
  ready: boolean
  setChoice: (c: ThemeChoice) => void
}

const Ctx = createContext<ThemeCtx>({ choice: DEFAULT_THEME, theme: 'intergalactic', ready: false, setChoice: () => {} })
export const useTheme = () => useContext(Ctx)

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [choice, setChoiceState] = useState<ThemeChoice>(DEFAULT_THEME)
  const [systemLight, setSystemLight] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: light)')
    let stored: string | null = null
    try {
      stored = localStorage.getItem(THEME_KEY)
    } catch {}
    /* eslint-disable react-hooks/set-state-in-effect */
    setSystemLight(mq.matches)
    if (isThemeChoice(stored)) setChoiceState(stored)
    setReady(true)
    /* eslint-enable react-hooks/set-state-in-effect */
    const onChange = (e: MediaQueryListEvent) => setSystemLight(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const theme = resolveTheme(choice, systemLight)

  useEffect(() => {
    if (ready) document.documentElement.dataset.theme = theme
  }, [theme, ready])

  function setChoice(c: ThemeChoice) {
    setChoiceState(c)
    try {
      localStorage.setItem(THEME_KEY, c)
    } catch {}
  }

  return <Ctx.Provider value={{ choice, theme, ready, setChoice }}>{children}</Ctx.Provider>
}
