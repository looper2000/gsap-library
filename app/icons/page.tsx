'use client'
import { useState, useMemo } from 'react'
import { Heart } from 'lucide-react'
import { animations } from '@/data/animations'
import { icons } from '@/data/icons'
import { IconCard } from '@/components/IconCard'
import { FilterBar, type CategoryOption } from '@/components/FilterBar'
import { WishlistPanel, type WishlistEntry } from '@/components/WishlistPanel'
import { TabNav } from '@/components/TabNav'
import { PathEditor } from '@/components/PathEditor'
import { useWishlist } from '@/hooks/useWishlist'

const ICON_CAT_ORDER = ['arrow', 'ui', 'shape', 'media', 'comm', 'social', 'edit', 'files', 'shop', 'weather', 'misc']

const ICON_CATEGORIES: CategoryOption[] = [
  { key: 'all',     label: 'All' },
  { key: 'arrow',   label: 'Arrow' },
  { key: 'ui',      label: 'UI' },
  { key: 'shape',   label: 'Shape' },
  { key: 'media',   label: 'Media' },
  { key: 'comm',    label: 'Comm' },
  { key: 'social',  label: 'Social' },
  { key: 'edit',    label: 'Edit' },
  { key: 'files',   label: 'Files' },
  { key: 'shop',    label: 'Shop' },
  { key: 'weather', label: 'Weather' },
  { key: 'misc',    label: 'Misc' },
]

export default function IconsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [wishlistOnly, setWishlistOnly] = useState(false)
  const [groupByCategory, setGroupByCategory] = useState(false)

  const { wishlist, toggle, has, clear } = useWishlist()

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    const base = icons.filter(i => {
      const matchQuery =
        !q ||
        i.name.toLowerCase().includes(q) ||
        i.tags.some(t => t.toLowerCase().includes(q)) ||
        i.category.toLowerCase().includes(q)
      const matchCat = category === 'all' || i.category === category
      const matchWish = !wishlistOnly || wishlist.includes(`icon-${i.id}`)
      return matchQuery && matchCat && matchWish
    })
    return [...base].sort((a, b) => ICON_CAT_ORDER.indexOf(a.category) - ICON_CAT_ORDER.indexOf(b.category))
  }, [query, category, wishlistOnly, wishlist])

  const categoriesWithCount: CategoryOption[] = useMemo(() => {
    const counts: Record<string, number> = {}
    icons.forEach(i => { counts[i.category] = (counts[i.category] ?? 0) + 1 })
    return ICON_CATEGORIES.map(c => ({
      ...c,
      count: c.key === 'all' ? icons.length : (counts[c.key] ?? 0),
    }))
  }, [])

  const wishlistItems: WishlistEntry[] = useMemo(() => {
    return wishlist
      .map((id): WishlistEntry | null => {
        if (id.startsWith('text-')) {
          const n = parseInt(id.slice(5), 10)
          const a = animations.find(x => x.id === n)
          return a ? { kind: 'text', id, data: a } : null
        }
        if (id.startsWith('icon-')) {
          const n = parseInt(id.slice(5), 10)
          const i = icons.find(x => x.id === n)
          return i ? { kind: 'icon', id, data: i } : null
        }
        return null
      })
      .filter((x): x is WishlistEntry => x !== null)
  }, [wishlist])

  return (
    <div className="page-wrap">
      <TabNav />

      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <header className="site-header icons-header">
        <div className="header-grid-bg" />

        {/* ── Illustration — STAR drawing at six progress states ── */}
        <div className="header-eyebrow">GSAP DrawSVG — 200 Animated Icons</div>
        <h1 className="site-title">
          PATH<br /><em>DRAW</em>
        </h1>
        <p className="site-subtitle">
          Stroke-animated SVG icons powered by GSAP DrawSVG. Customize stroke color
          and width, copy raw SVG, or grab the React/Vanilla/Webflow code.
        </p>
        <div className="header-stats">
          <div className="stat">
            <span className="stat-num">{icons.length}</span>
            <span className="stat-label">icons</span>
          </div>
          <div className="stat">
            <span className="stat-num">{ICON_CAT_ORDER.length}</span>
            <span className="stat-label">categories</span>
          </div>
          <div className="stat">
            <span className="stat-num">100%</span>
            <span className="stat-label">copy-paste ready</span>
          </div>
        </div>

        {/* ── Interactive Path Editor — replaces the static side illustration ── */}
        <div className="icons-header-editor">
          <PathEditor compact />
        </div>
      </header>

      {/* ─── Filter Bar ─────────────────────────────────────────────────── */}
      <FilterBar
        categories={categoriesWithCount}
        query={query}
        onQuery={setQuery}
        category={category}
        onCategory={setCategory}
        count={filtered.length}
        total={icons.length}
        totalLabel="icons"
        searchPlaceholder="Search icons, tags, categories…"
        wishlistOnly={wishlistOnly}
        onWishlistOnly={setWishlistOnly}
        wishlistCount={wishlist.length}
        groupByCategory={groupByCategory}
        onGroupByCategory={setGroupByCategory}
      />

      {/* ─── Grid ───────────────────────────────────────────────────────── */}
      <main className="main-content">
        {filtered.length === 0 ? (
          <div className="icon-grid">
            <div className="empty-state">
              <h3>No icons found</h3>
              <p>Try a different search term or category.</p>
            </div>
          </div>
        ) : !groupByCategory ? (
          <div className="icon-grid">
            {filtered.map(icon => (
              <IconCard
                key={icon.id}
                icon={icon}
                isWishlisted={has(`icon-${icon.id}`)}
                onWishlist={() => toggle(`icon-${icon.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="anim-groups">
            {ICON_CAT_ORDER.filter(cat => filtered.some(i => i.category === cat)).map(cat => (
              <div key={cat} className="anim-group">
                <div className="anim-group-header">
                  <span className="anim-group-label">{cat}</span>
                  <span className="anim-group-count">{filtered.filter(i => i.category === cat).length}</span>
                </div>
                <div className="icon-grid">
                  {filtered.filter(i => i.category === cat).map(icon => (
                    <IconCard
                      key={icon.id}
                      icon={icon}
                      isWishlisted={has(`icon-${icon.id}`)}
                      onWishlist={() => toggle(`icon-${icon.id}`)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ─── Footer ─────────────────────────────────────────────────────── */}
      <footer className="site-footer">
        <span>GSAP SVG Icons · MIT License</span>
        <div className="footer-links">
          <a href="https://gsap.com/docs/v3/Plugins/DrawSVGPlugin/" target="_blank" rel="noopener noreferrer" className="footer-link">DrawSVG Docs</a>
          <a href="https://gsap.com/community/forums" target="_blank" rel="noopener noreferrer" className="footer-link">Community</a>
        </div>
      </footer>

      {/* ─── Wishlist FAB ───────────────────────────────────────────────── */}
      {wishlist.length > 0 && (
        <button className="wish-fab" onClick={() => setWishlistOpen(true)}>
          <Heart size={15} fill="currentColor" style={{ color: '#ff4466' }} />
          <span>Saved</span>
          <span className="wish-fab-badge">{wishlist.length}</span>
        </button>
      )}

      <WishlistPanel
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        items={wishlistItems}
        onRemove={toggle}
        onClear={clear}
      />
    </div>
  )
}
