'use client'
import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import type { Animation } from '@/types'

type Tab = 'react' | 'vanilla' | 'webflow'

interface Props {
  animation: Animation
}

const TABS: { key: Tab; label: string; color: string }[] = [
  { key: 'react', label: 'React', color: '#61dafb' },
  { key: 'vanilla', label: 'Vanilla JS', color: '#f7df1e' },
  { key: 'webflow', label: 'Webflow', color: '#4488ff' },
]

export function CodeBlock({ animation }: Props) {
  const [tab, setTab] = useState<Tab>('react')
  const [copied, setCopied] = useState(false)

  const code =
    tab === 'react'
      ? animation.reactCode
      : tab === 'vanilla'
      ? animation.vanillaCode
      : animation.webflowCode

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="code-block">
      {/* Tab bar */}
      <div className="code-tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`code-tab ${tab === t.key ? 'active' : ''}`}
            style={tab === t.key ? { color: t.color } : {}}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
        <button className="copy-btn" onClick={copy} title="Copy code">
          {copied ? (
            <Check size={13} strokeWidth={2.5} />
          ) : (
            <Copy size={13} strokeWidth={2} />
          )}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>

      {/* Code */}
      <pre className="code-content">
        <code>{code}</code>
      </pre>
    </div>
  )
}
