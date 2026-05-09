'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Type, Shapes } from 'lucide-react'
import { animations } from '@/data/animations'
import { icons } from '@/data/icons'

export function TabNav() {
  const pathname = usePathname()
  const isText = pathname === '/'
  const isIcons = pathname === '/icons' || pathname.startsWith('/icons/')

  return (
    <nav className="content-tabs" aria-label="Section navigation">
      <Link
        href="/"
        className={`content-tab ${isText ? 'active' : ''}`}
        aria-current={isText ? 'page' : undefined}
      >
        <Type size={14} strokeWidth={2.2} />
        <span>Text Animations</span>
        <span className="content-tab-count">{animations.length}</span>
      </Link>
      <Link
        href="/icons"
        className={`content-tab ${isIcons ? 'active' : ''}`}
        aria-current={isIcons ? 'page' : undefined}
      >
        <Shapes size={14} strokeWidth={2.2} />
        <span>SVG Icons</span>
        <span className="content-tab-count">{icons.length}</span>
      </Link>
    </nav>
  )
}
