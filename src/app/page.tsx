'use client'
import { CardGrid, SearchBar, SettingsModal } from '@/components'
import { useCards, useSearchState } from '@/hooks/useStored'
import { SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const cardState = useCards()
  const { settings, setSettings, history, addHistory, removeHistory, clearHistory } = useSearchState()
  const [showSettings, setShowSettings] = useState(false)

  return (
    <main className="flex h-dvh w-dvw flex-col items-center overflow-y-auto px-4 py-6 sm:px-[8dvw] lg:px-[14dvw]">
      <SearchBar cards={cardState.cards} settings={settings} history={history} onSearched={addHistory} onRemoveHistory={removeHistory} paused={showSettings} />
      <CardGrid {...cardState} />

      <button onClick={() => setShowSettings(true)} className="fixed bottom-4 left-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface text-fg ring-1 ring-fg/15 opacity-50 hover:opacity-100" aria-label="Configurações" title="Configurações">
        <SlidersHorizontal size={16} />
      </button>
      {showSettings && <SettingsModal settings={settings} onSave={setSettings} onClearHistory={clearHistory} onClose={() => setShowSettings(false)} />}
    </main>
  )
}
