'use client'

import { getTheme, type FxId } from '@/lib/theme'
import { type ISourceOptions } from '@tsparticles/engine'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { useEffect, useMemo, useState } from 'react'
import { useTheme } from '../theme/ThemeProvider'
import MatrixRain from './MatrixRain'

interface LiProps {
  className?: string
}

type Drift = { dir: 'bottom' | 'top' | 'bottom-right' | 'none'; speed: number }

/** Partículas de cada efeito. `matrix` e `none` não usam tsparticles. */
function particlesFor(fx: FxId): ISourceOptions | null {
  const base = (o: {
    count: number
    colors: string[]
    size: [number, number]
    opacity: [number, number]
    drift: Drift
    shape?: 'circle' | 'square'
    twinkle?: boolean
  }): ISourceOptions => ({
    background: { color: 'transparent' },
    fpsLimit: 40,
    particles: {
      number: { value: o.count },
      shape: { type: o.shape ?? 'circle' },
      size: { value: { min: o.size[0], max: o.size[1] } },
      color: { value: o.colors },
      move: { enable: o.drift.dir !== 'none', speed: o.drift.speed, direction: o.drift.dir, straight: false, outModes: { default: 'out' } },
      opacity: { value: { min: o.opacity[0], max: o.opacity[1] }, animation: { enable: o.twinkle ?? true, speed: 1, sync: false } },
    },
  })

  switch (fx) {
    case 'stars':
      return base({ count: 600, colors: ['#f9b621', '#7b92c2', '#fff', '#fff', '#fff', '#fff'], size: [0.5, 2], opacity: [0, 0.5], drift: { dir: 'bottom', speed: 0.1 } })
    case 'pixelstars':
      return base({ count: 90, colors: ['#ffe8c2', '#ff9f1c', '#ffffff', '#ff5d73'], size: [2, 4], opacity: [0.2, 1], drift: { dir: 'none', speed: 0 }, shape: 'square' })
    case 'snow':
      return base({ count: 130, colors: ['#ffffff', '#e8f4ff'], size: [1, 4], opacity: [0.4, 0.9], drift: { dir: 'bottom', speed: 1.2 }, twinkle: false })
    case 'sakura':
      return base({ count: 45, colors: ['#ffb7c5', '#ff9ab3', '#ffd1dc'], size: [3, 7], opacity: [0.5, 0.9], drift: { dir: 'bottom-right', speed: 1.1 }, twinkle: false })
    case 'leaves':
      return base({ count: 35, colors: ['#6b8f5a', '#a3b86c', '#c9a66b', '#8aa05a'], size: [3, 6], opacity: [0.35, 0.7], drift: { dir: 'bottom-right', speed: 0.8 }, twinkle: false })
    case 'bubbles':
      return base({ count: 40, colors: ['#aee6ff', '#ffffff'], size: [2, 9], opacity: [0.1, 0.4], drift: { dir: 'top', speed: 0.6 } })
    case 'zonai':
      return base({ count: 80, colors: ['#5ff2d6', '#a9fff0', '#e6c66a', '#f6e3a1', '#ffffff'], size: [0.8, 3.4], opacity: [0.1, 0.9], drift: { dir: 'top', speed: 0.35 } })
    case 'embers':
      return base({ count: 70, colors: ['#ff7a18', '#ffb347', '#ff4500'], size: [0.8, 3], opacity: [0.2, 0.9], drift: { dir: 'top', speed: 1 } })
    default:
      return null
  }
}

export default function Bg({ className }: LiProps) {
  const [init, setInit] = useState(false)
  const { theme, ready } = useTheme()
  const fx = ready ? getTheme(theme).fx : 'none'
  const options = useMemo(() => particlesFor(fx), [fx])

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setInit(true))
  }, [])

  return (
    <div className={`fixed top-0 left-0 -z-100 h-dvh w-dvw ${className ?? ''}`}>
      {fx === 'matrix' && <MatrixRain />}
      {init && options && <Particles key={fx} id="tsparticles" options={options} className="h-full w-full" />}
    </div>
  )
}
