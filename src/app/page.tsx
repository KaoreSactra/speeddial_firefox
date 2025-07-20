'use client'
import containers from '@/json/containers.json'
import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const ALLOWED_DOMAINS = [
  'amazon.com.br',
  'chatgpt.com',
  'crunchyroll.com',
  'github.com',
  'gmail.com',
  'google.com',
  'instagram.com',
  'mercadolivre.com.br',
  'netflix.com',
  'pinterest.com',
  'primevideo.com',
  'youtube.com',
]

function isValidUrl(url: string) {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' && ALLOWED_DOMAINS.some((domain) => parsed.hostname.endsWith(domain))
  } catch {
    return false
  }
}

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

    let url = value

    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url
    }

    try {
      const parsed = new URL(url)
      if (parsed.hostname.includes('.')) {
        window.location.href = parsed.href
        return
      }
    } catch {}
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(value)}`
  }

  return (
    <main className="flex h-dvh w-dvw flex-col items-center justify-center px-[14dvw]">
      <form
        onSubmit={handleSearch}
        className="mb-15 flex h-[40px] w-[50dvw] items-center justify-between space-x-2 rounded-lg bg-[#1d1d32] p-2 transition duration-300 ease-in-out focus-within:scale-106 hover:scale-106"
      >
        <input ref={inputRef} type="text" className="text-secondary w-full opacity-100 focus:outline-none" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar..." />
        <button className="text-secondary cursor-pointer opacity-100" type="submit">
          <Search />
        </button>
      </form>
      <ul className="grid grid-cols-4 gap-10">
        {containers.map((item) => (
          <li
            key={item.id}
            className="shadow-custom bg-secondary flex aspect-[3/2] min-h-[100px] min-w-[150px] items-center justify-center rounded-lg transition duration-300 ease-in-out hover:scale-106"
          >
            {isValidUrl(item.url) ? (
              <a href={item.url} draggable="false">
                <img src={item.img} alt={item.name} className="pointer-events-none rounded-lg select-none" draggable="false" />
              </a>
            ) : (
              <span className="text-2xl text-black select-none">URL Inválida</span>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
