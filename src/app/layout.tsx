import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Aba Inicial",
  description: "by Gus Sactra",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  )
}
