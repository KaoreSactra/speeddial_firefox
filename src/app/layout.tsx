import { Bg } from '@/components'
import ThemeProvider from '@/components/theme/ThemeProvider'
import { THEME_INIT_SCRIPT } from '@/lib/theme'
import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Caveat, Creepster, Orbitron, Press_Start_2P, Rajdhani, Space_Grotesk, VT323 } from 'next/font/google'

// Fontes dos temas: carregam só quando o tema que as usa está ativo (preload desligado).
const hud = Rajdhani({ subsets: ['latin'], display: 'swap', preload: false, weight: ['500', '600', '700'], variable: '--font-hud' })
const vt = VT323({ subsets: ['latin'], display: 'swap', preload: false, weight: '400', variable: '--font-vt' })
const pixel = Press_Start_2P({ subsets: ['latin'], display: 'swap', preload: false, weight: '400', variable: '--font-pixel' })
const hand = Caveat({ subsets: ['latin'], display: 'swap', preload: false, weight: ['500', '700'], variable: '--font-hand' })
const grot = Space_Grotesk({ subsets: ['latin'], display: 'swap', preload: false, weight: ['500', '700'], variable: '--font-grot' })
const orb = Orbitron({ subsets: ['latin'], display: 'swap', preload: false, weight: ['500', '700'], variable: '--font-orb' })
const creep = Creepster({ subsets: ['latin'], display: 'swap', preload: false, weight: '400', variable: '--font-creep' })
const fontVars = [hud, vt, pixel, hand, grot, orb, creep].map((f) => f.variable).join(' ')

export const metadata: Metadata = {
  title: 'Aba Inicial',
  description: 'by Gus_Sactra',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={fontVars} data-theme="default-dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-display overflow-hidden text-nowrap select-none">
        <ThemeProvider>
          <Bg />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
