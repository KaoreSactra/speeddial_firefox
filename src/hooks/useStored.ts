'use client'
import { type CardData, loadCards, saveCards } from '@/lib/cards'
import { DEFAULT_SETTINGS, HISTORY_MAX, loadHistory, loadSettings, saveHistory, saveSettings, type SearchSettings } from '@/lib/search'
import { useCallback, useEffect, useState } from 'react'

// localStorage só existe no cliente: tudo carrega após a hidratação.

export function useCards() {
  const [cards, setCards] = useState<CardData[]>([])
  const [loaded, setLoaded] = useState(false)
  const [saveFailed, setSaveFailed] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCards(loadCards())
    setLoaded(true)
  }, [])

  const update = useCallback((next: CardData[]) => {
    setCards(next)
    setSaveFailed(!saveCards(next))
  }, [])

  return { cards, loaded, saveFailed, update }
}

export function useSearchState() {
  const [settings, setSettingsState] = useState<SearchSettings>(DEFAULT_SETTINGS)
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    const loaded = loadSettings()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettingsState(loaded)
    saveSettings(loaded) // persiste migrações (ex.: atalho "tr") e reforça o cookie
    setHistory(loadHistory())
  }, [])

  const setSettings = useCallback((next: SearchSettings) => {
    setSettingsState(next)
    saveSettings(next)
  }, [])

  const addHistory = useCallback((query: string) => {
    setHistory((prev) => {
      const next = [query, ...prev.filter((h) => h !== query)].slice(0, HISTORY_MAX)
      saveHistory(next)
      return next
    })
  }, [])

  const removeHistory = useCallback((query: string) => {
    setHistory((prev) => {
      const next = prev.filter((h) => h !== query)
      saveHistory(next)
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    saveHistory([])
  }, [])

  return { settings, setSettings, history, addHistory, removeHistory, clearHistory }
}
