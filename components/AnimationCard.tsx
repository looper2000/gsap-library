'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { Heart, RefreshCw, Sliders } from 'lucide-react'
import type { Animation } from '@/types'

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: '★',
  intermediate: '★★',
  advanced: '★★★',
}

// Light-theme palette — deeper, more saturated values readable on cream bg
const CATEGORY_COLOR: Record<string, string> = {
  fade:       '#3a8a2e', // deep green
  slide:      '#cc6622', // terracotta
  split:      '#7b1fa2', // plum
  scramble:   '#0a7e91', // teal
  typewriter: '#b8861a', // mustard
  clip:       '#c2185b', // crimson
  blur:       '#3949ab', // indigo
  scale:      '#2e7d32', // leaf green
  wave:       '#1976d2', // ocean blue
  rotate:     '#d81b60', // hot pink
  glitch:     '#c62828', // brick red
  stagger:    '#558b2f', // olive
  bounce:     '#e65100', // burnt orange
  advanced:   '#ee5a3c', // coral (matches brand accent)
}

interface Props {
  animation: Animation
  isWishlisted: boolean
  onWishlist: () => void
}

export function AnimationCard({ animation, isWishlisted, onWishlist }: Props) {
  const previewRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const originalHTMLRef = useRef('')
  const tweenRef = useRef<any>(null)
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const playAnimation = () => {
    const el = previewRef.current
    if (!el) return

    // Cancel any queued auto-play — prevents the setTimeout race
    if (pendingTimer.current !== null) {
      clearTimeout(pendingTimer.current)
      pendingTimer.current = null
    }

    // Kill previous tween / rAF loop
    if (tweenRef.current?.kill) tweenRef.current.kill()
    tweenRef.current = null
    gsap.killTweensOf(el)
    Array.from(el.querySelectorAll('*')).forEach(c => gsap.killTweensOf(c))

    // Clear GSAP inline styles from el so from() captures the correct natural values
    gsap.set(el, { clearProps: 'all' })

    // Restore original markup (child spans are recreated clean)
    el.innerHTML = originalHTMLRef.current

    tweenRef.current = animation.animateFn(el, gsap)
  }

  useEffect(() => {
    const el = previewRef.current
    const card = cardRef.current
    if (!el || !card) return

    originalHTMLRef.current = el.innerHTML

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.unobserve(card) // fire once — re-entry won't restart
          pendingTimer.current = setTimeout(playAnimation, 150)
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(card)

    return () => {
      observer.disconnect()
      if (pendingTimer.current !== null) clearTimeout(pendingTimer.current)
      if (tweenRef.current?.kill) tweenRef.current.kill()
      gsap.killTweensOf(el)
      Array.from(el.querySelectorAll('*')).forEach(c => gsap.killTweensOf(c))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const accent = CATEGORY_COLOR[animation.category] ?? '#aaff3e'

  return (
    <div
      ref={cardRef}
      className="anim-card"
      style={{ '--card-accent': accent } as React.CSSProperties}
      onMouseEnter={playAnimation}
    >
      {/* Stretch link — covers the whole card */}
      <Link href={`/animations/${animation.slug}`} className="card-stretch-link" aria-label={`View ${animation.name}`} tabIndex={-1} />

      {/* Preview */}
      <div className="anim-preview">
        <div ref={previewRef} className="anim-preview-text">
          {animation.previewText}
        </div>
        <button
          className="replay-btn"
          onClick={e => { e.stopPropagation(); playAnimation() }}
          title="Replay animation"
        >
          <RefreshCw size={12} />
        </button>
      </div>

      {/* Meta */}
      <div className="anim-meta">
        <div className="anim-meta-top">
          <div>
            <h3 className="anim-name">{animation.name}</h3>
            <p className="anim-desc">{animation.description}</p>
          </div>
          <button
            className={`wish-btn ${isWishlisted ? 'active' : ''}`}
            onClick={e => { e.stopPropagation(); onWishlist() }}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Badges */}
        <div className="anim-badges">
          <span className="badge badge-cat">{animation.category}</span>
          <span className="badge badge-diff">{DIFFICULTY_LABEL[animation.difficulty]} {animation.difficulty}</span>
        </div>
      </div>

      {/* Visual bottom strip — decorative only, click handled by stretch link */}
      <div className="card-open-btn" aria-hidden>
        <Sliders size={11} />
        Customize &amp; View
      </div>
    </div>
  )
}
