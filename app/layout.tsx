import type { Metadata } from 'next'
import { Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google'
import './globals.css'

// Bricolage Grotesque — distinctive modern grotesque with subtle character.
// Used for both display (heavy weights 700/800) and body (400/500/600).
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const bricolageBody = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'GSAP Animation Library — 88 Text Reveals + 200 Animated Icons',
  description:
    'A curated library of GSAP text reveal animations and DrawSVG-animated icons. Copy-paste ready for React, Vanilla JS, and Webflow.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${bricolageBody.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  )
}
