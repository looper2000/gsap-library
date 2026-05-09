'use client'
import { useState, useEffect, useCallback } from 'react'

const KEY = 'gsap-wishlist'

// Wishlist items are prefixed: 'text-{n}' for animations, 'icon-{n}' for icons.
// Legacy entries (plain numbers) are migrated to 'text-{n}' on first load.
export type WishlistId = `text-${number}` | `icon-${number}`

function migrate(parsed: unknown): string[] {
  if (!Array.isArray(parsed)) return []
  return parsed
    .map((v: unknown) => {
      if (typeof v === 'number') return `text-${v}`
      if (typeof v === 'string') return v
      return null
    })
    .filter((v): v is string => v !== null)
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        const migrated = migrate(parsed)
        setWishlist(migrated)
        // Persist the migrated form so legacy numbers don't keep coming back
        localStorage.setItem(KEY, JSON.stringify(migrated))
      }
    } catch {}
  }, [])

  const save = useCallback((ids: string[]) => {
    setWishlist(ids)
    try { localStorage.setItem(KEY, JSON.stringify(ids)) } catch {}
  }, [])

  const toggle = useCallback((id: string) => {
    setWishlist(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      try { localStorage.setItem(KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const has = useCallback((id: string) => wishlist.includes(id), [wishlist])

  const clear = useCallback(() => save([]), [save])

  return { wishlist, toggle, has, clear, count: wishlist.length }
}
