'use client'
import { CardGrid } from '@/components'
import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const value = search.trim()
    if (!value) return

    // Parece um endereço (sem espaços e com ponto)? Abre direto; senão pesquisa no Google.
    if (!/\s/.test(value)) {
      try {
        const parsed = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`)
        if (parsed.hostname.includes('.')) {
          window.location.href = parsed.href
          return
        }
      } catch {}
    }
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(value)}`
  }

  return (
    <main className="flex h-dvh w-dvw flex-col items-center justify-center overflow-y-auto px-[8dvw] py-6 lg:px-[14dvw]">
      <form
        onSubmit={handleSearch}
        className="mb-15 flex h-10 w-full max-w-[50dvw] min-w-60 shrink-0 items-center justify-between space-x-2 rounded-lg bg-[#1d1d32] p-2 transition duration-300 ease-in-out focus-within:scale-106 hover:scale-106"
      >
        <input ref={inputRef} type="text" className="text-secondary w-full opacity-100 focus:outline-none" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar..." />
        <button className="text-secondary cursor-pointer opacity-100" type="submit" aria-label="Pesquisar">
          <Search />
        </button>
      </form>
      <CardGrid />
    </main>
  )
}
