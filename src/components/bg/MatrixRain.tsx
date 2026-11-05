'use client'
import { useEffect, useRef } from 'react'

const CHARS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789'

/** Chuva de caracteres estilo Matrix, desenhada em canvas. */
export default function MatrixRain() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const size = 16
    let drops: number[] = []

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
      drops = Array.from({ length: Math.ceil(canvas!.width / size) }, () => Math.random() * -50)
    }
    resize()
    window.addEventListener('resize', resize)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    function draw() {
      ctx!.fillStyle = 'rgba(0, 0, 0, 0.07)'
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)
      ctx!.font = `${size}px monospace`
      drops.forEach((y, i) => {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)]
        ctx!.fillStyle = Math.random() > 0.97 ? '#d8ffe2' : '#00c83a'
        ctx!.fillText(ch, i * size, y * size)
        drops[i] = y * size > canvas!.height && Math.random() > 0.975 ? 0 : y + 1
      })
    }
    const timer = setInterval(draw, reduced ? 400 : 55)
    return () => {
      clearInterval(timer)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="h-full w-full opacity-40" />
}
