'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { Heart, RefreshCw, Sliders } from 'lucide-react'
import type { Icon } from '@/types'
import { ensureDrawSVG } from '@/data/icons'

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: '★',
  intermediate: '★★',
  advanced: '★★★',
}

const CATEGORY_COLOR: Record<string, string> = {
  arrow: '#aaff3e',
  ui: '#00d9ff',
  shape: '#ffd060',
  media: '#ff3e6e',
  comm: '#d03eef',
  misc: '#ff9f3e',
  files: '#aacfff',
  social: '#ff64d4',
  edit: '#b8ff5e',
  shop: '#ff5e87',
  weather: '#5ec5ff',
}

interface Props {
  icon: Icon
  isWishlisted: boolean
  onWishlist: () => void
}

export function IconCard({ icon, isWishlisted, onWishlist }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<any>(null)
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const playAnimation = () => {
    const svg = svgRef.current
    if (!svg) return
    ensureDrawSVG()

    if (pendingTimer.current !== null) {
      clearTimeout(pendingTimer.current)
      pendingTimer.current = null
    }

    if (tweenRef.current?.kill) tweenRef.current.kill()
    tweenRef.current = null
    const paths = svg.querySelectorAll('path')
    gsap.killTweensOf(paths)
    gsap.set(paths, { clearProps: 'all' })

    tweenRef.current = icon.animateFn(svg, gsap)
  }

  useEffect(() => {
    const svg = svgRef.current
    const card = cardRef.current
    if (!svg || !card) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.unobserve(card)
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
      const paths = svg.querySelectorAll('path')
      gsap.killTweensOf(paths)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const accent = CATEGORY_COLOR[icon.category] ?? '#aaff3e'

  return (
    <div
      ref={cardRef}
      className="anim-card icon-card"
      style={{ '--card-accent': accent } as React.CSSProperties}
      onMouseEnter={playAnimation}
    >
      <Link
        href={`/icons/${icon.slug}`}
        className="card-stretch-link"
        aria-label={`View ${icon.name}`}
        tabIndex={-1}
      />

      <div className="anim-preview icon-preview">
        <svg
          ref={svgRef}
          className="icon-preview-svg"
          viewBox={icon.viewBox}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icon.paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>
        <button
          className="replay-btn"
          onClick={e => { e.stopPropagation(); playAnimation() }}
          title="Replay animation"
        >
          <RefreshCw size={12} />
        </button>
      </div>

      <div className="anim-meta">
        <div className="anim-meta-top">
          <div>
            <h3 className="anim-name">{icon.name}</h3>
            <p className="anim-desc">{icon.description}</p>
          </div>
          <button
            className={`wish-btn ${isWishlisted ? 'active' : ''}`}
            onClick={e => { e.stopPropagation(); onWishlist() }}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="anim-badges">
          <span className="badge badge-cat">{icon.category}</span>
          <span className="badge badge-diff">{DIFFICULTY_LABEL[icon.difficulty]} {icon.difficulty}</span>
        </div>
      </div>

      <div className="card-open-btn" aria-hidden>
        <Sliders size={11} />
        Customize &amp; View
      </div>
    </div>
  )
}
