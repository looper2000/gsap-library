'use client'
import Link from 'next/link'
import { X, Heart, Trash2, Download } from 'lucide-react'
import type { Animation, Icon } from '@/types'

export type WishlistEntry =
  | { kind: 'text'; id: string; data: Animation }
  | { kind: 'icon'; id: string; data: Icon }

interface Props {
  open: boolean
  onClose: () => void
  items: WishlistEntry[]
  onRemove: (id: string) => void
  onClear: () => void
}

export function WishlistPanel({ open, onClose, items, onRemove, onClear }: Props) {
  const exportList = () => {
    const text = items.map(it => `${it.kind.toUpperCase()} · ${it.data.name} (${it.data.category})`).join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'gsap-wishlist.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      {open && <div className="panel-backdrop" onClick={onClose} />}

      <div className={`wish-panel ${open ? 'open' : ''}`}>
        <div className="wish-panel-header">
          <div className="wish-panel-title">
            <Heart size={16} fill="currentColor" style={{ color: '#ff4466' }} />
            <span>Wishlist</span>
            {items.length > 0 && (
              <span className="wish-count-badge">{items.length}</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {items.length > 0 && (
              <>
                <button className="wish-action-btn" onClick={exportList} title="Export list">
                  <Download size={14} />
                </button>
                <button className="wish-action-btn" onClick={onClear} title="Clear all">
                  <Trash2 size={14} />
                </button>
              </>
            )}
            <button className="wish-close-btn" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="wish-panel-body">
          {items.length === 0 ? (
            <div className="wish-empty">
              <Heart size={32} strokeWidth={1} style={{ opacity: 0.2 }} />
              <p>No saved items yet.</p>
              <p style={{ fontSize: '12px', opacity: 0.5 }}>Click the heart on any card.</p>
            </div>
          ) : (
            <ul className="wish-list">
              {items.map(it => {
                const href = it.kind === 'text' ? `/animations/${it.data.slug}` : `/icons/${it.data.slug}`
                return (
                  <li key={it.id} className="wish-item">
                    <Link href={href} className="wish-item-link" onClick={onClose}>
                      <div className="wish-item-name-row">
                        <span className={`wish-item-pill wish-item-pill-${it.kind}`}>
                          {it.kind === 'text' ? 'TEXT' : 'ICON'}
                        </span>
                        <span className="wish-item-name">{it.data.name}</span>
                      </div>
                      <div className="wish-item-cat">{it.data.category} · {it.data.difficulty}</div>
                    </Link>
                    <button
                      className="wish-remove-btn"
                      onClick={() => onRemove(it.id)}
                      title="Remove"
                    >
                      <X size={12} />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
