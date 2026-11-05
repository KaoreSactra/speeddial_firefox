'use client'
import { DEFAULT_THEME, isThemeChoice, resolveTheme, THEME_KEY, type ThemeChoice, type ThemeId } from '@/lib/theme'
import { readStored, writeStored } from '@/lib/storage'
import { createContext, useContext, useEffect, useState } from 'react'

interface ThemeCtx {
  choice: ThemeChoice
  theme: ThemeId
  ready: boolean
  setChoice: (c: ThemeChoice) => void
}

const Ctx = createContext<ThemeCtx>({ choice: DEFAULT_THEME, theme: 'default-dark', ready: false, setChoice: () => {} })
export const useTheme = () => useContext(Ctx)

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [choice, setChoiceState] = useState<ThemeChoice>(DEFAULT_THEME)
  const [systemLight, setSystemLight] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: light)')
    const stored = readStored(THEME_KEY)
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
    writeStored(THEME_KEY, c)
  }

  return <Ctx.Provider value={{ choice, theme, ready, setChoice }}>{children}</Ctx.Provider>
}
