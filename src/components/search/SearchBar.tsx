'use client'
import type { CardData } from '@/lib/cards'
import { buildSearchUrl, evaluate, formatNumber, getEngine, looksLikeUrl, matchShortcut, normalizeText, type SearchSettings } from '@/lib/search'
import { Calculator, Clock, Globe, Search, TrendingUp, X, Zap } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import CardArt from '../cards/CardArt'

interface Props {
  cards: CardData[]
  settings: SearchSettings
  history: string[]
  onSearched: (query: string) => void
  onRemoveHistory: (query: string) => void
  /** Algum modal está aberto: desativa o atalho "/" */
  paused?: boolean
}

type Item = {
  key: string
  kind: 'calc' | 'url' | 'shortcut' | 'card' | 'search' | 'history' | 'remote'
  label: string
  hint?: string
  card?: CardData
  removable?: string
  run: (newTab: boolean) => void
}

function go(url: string, newTab: boolean) {
  if (newTab) window.open(url, '_blank', 'noopener,noreferrer')
  else window.location.href = url
}

function cardMatches(card: CardData, q: string) {
  const name = normalizeText(card.name)
  const nq = normalizeText(q)
  return name.replace(/\s/g, '').startsWith(nq.replace(/\s/g, '')) || name.split(/\s+/).some((w) => w.startsWith(nq))
}

