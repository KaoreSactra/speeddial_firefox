import type { CardArt as CardArtData } from '@/lib/cards'

/** Renderiza a "capa" do card. Ponto de extensão para padrões vetoriais (SVG). */
export default function CardArt({ art, name }: { art: CardArtData; name: string }) {
  switch (art.type) {
    case 'image':
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={art.src} alt={name} className="pointer-events-none h-full w-full rounded-[inherit] object-cover select-none" draggable={false} referrerPolicy="no-referrer" />
    case 'solid':
      return (
        <div
          className="pointer-events-none flex h-full w-full items-center justify-center rounded-[inherit] p-3 text-center text-xl font-bold text-white select-none"
          style={{ background: art.color2 ? `linear-gradient(135deg, ${art.color}, ${art.color2})` : art.color }}
        >
          <span className="max-w-full truncate drop-shadow">{name}</span>
        </div>
      )
  }
}
