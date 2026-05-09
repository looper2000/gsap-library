import type { Metadata } from 'next'
import { Fraunces, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'

// Display: Fraunces — variable serif with SOFT/OPSZ axes, gives the editorial
// design-studio feel (used for hero titles + emphasis)
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

// Body: DM Sans — clean modern grotesque, pairs well with Fraunces
const dmSans = DM_Sans({
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
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  )
}
