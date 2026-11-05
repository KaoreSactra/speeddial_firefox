'use client'
import { type CardData, DEFAULT_CARDS } from '@/lib/cards'
import { ArrowLeft, ArrowRight, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import CardArt from './CardArt'
import CardEditor from './CardEditor'

interface Props {
  cards: CardData[]
  loaded: boolean
  saveFailed: boolean
  update: (cards: CardData[]) => void
}

export default function CardGrid({ cards, loaded, saveFailed, update }: Props) {
  const [editMode, setEditMode] = useState(false)
  const [editing, setEditing] = useState<CardData | 'new' | null>(null)

  function move(index: number, delta: number) {
    const target = index + delta
    if (target < 0 || target >= cards.length) return
    const next = [...cards]
    ;[next[index], next[target]] = [next[target], next[index]]
    update(next)
  }

  function handleSave(card: CardData) {
    const exists = cards.some((c) => c.id === card.id)
    update(exists ? cards.map((c) => (c.id === card.id ? card : c)) : [...cards, card])
    setEditing(null)
  }

  function reset() {
    if (confirm('Restaurar os cards originais? Seus cards customizados serão perdidos.')) update(DEFAULT_CARDS)
  }

  const actionBtn = 'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface text-fg ring-1 ring-fg/15 hover:bg-field disabled:cursor-default disabled:opacity-30'

  return (
    <>
      <ul className={`my-auto grid w-full max-w-6xl grid-cols-2 gap-4 pb-16 transition-opacity duration-300 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-10 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        {cards.map((card, i) => (
          <li key={card.id} className="sd-card group relative aspect-3/2">
            <a href={card.url} draggable={false} className="block h-full w-full rounded-[inherit]" rel="noopener noreferrer" aria-label={card.name} onClick={(e) => editMode && e.preventDefault()}>
              <CardArt art={card.art} name={card.name} />
            </a>
            {editMode && (
              <div className="absolute inset-0 flex flex-wrap content-center items-center justify-center gap-2 rounded-[inherit] bg-black/50">
                <button className={actionBtn} onClick={() => move(i, -1)} disabled={i === 0} aria-label="Mover para trás">
                  <ArrowLeft size={16} />
                </button>
                <button className={actionBtn} onClick={() => setEditing(card)} aria-label="Editar">
                  <Pencil size={16} />
                </button>
                <button className={actionBtn} onClick={() => update(cards.filter((c) => c.id !== card.id))} aria-label="Remover">
                  <Trash2 size={16} />
                </button>
                <button className={actionBtn} onClick={() => move(i, 1)} disabled={i === cards.length - 1} aria-label="Mover para frente">
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </li>
        ))}
        {editMode && (
          <li>
            <button
              onClick={() => setEditing('new')}
              className="flex aspect-3/2 w-full cursor-pointer items-center justify-center rounded-(--card-radius) border-2 border-dashed border-muted text-muted transition hover:scale-106"
              aria-label="Adicionar card"
            >
              <Plus size={40} />
            </button>
          </li>
        )}
      </ul>

      <div className="fixed right-4 bottom-4 flex items-center gap-2">
        {saveFailed && <span className="rounded-md bg-red-900/80 px-2 py-1 text-xs text-white">Armazenamento cheio: mudanças não salvas</span>}
        {editMode && (
          <button onClick={reset} className={actionBtn} aria-label="Restaurar padrão" title="Restaurar padrão">
            <RotateCcw size={16} />
          </button>
        )}
        <button onClick={() => setEditMode((v) => !v)} className={`${actionBtn} ${editMode ? 'bg-secondary! text-on-accent!' : 'opacity-40 hover:opacity-100'}`} aria-label="Editar cards" title="Editar cards">
          <Pencil size={16} />
        </button>
      </div>

      {editing && <CardEditor card={editing === 'new' ? undefined : editing} onSave={handleSave} onCancel={() => setEditing(null)} />}
    </>
  )
}
