'use client'
import { type CardArt as CardArtData, type CardData, fileToCardImage, isSafeImageSrc, newId, normalizeUrl, PRESET_FOLDERS } from '@/lib/cards'
import { X } from 'lucide-react'
import { useState } from 'react'
import CardArt from './CardArt'

type Mode = 'preset' | 'upload' | 'link' | 'color'

const inputCls = 'block w-full min-w-0 rounded-md bg-[#1d1d32] px-3 py-2 text-white placeholder:text-white/40 focus:outline-2 focus:outline-secondary'

function initialMode(art?: CardArtData): Mode {
  if (!art) return 'preset'
  if (art.type === 'solid') return 'color'
  if (art.src.startsWith('/img/')) return 'preset'
  if (art.src.startsWith('data:')) return 'upload'
  return 'link'
}

export default function CardEditor({ card, onSave, onCancel }: { card?: CardData; onSave: (card: CardData) => void; onCancel: () => void }) {
  const [name, setName] = useState(card?.name ?? '')
  const [url, setUrl] = useState(card?.url ?? '')
  const [mode, setMode] = useState<Mode>(initialMode(card?.art))
  const [src, setSrc] = useState(card?.art.type === 'image' ? card.art.src : (PRESET_FOLDERS[0]?.images[0]?.src ?? ''))
  const [color, setColor] = useState(card?.art.type === 'solid' ? card.art.color : '#786c9f')
  const [color2, setColor2] = useState(card?.art.type === 'solid' ? (card.art.color2 ?? '') : '#1d1d32')
  const [error, setError] = useState('')
  // Começa na pasta da imagem atual (se for uma existente), senão na primeira.
  const [folderId, setFolderId] = useState(() => (PRESET_FOLDERS.find((f) => f.images.some((i) => i.src === src)) ?? PRESET_FOLDERS[0])?.id)
  const folder = PRESET_FOLDERS.find((f) => f.id === folderId) ?? PRESET_FOLDERS[0]

  const art: CardArtData = mode === 'color' ? { type: 'solid', color, color2: color2 || undefined } : { type: 'image', src }

  async function handleFile(file?: File) {
    if (!file) return
    try {
      setSrc(await fileToCardImage(file))
      setError('')
    } catch {
      setError('Não foi possível ler essa imagem.')
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const normalized = normalizeUrl(url)
    if (!normalized) return setError('Link inválido. Exemplo: youtube.com')
    if (!name.trim()) return setError('Dê um nome ao card.')
    if (art.type === 'image' && !isSafeImageSrc(src)) return setError('Imagem inválida.')
    onSave({ id: card?.id ?? newId(), name: name.trim(), url: normalized, art })
  }

  const modes: [Mode, string][] = [
    ['preset', 'Existentes'],
    ['upload', 'Enviar'],
    ['link', 'Link'],
    ['color', 'Cor'],
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onCancel}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="max-h-full w-full max-w-lg space-y-4 overflow-y-auto whitespace-normal rounded-xl bg-[#14141f] p-5 text-white select-text">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{card ? 'Editar card' : 'Novo card'}</h2>
          <button type="button" onClick={onCancel} aria-label="Fechar" className="cursor-pointer opacity-70 hover:opacity-100">
            <X />
          </button>
        </div>

        <input className={inputCls} placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} autoFocus maxLength={40} />
        <input className={inputCls} placeholder="Link (ex.: youtube.com)" value={url} onChange={(e) => setUrl(e.target.value)} inputMode="url" />

        <div className="grid grid-cols-4 gap-2">
          {modes.map(([m, label]) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`cursor-pointer rounded-md px-1 py-1 text-sm ${mode === m ? 'bg-secondary text-white' : 'bg-[#1d1d32] text-white/70'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === 'preset' && (
          <div className="space-y-2">
            {PRESET_FOLDERS.length > 1 && (
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Pastas">
                {PRESET_FOLDERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    role="tab"
                    aria-selected={f.id === folder?.id}
                    onClick={() => setFolderId(f.id)}
                    className={`cursor-pointer rounded-full px-3 py-0.5 text-xs ${f.id === folder?.id ? 'bg-white text-black' : 'bg-[#1d1d32] text-white/70 hover:text-white'}`}
                  >
                    {f.name} <span className="opacity-60">{f.images.length}</span>
                  </button>
                ))}
              </div>
            )}
            {!folder && <p className="text-sm text-white/60">Nenhuma imagem em public/img/containers/.</p>}
            <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
              {folder?.images.map((p) => (
                <button
                  key={p.src}
                  type="button"
                  onClick={() => setSrc(p.src)}
                  className={`cursor-pointer overflow-hidden rounded-md ${src === p.src ? 'outline-2 outline-white' : 'opacity-70 hover:opacity-100'}`}
                  title={p.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.src} alt={p.name} className="aspect-3/2 w-full object-cover" draggable={false} loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        )}
        {mode === 'upload' && <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} className="block w-full text-sm file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-white" />}
        {mode === 'link' && <input className={inputCls} placeholder="https://exemplo.com/imagem.png" value={src.startsWith('/') || src.startsWith('data:') ? '' : src} onChange={(e) => setSrc(e.target.value)} inputMode="url" />}
        {mode === 'color' && (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <label className="flex items-center gap-2">
              Cor <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-8 w-12 cursor-pointer" />
            </label>
            <label className="flex items-center gap-2">
              Gradiente <input type="color" value={color2 || '#000000'} onChange={(e) => setColor2(e.target.value)} className="h-8 w-12 cursor-pointer" />
            </label>
            <button type="button" onClick={() => setColor2('')} className="cursor-pointer underline opacity-70">
              sem gradiente
            </button>
          </div>
        )}

        <div className="mx-auto aspect-3/2 w-36 rounded-lg bg-secondary">
          <CardArt art={art} name={name || 'Prévia'} />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="cursor-pointer rounded-md px-4 py-2 text-white/70 hover:text-white">
            Cancelar
          </button>
          <button type="submit" className="cursor-pointer rounded-md bg-secondary px-4 py-2 font-semibold text-white">
            Salvar
          </button>
        </div>
      </form>
    </div>
  )
}
