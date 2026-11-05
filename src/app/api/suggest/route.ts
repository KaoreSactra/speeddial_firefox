import { NextRequest, NextResponse } from 'next/server'

// O navegador não pode chamar essas APIs direto (CORS), então a chamada passa por aqui.
const SOURCES: Record<string, (q: string) => string> = {
  google: (q) => `https://suggestqueries.google.com/complete/search?client=firefox&q=${q}`,
  youtube: (q) => `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${q}`,
  duckduckgo: (q) => `https://duckduckgo.com/ac/?type=list&q=${q}`,
  bing: (q) => `https://api.bing.com/osjson.aspx?query=${q}`,
  brave: (q) => `https://search.brave.com/api/suggest?q=${q}`,
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim().slice(0, 100) ?? ''
  const engine = req.nextUrl.searchParams.get('engine') ?? 'google'
  const source = SOURCES[engine]
  if (!q || !source) return NextResponse.json({ suggestions: [] })

  try {
    const res = await fetch(source(encodeURIComponent(q)), { signal: AbortSignal.timeout(2500), headers: { 'User-Agent': 'Mozilla/5.0' } })
    if (!res.ok) return NextResponse.json({ suggestions: [] })
    const data: unknown = await res.json()
    const list = Array.isArray(data) && Array.isArray(data[1]) ? data[1] : []
    const suggestions = list.filter((s): s is string => typeof s === 'string').slice(0, 8)
    return NextResponse.json({ suggestions }, { headers: { 'Cache-Control': 'public, s-maxage=300' } })
  } catch {
    return NextResponse.json({ suggestions: [] })
  }
}
