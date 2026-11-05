'use client'
import { THEMES, type ThemeChoice } from '@/lib/theme'
import { DEFAULT_SHORTCUTS, ENGINES, isValidTemplate, type SearchSettings, type Shortcut } from '@/lib/search'
import { Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '../theme/ThemeProvider'

interface Props {
  settings: SearchSettings
  onSave: (settings: SearchSettings) => void
  onClearHistory: () => void
  onClose: () => void
}

const inputCls = 'block w-full min-w-0 rounded-md bg-field px-2 py-1.5 text-sm text-fg placeholder:text-fg/40 focus:outline-2 focus:outline-secondary'

export default function SettingsModal({ settings, onSave, onClearHistory, onClose }: Props) {
  const [engine, setEngine] = useState(settings.engine)
  const [shortcuts, setShortcuts] = useState<Shortcut[]>(settings.shortcuts)
  const [error, setError] = useState('')
  const { choice, setChoice } = useTheme()

  function edit(i: number, patch: Partial<Shortcut>) {
    setShortcuts((list) => list.map((s, idx) => (idx === i ? { ...s, ...patch } : s)))
  }

  function save() {
    const cleaned = shortcuts.map((s) => ({ prefix: s.prefix.trim().toLowerCase(), name: s.name.trim(), url: s.url.trim() })).filter((s) => s.prefix || s.name || s.url)
    for (const s of cleaned) {
      if (!s.prefix || /\s/.test(s.prefix)) return setError('Cada atalho precisa de um prefixo sem espaços.')
      if (!s.name) return setError(`Dê um nome ao atalho "${s.prefix}".`)
      if (!isValidTemplate(s.url)) return setError(`O link de "${s.prefix}" precisa ser http(s) e conter %s onde vai a busca.`)
    }
    if (new Set(cleaned.map((s) => s.prefix)).size !== cleaned.length) return setError('Há prefixos repetidos.')
    onSave({ engine, shortcuts: cleaned })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-full w-full max-w-2xl space-y-5 overflow-y-auto rounded-xl bg-modal p-5 whitespace-normal text-fg select-text">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Configurações</h2>
          <button onClick={onClose} aria-label="Fechar" className="cursor-pointer opacity-70 hover:opacity-100">
            <X />
          </button>
        </div>

        <section className="space-y-2">
          <h3 className="font-semibold">Tema</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {([{ id: 'auto', name: 'Automático' }, ...THEMES] as { id: ThemeChoice; name: string }[]).map((t) => {
              const meta = THEMES.find((m) => m.id === t.id)
              return (
                <button
                  key={t.id}
                  onClick={() => setChoice(t.id)}
                  aria-pressed={choice === t.id}
                  className={`cursor-pointer overflow-hidden rounded-lg text-left text-sm ring-2 transition ${choice === t.id ? 'ring-secondary' : 'ring-transparent hover:ring-fg/30'}`}
                >
                  <span className="relative block h-14 w-full" style={{ background: meta ? meta.preview.page : 'linear-gradient(105deg,#0f0f0f 50%,#f9f9fb 50%)' }}>
                    {meta && (
                      <>
                        <span className="absolute top-3 right-3 left-3 h-3 rounded-full" style={{ background: meta.preview.bar }} />
                        <span className="absolute right-3 bottom-2 h-2 w-6 rounded-full" style={{ background: meta.preview.accent }} />
                      </>
                    )}
                  </span>
                  <span className="bg-field block px-2 py-1.5">{t.name}</span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="font-semibold">Buscador padrão</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {ENGINES.map((e) => (
              <button key={e.id} onClick={() => setEngine(e.id)} className={`cursor-pointer rounded-md px-3 py-2 text-sm ${engine === e.id ? 'bg-secondary text-on-accent' : 'bg-field text-fg/70 hover:text-fg'}`}>
                {e.name}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="font-semibold">Atalhos de busca</h3>
          <p className="text-sm text-fg/60">
            Digite o prefixo, um espaço e a busca (ex.: <code>yt gatos</code>). No link, <code>%s</code> é onde entra a busca.
          </p>
          {shortcuts.map((s, i) => (
            <div key={i} className="grid grid-cols-[4.5rem_1fr_auto] gap-2 sm:grid-cols-[4.5rem_9rem_1fr_auto]">
              <input className={inputCls} placeholder="prefixo" value={s.prefix} onChange={(e) => edit(i, { prefix: e.target.value })} />
              <input className={`${inputCls} hidden sm:block`} placeholder="Nome" value={s.name} onChange={(e) => edit(i, { name: e.target.value })} />
              <input className={inputCls} placeholder="https://site.com/busca?q=%s" value={s.url} onChange={(e) => edit(i, { url: e.target.value })} />
              <button onClick={() => setShortcuts((l) => l.filter((_, idx) => idx !== i))} aria-label="Remover atalho" className="cursor-pointer px-1 opacity-70 hover:opacity-100">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <div className="flex gap-3 text-sm">
            <button onClick={() => setShortcuts((l) => [...l, { prefix: '', name: '', url: '' }])} className="text-muted flex cursor-pointer items-center gap-1">
              <Plus size={14} /> Adicionar
            </button>
            <button onClick={() => setShortcuts(DEFAULT_SHORTCUTS)} className="cursor-pointer text-fg/60 underline">
              Restaurar padrão
            </button>
          </div>
        </section>

        <section>
          <button onClick={onClearHistory} className="cursor-pointer rounded-md bg-field px-3 py-2 text-sm text-fg/80 hover:text-fg">
            Limpar histórico de pesquisas
          </button>
        </section>

        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="cursor-pointer rounded-md px-4 py-2 text-fg/70 hover:text-fg">
            Cancelar
          </button>
          <button onClick={save} className="cursor-pointer rounded-md bg-secondary px-4 py-2 font-semibold text-on-accent">
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
