import '@/styles/globals.css'
import { Bg } from '@/components'
import type { Metadata } from 'next'

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
    <html lang="pt-br">
      <body className="font-display overflow-hidden bg-primary text-nowrap text-zinc-900 transition-all duration-300 select-none">
        <Bg/>
        {children}
      </body>
    </html>
  )
}
