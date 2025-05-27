'use client'

import { type ISourceOptions } from '@tsparticles/engine'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { useEffect, useMemo, useState } from 'react'

interface LiProps {
  className?: string
}

export default function Bg({ className }: LiProps) {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setInit(true))
  }, [])

  const options: ISourceOptions = useMemo(
    () => ({
      background: { color: 'transparent' },
      particles: {
        number: { value: 1300 },
        size: { value: { min: 0.5, max: 2 } },
        move: {
          enable: true,
          speed: 0.1,
          direction: 'bottom',
          outModes: { default: 'out' },
        },
        opacity: {
          value: { min: 0, max: 0.5 },
          animation: {
            enable: true,
            speed: 1,
            minimumValue: 0,
            sync: false,
          },
        },
        color: { value: ['#f9b621', '#7b92c2', '#fff', '#fff', '#fff', '#fff'] },
      },
    }),
    [],
  )

  return <div className={`fixed top-0 left-0 -z-100 h-dvh w-dvw ${className}`}>{init && <Particles id="tsparticles" options={options} className="h-full w-full" />}</div>
}
