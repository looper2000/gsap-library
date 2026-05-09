'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import { Heart } from 'lucide-react'
import { gsap } from 'gsap'
import { animations } from '@/data/animations'
import { icons } from '@/data/icons'
import { AnimationCard } from '@/components/AnimationCard'
import { FilterBar, type CategoryOption } from '@/components/FilterBar'
import { WishlistPanel, type WishlistEntry } from '@/components/WishlistPanel'
import { TabNav } from '@/components/TabNav'
import { useWishlist } from '@/hooks/useWishlist'

const TEXT_CAT_ORDER = ['fade','slide','split','scramble','typewriter','clip','blur','scale','wave','rotate','glitch','stagger','bounce','advanced']

const TEXT_CATEGORIES: CategoryOption[] = [
  { key: 'all',        label: 'All' },
  { key: 'fade',       label: 'Fade' },
  { key: 'slide',      label: 'Slide' },
  { key: 'split',      label: 'Split' },
  { key: 'scramble',   label: 'Scramble' },
  { key: 'typewriter', label: 'Typewriter' },
  { key: 'clip',       label: 'Clip' },
  { key: 'blur',       label: 'Blur' },
  { key: 'scale',      label: 'Scale' },
  { key: 'wave',       label: 'Wave' },
  { key: 'rotate',     label: 'Rotate' },
  { key: 'glitch',     label: 'Glitch' },
  { key: 'bounce',     label: 'Bounce' },
  { key: 'advanced',   label: 'Advanced' },
]

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [wishlistOnly, setWishlistOnly] = useState(false)
  const [groupByCategory, setGroupByCategory] = useState(false)

  const { wishlist, toggle, has, clear } = useWishlist()
  const illusRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out' } })

      tl.from(illusRef.current, { opacity: 0, duration: 0.4 })
      tl.from('.illus-bg', { opacity: 0, duration: 0.7 }, '<0.1')
      tl.from('.illus-section-label', { opacity: 0, duration: 0.6 }, '<')
      tl.from('.illus-baseline', { scaleX: 0, transformOrigin: 'left center', duration: 0.7 }, '<0.1')

      tl.from('.illus-letter', {
        opacity: 0,
        y: -55,
        filter: 'blur(8px)',
        duration: 0.85,
        stagger: 0.08,
      }, '-=0.3')

      tl.from('.illus-drop', { opacity: 0, scaleY: 0, transformOrigin: 'bottom', duration: 0.4, stagger: 0.08 }, '<+0.15')
      tl.from('.illus-dot', { opacity: 0, scale: 0, transformOrigin: 'center', duration: 0.4, stagger: 0.08 }, '<')
      tl.from('.illus-time-label', { opacity: 0, y: -6, duration: 0.4, stagger: 0.08 }, '<')

      tl.from('.illus-trajectory', { opacity: 0, duration: 0.7 }, '-=0.5')
      tl.from('.illus-glow', { opacity: 0, scale: 0.4, transformOrigin: '493px 134px', duration: 0.6 }, '-=0.5')
      tl.from('.illus-chart', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')
    }, illusRef)

    return () => ctx.revert()
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    const base = animations.filter(a => {
      const matchQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q)) ||
        a.category.toLowerCase().includes(q)
      const matchCat = category === 'all' || a.category === category
      const matchWish = !wishlistOnly || wishlist.includes(`text-${a.id}`)
      return matchQuery && matchCat && matchWish
    })
    return [...base].sort((a, b) => TEXT_CAT_ORDER.indexOf(a.category) - TEXT_CAT_ORDER.indexOf(b.category))
  }, [query, category, wishlistOnly, wishlist])

  const categoriesWithCount: CategoryOption[] = useMemo(() => {
    const counts: Record<string, number> = {}
    animations.forEach(a => { counts[a.category] = (counts[a.category] ?? 0) + 1 })
    return TEXT_CATEGORIES.map(c => ({
      ...c,
      count: c.key === 'all' ? animations.length : (counts[c.key] ?? 0),
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
      <header className="site-header">
        <div className="header-grid-bg" />

        {/* ── Illustration — frozen stagger-reveal of REVEAL ── */}
        <div className="header-illustration" aria-hidden="true" ref={illusRef}>
          <svg viewBox="0 0 560 230" xmlns="http://www.w3.org/2000/svg" className="header-illus-svg" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="hf-b1" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="3.2" />
              </filter>
              <filter id="hf-b2" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="1.8" />
              </filter>
              <filter id="hf-b3" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="0.7" />
              </filter>
              <radialGradient id="hf-glow" cx="50%" cy="55%" r="55%">
                <stop offset="0%" stopColor="#aaff3e" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#aaff3e" stopOpacity="0" />
              </radialGradient>
            </defs>

            <text className="illus-bg" x="2" y="17" fontSize="8" fontFamily="monospace" fill="white" opacity="0.045">
              gsap.from(el, &#123; opacity: 0, y: 40, stagger: 0.08, ease: &apos;power3.out&apos;, duration: 0.7 &#125;)
            </text>
            <text className="illus-bg" x="2" y="218" fontSize="8" fontFamily="monospace" fill="white" opacity="0.045">
              ScrollTrigger · SplitText · ScrambleText · Flip · Draggable · MotionPath
            </text>

            <text className="illus-section-label" x="280" y="34" fontSize="6.5" fontFamily="monospace" fill="white" opacity="0.14" textAnchor="middle" letterSpacing="3">STAGGER · FADE UP</text>

            <line className="illus-baseline" x1="0" y1="172" x2="560" y2="172" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="2 12" />

            <path className="illus-trajectory" d="M36,126 C90,118 160,148 222,153 S308,163 402,167 L493,172"
              stroke="rgba(170,255,62,0.11)" strokeWidth="1" fill="none" strokeDasharray="5 7" />

            <line className="illus-drop" x1="36"  y1="126" x2="36"  y2="172" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="2 5" />
            <line className="illus-drop" x1="128" y1="138" x2="128" y2="172" stroke="rgba(255,255,255,0.09)" strokeWidth="1" strokeDasharray="2 5" />
            <line className="illus-drop" x1="219" y1="150" x2="219" y2="172" stroke="rgba(255,255,255,0.11)" strokeWidth="1" strokeDasharray="2 5" />
            <line className="illus-drop" x1="309" y1="160" x2="309" y2="172" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="2 5" />
            <line className="illus-drop" x1="400" y1="166" x2="400" y2="172" stroke="rgba(255,255,255,0.19)" strokeWidth="1" strokeDasharray="2 5" />

            <text className="illus-letter" x="5"   y="126" fontSize="76" fontWeight="900" fontFamily="system-ui,sans-serif" fill="white" opacity="0.07" filter="url(#hf-b1)">R</text>
            <text className="illus-letter" x="96"  y="138" fontSize="76" fontWeight="900" fontFamily="system-ui,sans-serif" fill="white" opacity="0.14" filter="url(#hf-b2)">E</text>
            <text className="illus-letter" x="186" y="150" fontSize="76" fontWeight="900" fontFamily="system-ui,sans-serif" fill="white" opacity="0.28" filter="url(#hf-b3)">V</text>
            <text className="illus-letter" x="276" y="160" fontSize="76" fontWeight="900" fontFamily="system-ui,sans-serif" fill="white" opacity="0.50">E</text>
            <text className="illus-letter" x="367" y="166" fontSize="76" fontWeight="900" fontFamily="system-ui,sans-serif" fill="white" opacity="0.80">A</text>
            <ellipse className="illus-glow" cx="493" cy="134" rx="50" ry="50" fill="url(#hf-glow)">
              <animate attributeName="rx" values="50;60;50" dur="3s" repeatCount="indefinite" />
              <animate attributeName="ry" values="50;60;50" dur="3s" repeatCount="indefinite" />
            </ellipse>
            <text className="illus-letter" x="455" y="172" fontSize="76" fontWeight="900" fontFamily="system-ui,sans-serif" fill="#aaff3e" opacity="0.96">L</text>

            <text className="illus-time-label" x="36"  y="115" fontSize="6.5" fontFamily="monospace" fill="white" opacity="0.20" textAnchor="middle">0ms</text>
            <text className="illus-time-label" x="128" y="127" fontSize="6.5" fontFamily="monospace" fill="white" opacity="0.24" textAnchor="middle">80ms</text>
            <text className="illus-time-label" x="219" y="139" fontSize="6.5" fontFamily="monospace" fill="white" opacity="0.28" textAnchor="middle">160ms</text>
            <text className="illus-time-label" x="309" y="149" fontSize="6.5" fontFamily="monospace" fill="white" opacity="0.34" textAnchor="middle">240ms</text>
            <text className="illus-time-label" x="400" y="155" fontSize="6.5" fontFamily="monospace" fill="white" opacity="0.42" textAnchor="middle">320ms</text>
            <text className="illus-time-label" x="493" y="160" fontSize="6.5" fontFamily="monospace" fill="#aaff3e" opacity="0.65" textAnchor="middle">400ms</text>

            <circle className="illus-dot" cx="36"  cy="126" r="2"   fill="rgba(255,255,255,0.18)" />
            <circle className="illus-dot" cx="128" cy="138" r="2.2" fill="rgba(255,255,255,0.27)" />
            <circle className="illus-dot" cx="219" cy="150" r="2.5" fill="rgba(255,255,255,0.38)" />
            <circle className="illus-dot" cx="309" cy="160" r="2.8" fill="rgba(255,255,255,0.55)" />
            <circle className="illus-dot" cx="400" cy="166" r="3"   fill="rgba(255,255,255,0.72)" />
            <circle className="illus-dot" cx="493" cy="172" r="3.5" fill="#aaff3e" opacity="0.9">
              <animate attributeName="r" values="3.5;5;3.5" dur="3s" repeatCount="indefinite" />
            </circle>

            <g className="illus-chart" transform="translate(468, 180)">
              <rect x="0" y="0" width="86" height="46" rx="5" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
              <line x1="8" y1="38" x2="78" y2="38" stroke="rgba(255,255,255,0.13)" strokeWidth="0.7" />
              <line x1="8" y1="6"  x2="8"  y2="38" stroke="rgba(255,255,255,0.13)" strokeWidth="0.7" />
              <path d="M8,38 C14,38 16,8 78,6" stroke="#aaff3e" strokeWidth="1.5" fill="none" opacity="0.6" strokeLinecap="round" />
              <circle cx="78" cy="6"  r="1.5" fill="#aaff3e" opacity="0.7" />
              <circle cx="8"  cy="38" r="1.5" fill="rgba(255,255,255,0.4)" />
              <text x="43" y="44" fontSize="5.5" fontFamily="monospace" fill="rgba(255,255,255,0.3)" textAnchor="middle">power3.out</text>
            </g>
          </svg>
        </div>

        <div className="header-eyebrow">GSAP Text Library — Open Source</div>
        <h1 className="site-title">
          TEXT<br /><em>REVEAL</em>
        </h1>
        <p className="site-subtitle">
          Production-ready GSAP text animations. Copy one line. Paste anywhere.
          Works with React, Vanilla JS, and Webflow.
        </p>
        <div className="header-stats">
          <div className="stat">
            <span className="stat-num">{animations.length}</span>
            <span className="stat-label">animations</span>
          </div>
          <div className="stat">
            <span className="stat-num">3</span>
            <span className="stat-label">frameworks</span>
          </div>
          <div className="stat">
            <span className="stat-num">100%</span>
            <span className="stat-label">copy-paste ready</span>
          </div>
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
        total={animations.length}
        totalLabel="animations"
        wishlistOnly={wishlistOnly}
        onWishlistOnly={setWishlistOnly}
        wishlistCount={wishlist.length}
        groupByCategory={groupByCategory}
        onGroupByCategory={setGroupByCategory}
      />

      {/* ─── Grid ───────────────────────────────────────────────────────── */}
      <main className="main-content">
        {filtered.length === 0 ? (
          <div className="anim-grid">
            <div className="empty-state">
              <h3>No animations found</h3>
              <p>Try a different search term or category.</p>
            </div>
          </div>
        ) : !groupByCategory ? (
          <div className="anim-grid">
            {filtered.map(anim => (
              <AnimationCard
                key={anim.id}
                animation={anim}
                isWishlisted={has(`text-${anim.id}`)}
                onWishlist={() => toggle(`text-${anim.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="anim-groups">
            {TEXT_CAT_ORDER.filter(cat => filtered.some(a => a.category === cat)).map(cat => (
              <div key={cat} className="anim-group">
                <div className="anim-group-header">
                  <span className="anim-group-label">{cat}</span>
                  <span className="anim-group-count">{filtered.filter(a => a.category === cat).length}</span>
                </div>
                <div className="anim-grid">
                  {filtered.filter(a => a.category === cat).map(anim => (
                    <AnimationCard
                      key={anim.id}
                      animation={anim}
                      isWishlisted={has(`text-${anim.id}`)}
                      onWishlist={() => toggle(`text-${anim.id}`)}
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
        <span>GSAP Text Animations · MIT License</span>
        <div className="footer-links">
          <a href="https://gsap.com/docs/v3" target="_blank" rel="noopener noreferrer" className="footer-link">GSAP Docs</a>
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
