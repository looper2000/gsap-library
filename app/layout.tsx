import type { Metadata } from 'next'
import { Manrope, JetBrains_Mono } from 'next/font/google'
import './globals.css'

// Manrope — heavy modern grotesque (matches Ryze Designs visual language).
// Used for both display (heavy weights 700/800) and body (400/500/600).
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const manropeBody = Manrope({
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
    <html lang="en" className={`${manrope.variable} ${manropeBody.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  )
}