export default function SearchBar({ cards, settings, history, onSearched, onRemoveHistory, paused }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [remote, setRemote] = useState<{ q: string; list: string[] }>({ q: '', list: [] })
  const [copied, setCopied] = useState(false)
  const [focused, setFocused] = useState(false)

  const engine = getEngine(settings.engine)
  const q = query.trim()
  const calc = useMemo(() => (q ? evaluate(q) : null), [q])
  const urlHref = useMemo(() => looksLikeUrl(q), [q])
  const shortcutMatch = useMemo(() => matchShortcut(q, settings.shortcuts), [q, settings.shortcuts])
  const wantRemote = !!q && calc === null && !urlHref && !shortcutMatch && !!engine.suggest

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Atalhos globais: "/" e Ctrl/Cmd+K focam a barra.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null
      const typing = !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)
      if ((e.key === '/' && !typing && !paused) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [paused])

  // Sugestões remotas (com debounce e cancelamento).
  useEffect(() => {
    if (!wantRemote || !engine.suggest) return
    const ctrl = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/suggest?engine=${engine.suggest}&q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        const data = (await res.json()) as { suggestions?: string[] }
        setRemote({ q, list: data.suggestions ?? [] })
      } catch {}
    }, 180)
    return () => {
      clearTimeout(timer)
      ctrl.abort()
    }
  }, [q, wantRemote, engine.suggest])

  const items = useMemo<Item[]>(() => {
    const searchFor = (text: string) => () => {
      onSearched(text)
    }
    const runSearch = (text: string) => (newTab: boolean) => {
      searchFor(text)()
      go(buildSearchUrl(engine.url, text), newTab)
    }

    if (!q) return history.slice(0, 6).map((h) => ({ key: `h-${h}`, kind: 'history', label: h, removable: h, run: runSearch(h) }))

    const list: Item[] = []
    if (calc !== null) {
      const text = formatNumber(calc)
      list.push({
        key: 'calc',
        kind: 'calc',
        label: `= ${text}`,
        hint: 'Enter para copiar',
        run: () => {
          navigator.clipboard?.writeText(String(Number(calc.toPrecision(12)))).catch(() => {})
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        },
      })
    }
    if (urlHref) list.push({ key: 'url', kind: 'url', label: `Abrir ${new URL(urlHref).host}`, hint: 'Ir para o site', run: (t) => go(urlHref, t) })
    if (shortcutMatch) {
      const { shortcut, rest } = shortcutMatch
      list.push({
        key: 'shortcut',
        kind: 'shortcut',
        label: `${rest}`,
        hint: `Pesquisar em ${shortcut.name}`,
        run: (t) => {
          onSearched(q)
          go(buildSearchUrl(shortcut.url, rest), t)
        },
      })
    }
    if (calc === null) {
      cards
        .filter((c) => cardMatches(c, q))
        .slice(0, 3)
        .forEach((c) => list.push({ key: `c-${c.id}`, kind: 'card', label: c.name, hint: new URL(c.url).host, card: c, run: (t) => go(c.url, t) }))
    }
    if (!urlHref && !shortcutMatch && calc === null) list.push({ key: 'search', kind: 'search', label: q, hint: `Pesquisar no ${engine.name}`, run: runSearch(q) })

    const seen = new Set([q.toLowerCase()])
    history
      .filter((h) => h.toLowerCase().includes(q.toLowerCase()) && !seen.has(h.toLowerCase()))
      .slice(0, 3)
      .forEach((h) => {
        seen.add(h.toLowerCase())
        list.push({ key: `h-${h}`, kind: 'history', label: h, removable: h, run: runSearch(h) })
      })
    if (wantRemote && remote.q === q) {
      remote.list.forEach((s) => {
        if (seen.has(s.toLowerCase())) return
        seen.add(s.toLowerCase())
        list.push({ key: `r-${s}`, kind: 'remote', label: s, run: runSearch(s) })
      })
    }
    return list
  }, [q, calc, urlHref, shortcutMatch, cards, history, remote, wantRemote, engine, onSearched])

  const activeIndex = Math.min(active, items.length - 1)

  function onChange(value: string) {
    setQuery(value)
    setOpen(true)
    setActive(value.trim() ? 0 : -1)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!items.length) return
      setOpen(true)
      const dir = e.key === 'ArrowDown' ? 1 : -1
      setActive((i) => (i + dir + items.length + (i === -1 && dir === -1 ? 0 : 0)) % items.length)
    } else if (e.key === 'Escape') {
      if (open && items.length) setOpen(false)
      else setQuery('')
    } else if (e.key === 'Enter') {
      e.preventDefault()
      submit(e.ctrlKey || e.metaKey)
    }
  }

  function submit(newTab: boolean) {
    const item = items[activeIndex]
    if (item) return item.run(newTab)
    // Nada selecionado (campo vazio): não faz nada.
  }

  const Icon = calc !== null ? Calculator : urlHref ? Globe : shortcutMatch ? Zap : Search
  const showList = open && items.length > 0

  return (
    <div ref={wrapRef} className="relative z-30 mt-auto mb-10 w-full shrink-0 sm:max-w-[50dvw] lg:mb-15 xl:max-w-3xl" onBlur={(e) => !wrapRef.current?.contains(e.relatedTarget as Node) && (setOpen(false), setFocused(false))}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex h-11 items-center gap-2 rounded-lg bg-[#1d1d32] px-3 ring-1 ring-transparent transition-shadow duration-300 hover:shadow-[0_0_14px_rgb(120_108_159/0.35)] focus-within:shadow-[0_0_22px_rgb(120_108_159/0.6)] focus-within:ring-secondary"
      >
        <Icon className="text-secondary shrink-0" size={20} aria-hidden />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls="search-list"
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
          className="placeholder:text-secondary/60 w-full min-w-0 bg-transparent text-white focus:outline-none"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setOpen(true)
            setFocused(true)
          }}
          onKeyDown={onKeyDown}
          placeholder={`Pesquisar no ${engine.name} ou digitar endereço...`}
        />
        {copied && <span className="text-secondary shrink-0 text-xs">Copiado!</span>}
        {query ? (
          <button type="button" className="text-secondary cursor-pointer" aria-label="Limpar" onClick={() => (onChange(''), inputRef.current?.focus())}>
            <X size={18} />
          </button>
        ) : (
          !focused && <kbd className="border-secondary/40 text-secondary hidden shrink-0 rounded border px-1.5 text-xs sm:block">/</kbd>
        )}
      </form>

      {showList && (
        <ul id="search-list" role="listbox" className="absolute top-full right-0 left-0 mt-2 max-h-[60dvh] overflow-y-auto rounded-lg bg-[#1d1d32] py-1 shadow-[0_8px_30px_rgb(0_0_0/0.5)]">
          {!q && <li className="text-secondary/70 px-3 py-1 text-xs">Pesquisas recentes</li>}
          {items.map((item, i) => (
            <li
              key={item.key}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={(e) => e.preventDefault()}
              onMouseMove={() => setActive(i)}
              onClick={(e) => item.run(e.ctrlKey || e.metaKey)}
              className={`flex cursor-pointer items-center gap-3 px-3 py-2 text-white ${i === activeIndex ? 'bg-secondary/30' : ''}`}
            >
              <span className="text-secondary flex w-8 shrink-0 justify-center">
                {item.card ? (
                  <span className="block aspect-3/2 w-8 overflow-hidden rounded-sm">
                    <CardArt art={item.card.art} name={item.card.name} />
                  </span>
                ) : item.kind === 'history' ? (
                  <Clock size={16} />
                ) : item.kind === 'remote' ? (
                  <TrendingUp size={16} />
                ) : item.kind === 'calc' ? (
                  <Calculator size={16} />
                ) : item.kind === 'url' ? (
                  <Globe size={16} />
                ) : item.kind === 'shortcut' ? (
                  <Zap size={16} />
                ) : (
                  <Search size={16} />
                )}
              </span>
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.hint && <span className="text-secondary hidden shrink-0 text-xs sm:block">{item.hint}</span>}
              {item.removable && (
                <button
                  type="button"
                  aria-label="Remover do histórico"
                  className="text-secondary shrink-0 cursor-pointer opacity-60 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveHistory(item.removable!)
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
