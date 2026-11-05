import { Bg } from '@/components'
import ThemeProvider from '@/components/theme/ThemeProvider'
import { THEME_INIT_SCRIPT } from '@/lib/theme'
import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Rajdhani } from 'next/font/google'

const hud = Rajdhani({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-hud', display: 'swap' })

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
    <html lang="pt-BR" className={hud.variable} data-theme="default-dark" suppressHydrationWarning>
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
