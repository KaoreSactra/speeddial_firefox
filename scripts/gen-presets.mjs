// Gera src/json/presets.json a partir das pastas em public/img/containers/<pasta>/*.
// Para criar uma categoria nova: crie a pasta, coloque as imagens e rode `pnpm dev`/`pnpm build`
// (ou `pnpm presets`). Pastas listadas em IGNORE são puladas.
import { readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = 'public/img/containers'
const IGNORE = new Set(['old'])
const IMG = /\.(png|jpe?g|webp|gif|svg|avif)$/i

const pretty = (s) => s.replace(/[-_]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').trim()
const collator = new Intl.Collator('pt-BR', { numeric: true })

const folders = readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith('.') && !IGNORE.has(d.name))
  .map((d) => ({
    id: d.name,
    name: pretty(d.name).replace(/^./, (c) => c.toUpperCase()),
    images: readdirSync(join(ROOT, d.name))
      .filter((f) => IMG.test(f))
      .sort(collator.compare)
      .map((f) => ({ name: pretty(f.replace(IMG, '')), src: `/img/containers/${d.name}/${f}` })),
  }))
  .filter((f) => f.images.length)
  .sort((a, b) => collator.compare(a.name, b.name))

writeFileSync('src/json/presets.json', JSON.stringify(folders, null, 2) + '\n')
console.log(`presets: ${folders.map((f) => `${f.id} (${f.images.length})`).join(', ')}`)
