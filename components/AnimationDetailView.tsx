'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowLeft, RotateCcw, Copy, Check, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { animations } from '@/data/animations'
import type { Animation } from '@/types'

gsap.registerPlugin(ScrollTrigger)

// ─── Types ────────────────────────────────────────────────────────────────────

interface Cfg {
  speed: number
  ease: string
  stagger: number
  delay: number
  repeat: number
  yoyo: boolean
  previewText: string
  triggerMode: 'load' | 'scroll'
  scrub: boolean
  scrubAmount: number
}

const DEF: Cfg = {
  speed: 1, ease: '', stagger: 0, delay: 0,
  repeat: 0, yoyo: false, previewText: '',
  triggerMode: 'load', scrub: false, scrubAmount: 1,
}

interface Props {
  slug: string
}

// ─── Colors ───────────────────────────────────────────────────────────────────

const CAT_COLOR: Record<string, string> = {
  fade: '#aaff3e', slide: '#ff9f3e', split: '#d03eef',
  scramble: '#00d9ff', typewriter: '#ffd060', clip: '#ff3e6e',
  blur: '#aacfff', scale: '#3effa8', wave: '#3e9fff',
  rotate: '#ff3eaa', glitch: '#ff3e3e', stagger: '#a8ff3e',
  bounce: '#ff873e', advanced: '#aaff3e',
}

const DIFF = { beginner: '★ Beginner', intermediate: '★★ Intermediate', advanced: '★★★ Advanced' }

// ─── GSAP Proxy ───────────────────────────────────────────────────────────────

function makeProxy(g: any, cfg: Cfg) {
  const apply = (vars: any) => {
    const r = { ...vars }
    if (r.duration !== undefined) r.duration = r.duration * cfg.speed
    if (cfg.ease) r.ease = cfg.ease
    if (cfg.stagger !== 0 && r.stagger !== undefined) {
      r.stagger = typeof r.stagger === 'number'
        ? cfg.stagger
        : { ...(r.stagger as object), each: cfg.stagger }
    }
    return r
  }

  const proxyTl = (tlVars: any = {}) => {
    const tl = g.timeline({
      ...tlVars,
      delay: (tlVars.delay ?? 0) + cfg.delay,
      defaults: apply({ duration: 0.5, ease: 'power2.out', ...(tlVars.defaults || {}) }),
    })
    const rTo = tl.to.bind(tl)
    const rFrom = tl.from.bind(tl)
    const rFromTo = tl.fromTo.bind(tl)
    tl.to = (t: any, v: any, p?: any) => rTo(t, apply(v), p)
    tl.from = (t: any, v: any, p?: any) => rFrom(t, apply(v), p)
    tl.fromTo = (t: any, fv: any, tv: any, p?: any) => rFromTo(t, fv, apply(tv), p)
    return tl
  }

  return {
    ...g,
    from:   (t: any, v: any) => g.from(t, { ...apply(v), delay: (v.delay ?? 0) + cfg.delay }),
    to:     (t: any, v: any) => g.to(t,   { ...apply(v), delay: (v.delay ?? 0) + cfg.delay }),
    fromTo: (t: any, fv: any, tv: any) => g.fromTo(t, fv, { ...apply(tv), delay: (tv.delay ?? 0) + cfg.delay }),
    set: g.set.bind(g),
    timeline: proxyTl,
    killTweensOf: g.killTweensOf.bind(g),
    utils: g.utils,
  }
}

// ─── Code Generator ───────────────────────────────────────────────────────────

function applyToCode(code: string, cfg: Cfg, tab: 'react' | 'vanilla' | 'webflow'): string {
  let out = code

  if (cfg.speed !== 1) {
    out = out.replace(/duration:\s*([\d.]+)/g, (_, n) => {
      const v = parseFloat(n) * cfg.speed
      return `duration: ${parseFloat(v.toFixed(2))}`
    })
  }

  if (cfg.ease) {
    out = out.replace(/ease:\s*'[^']*'/g, `ease: '${cfg.ease}'`)
  }

  if (cfg.stagger > 0) {
    out = out.replace(/(stagger:\s*)([\d.]+)/g, `$1${cfg.stagger}`)
    out = out.replace(/(each:\s*)([\d.]+)/g, `$1${cfg.stagger}`)
  }

  if (cfg.delay > 0) {
    out = out.replace(/(gsap\.(from|to|fromTo)\s*\([^,]+,\s*\{)/, `$1\n    delay: ${cfg.delay},`)
  }

  if (cfg.repeat !== 0) {
    const rs = cfg.yoyo ? `repeat: ${cfg.repeat}, yoyo: true,` : `repeat: ${cfg.repeat},`
    out = out.replace(/(gsap\.(from|to|fromTo)\s*\([^,]+,\s*\{)/, `$1\n    ${rs}`)
  }

  if (cfg.triggerMode === 'scroll') {
    const scrubLine = cfg.scrub ? `\n        scrub: ${cfg.scrubAmount},` : `\n        toggleActions: 'play none none reverse',`
    const stBlock = `\n    scrollTrigger: {\n        trigger: el,\n        start: 'top 80%',${scrubLine}\n      },`
    const scrollImport = tab === 'react'
      ? `import { ScrollTrigger } from 'gsap/ScrollTrigger'\n\ngsap.registerPlugin(ScrollTrigger)\n\n`
      : tab === 'vanilla'
      ? `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>\n`
      : `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>\n`

    if (tab === 'react') {
      out = out.replace(
        `import { gsap } from 'gsap'`,
        `import { gsap } from 'gsap'\nimport { ScrollTrigger } from 'gsap/ScrollTrigger'\n\ngsap.registerPlugin(ScrollTrigger)`
      )
    } else {
      out = out.replace(
        `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>`,
        `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>\n${scrollImport}`
      )
    }

    out = out.replace(/(gsap\.(from|to|fromTo)\s*\([^,]+,\s*\{)/, `$1${stBlock}`)
  }

  return out
}

// ─── Ease Options ─────────────────────────────────────────────────────────────

const EASE_GROUPS = [
  { g: 'Default', o: [{ v: '', l: '— keep original —' }] },
  { g: 'Linear', o: [{ v: 'none', l: 'none' }] },
  { g: 'Power', o: [
    { v: 'power1.out', l: 'power1.out' }, { v: 'power2.out', l: 'power2.out' },
    { v: 'power3.out', l: 'power3.out ✦' }, { v: 'power4.out', l: 'power4.out' },
    { v: 'power1.in', l: 'power1.in' }, { v: 'power2.in', l: 'power2.in' },
    { v: 'power3.in', l: 'power3.in' }, { v: 'power4.in', l: 'power4.in' },
    { v: 'power2.inOut', l: 'power2.inOut' }, { v: 'power3.inOut', l: 'power3.inOut' },
  ]},
  { g: 'Spring / Back', o: [
    { v: 'elastic.out(1, 0.4)', l: 'elastic.out(1, 0.4)' },
    { v: 'elastic.out(1.5, 0.3)', l: 'elastic.out(1.5, 0.3)' },
    { v: 'elastic.in(1, 0.4)', l: 'elastic.in(1, 0.4)' },
    { v: 'back.out(1.7)', l: 'back.out(1.7)' },
    { v: 'back.out(2.5)', l: 'back.out(2.5)' },
    { v: 'back.in(1.7)', l: 'back.in(1.7)' },
    { v: 'back.inOut', l: 'back.inOut' },
  ]},
  { g: 'Bounce', o: [
    { v: 'bounce.out', l: 'bounce.out' }, { v: 'bounce.in', l: 'bounce.in' },
  ]},
  { g: 'Sine', o: [
    { v: 'sine.out', l: 'sine.out' }, { v: 'sine.in', l: 'sine.in' },
    { v: 'sine.inOut', l: 'sine.inOut' },
  ]},
  { g: 'Expo / Circ', o: [
    { v: 'expo.out', l: 'expo.out' }, { v: 'expo.in', l: 'expo.in' },
    { v: 'circ.out', l: 'circ.out' }, { v: 'circ.in', l: 'circ.in' },
  ]},
]

// ─── Component ────────────────────────────────────────────────────────────────

export function AnimationDetailView({ slug }: Props) {
  const idx = animations.findIndex(a => a.slug === slug)
  const animation = animations[idx]
  const prev = idx > 0 ? { name: animations[idx - 1].name, slug: animations[idx - 1].slug } : null
  const next = idx < animations.length - 1 ? { name: animations[idx + 1].name, slug: animations[idx + 1].slug } : null
  const index = idx + 1
  const total = animations.length

  const [cfg, setCfg] = useState<Cfg>({ ...DEF, previewText: animation.previewText })
  const [tab, setTab] = useState<'react' | 'vanilla' | 'webflow'>('webflow')
  const [copied, setCopied] = useState(false)

  // Webflow: extract default attribute value from code, allow override
  const defaultAttr = (() => {
    const m = animation.webflowCode.match(/data-animate="([^"]+)"/)
    return m ? m[1] : animation.slug
  })()
  const [webflowAttr, setWebflowAttr] = useState(defaultAttr)

  const previewRef    = useRef<HTMLDivElement>(null)
  const originalHTML  = useRef('')
  const tweenRef      = useRef<any>(null)
  const scrollBoxRef  = useRef<HTMLDivElement>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstPlay     = useRef(true)

  const upd = useCallback((patch: Partial<Cfg>) => setCfg(c => ({ ...c, ...patch })), [])

  const killAll = useCallback(() => {
    if (tweenRef.current?.kill) tweenRef.current.kill()
    tweenRef.current = null
    ScrollTrigger.getAll().forEach(t => t.kill())
    const el = previewRef.current
    if (!el) return
    gsap.killTweensOf(el)
    el.querySelectorAll('*').forEach(c => gsap.killTweensOf(c))
    gsap.set(el, { clearProps: 'all' })
  }, [])

  const play = useCallback((c: Cfg) => {
    const el = previewRef.current
    if (!el) return
    killAll()
    el.innerHTML = originalHTML.current

    if (c.triggerMode === 'scroll') {
      const box = scrollBoxRef.current
      if (!box) return
      box.scrollTop = 0

      const proxy = makeProxy(gsap, { ...c, delay: 0 })

      // Wrap proxy so every tween/timeline is created paused.
      // This makes GSAP's immediateRender apply the "from" state instantly
      // (element hidden/offset) without playing — no visible jump when trigger fires.
      const pausedProxy = {
        ...proxy,
        from:     (t: any, v: any) => proxy.from(t, { ...v, paused: true }),
        to:       (t: any, v: any) => proxy.to(t,   { ...v, paused: true }),
        fromTo:   (t: any, fv: any, tv: any) => proxy.fromTo(t, fv, { ...tv, paused: true }),
        timeline: (vars?: any) => proxy.timeline({ ...(vars ?? {}), paused: true }),
      }

      const result = animation.animateFn(el, pausedProxy)
      tweenRef.current = result ?? null

      if (result) {
        if (typeof (result as any).repeat === 'function' && c.repeat !== 0) {
          (result as any).repeat(c.repeat).yoyo(c.yoyo)
        }
        ScrollTrigger.create({
          trigger: el,
          scroller: box,
          start: 'top 55%',
          animation: result as any,
          ...(c.scrub
            ? { end: 'bottom 30%', scrub: c.scrubAmount }
            : { toggleActions: 'play none none none', once: c.repeat === 0 }
          ),
        })
      } else {
        // Fallback for animations that don't return a tween
        ScrollTrigger.create({
          trigger: el,
          scroller: box,
          start: 'top 55%',
          once: c.repeat === 0,
          onEnter: () => {
            el.innerHTML = originalHTML.current
            const res = animation.animateFn(el, proxy)
            if (res && typeof (res as any).repeat === 'function' && c.repeat !== 0) {
              (res as any).repeat(c.repeat).yoyo(c.yoyo)
            }
            tweenRef.current = res ?? null
          },
        })
      }

      ScrollTrigger.refresh()
    } else {
      const proxy = makeProxy(gsap, c)
      const result = animation.animateFn(el, proxy)
      if (result && typeof (result as any).repeat === 'function' && c.repeat !== 0) {
        (result as any).repeat(c.repeat).yoyo(c.yoyo)
      }
      tweenRef.current = result ?? null
    }
  }, [animation, killAll])

  // Sync preview text changes
  useEffect(() => {
    const el = previewRef.current
    if (!el) return
    el.textContent = cfg.previewText || animation.previewText
    originalHTML.current = el.innerHTML
  }, [cfg.previewText, animation.previewText])

  // Init originalHTML + cleanup on unmount
  useEffect(() => {
    const el = previewRef.current
    if (el) originalHTML.current = el.innerHTML
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      killAll()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Single play trigger: 350ms on mount, 0ms for scroll mode (instant setup), 180ms debounce for other changes
  // previewText is included so editing the text replays the animation with the new content
  // (otherwise SplitText animations would keep showing the old split spans).
  const cfgKey = JSON.stringify(cfg)
  useEffect(() => {
    const delay = firstPlay.current ? 350 : cfg.triggerMode === 'scroll' ? 0 : 180
    firstPlay.current = false
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => play(cfg), delay)
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfgKey])

  const accent = CAT_COLOR[animation.category] ?? '#aaff3e'

  const rawCode = tab === 'react' ? animation.reactCode
    : tab === 'vanilla' ? animation.vanillaCode
    : animation.webflowCode

  const generatedCode = (() => {
    let c = applyToCode(rawCode, cfg, tab)
    if (tab === 'webflow' && webflowAttr !== defaultAttr) {
      c = c.replace(new RegExp(`data-animate="${defaultAttr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'), `data-animate="${webflowAttr}"`)
    }
    return c
  })()

  const isModified = cfg.speed !== 1 || cfg.ease !== '' || cfg.stagger !== 0 ||
    cfg.delay !== 0 || cfg.repeat !== 0 || cfg.triggerMode !== 'load'

  const copy = async () => {
    await navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const scrollPreviewContent = cfg.triggerMode === 'scroll' ? (
    <div ref={scrollBoxRef} className="detail-scroll-box">
      <div className="detail-scroll-hint">
        <svg width="16" height="16" fill="none" viewBox="0 0 16 16" style={{ opacity: 0.5 }}>
          <path d="M8 3v10M5 10l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        scroll to trigger
      </div>
      <div className="detail-scroll-spacer" />
      <div className="detail-scroll-stage">
        <div ref={previewRef} className="detail-preview-text" style={{ '--accent': accent } as React.CSSProperties}>
          {cfg.previewText || animation.previewText}
        </div>
      </div>
      <div className="detail-scroll-spacer" />
    </div>
  ) : (
    <div className="detail-load-stage">
      <div ref={previewRef} className="detail-preview-text" style={{ '--accent': accent } as React.CSSProperties}>
        {cfg.previewText || animation.previewText}
      </div>
    </div>
  )

  return (
    <div className="detail-wrap">
      {/* ─── Top Bar ─────────────────────────────────────────────────── */}
      <nav className="detail-topbar" style={{ '--accent': accent } as React.CSSProperties}>
        <Link href="/" className="detail-back">
          <span className="detail-back-arrow" aria-hidden="true">
            <ArrowLeft size={12} strokeWidth={2.4} />
          </span>
          <span>All Animations</span>
        </Link>

        <div className="detail-breadcrumb">
          <span className="detail-id">#{String(index).padStart(2, '0')}</span>
          <span className="detail-name">{animation.name}</span>
          <span className="detail-cat-badge" style={{ color: accent }}>{animation.category}</span>
          <span className="detail-diff-badge">{DIFF[animation.difficulty]}</span>
        </div>

        <div className="detail-nav-btns">
          {prev ? (
            <Link href={`/animations/${prev.slug}`} className="detail-nav-btn" title={prev.name}>
              <ChevronLeft size={14} />
            </Link>
          ) : (
            <span className="detail-nav-btn disabled"><ChevronLeft size={14} /></span>
          )}
          <span className="detail-nav-counter">{index} / {total}</span>
          {next ? (
            <Link href={`/animations/${next.slug}`} className="detail-nav-btn" title={next.name}>
              <ChevronRight size={14} />
            </Link>
          ) : (
            <span className="detail-nav-btn disabled"><ChevronRight size={14} /></span>
          )}
        </div>
      </nav>

      {/* ─── Main ─────────────────────────────────────────────────────── */}
      <div className="detail-body">

        {/* ── Preview Pane ──────────────────────────────── */}
        <div className="detail-preview-pane">
          <div
            className="detail-stage-wrap"
            style={{ '--accent': accent } as React.CSSProperties}
            onMouseEnter={cfg.triggerMode === 'load' ? () => play(cfg) : undefined}
          >
            {scrollPreviewContent}
          </div>

          <div className="detail-stage-footer">
            <div className="detail-tags">
              {animation.tags.slice(0, 5).map(t => (
                <span key={t} className="detail-tag">{t}</span>
              ))}
            </div>
            <button
              className="detail-replay-btn"
              onClick={() => play(cfg)}
              title="Replay"
            >
              <Play size={12} fill="currentColor" />
              Replay
            </button>
          </div>

          <p className="detail-desc">{animation.description}</p>
        </div>

        {/* ── Customizer Panel ──────────────────────────── */}
        <aside className="detail-cfg-panel">
          <div className="cfg-header">
            <span className="cfg-title">Customize</span>
            {isModified && (
              <button className="cfg-reset" onClick={() => setCfg({ ...DEF, previewText: cfg.previewText })}>
                <RotateCcw size={11} />
                Reset
              </button>
            )}
          </div>

          {/* Preview Text */}
          <div className="cfg-section">
            <label className="cfg-label">Preview Text</label>
            <input
              className="cfg-text-input"
              value={cfg.previewText}
              placeholder={animation.previewText}
              onChange={e => upd({ previewText: e.target.value })}
              maxLength={40}
            />
          </div>

          {/* Speed */}
          <div className="cfg-section">
            <label className="cfg-label">Speed</label>
            <div className="cfg-chips">
              {[
                { v: 0.25, l: '¼×' },
                { v: 0.5, l: '½×' },
                { v: 1, l: '1×' },
                { v: 1.5, l: '1.5×' },
                { v: 2, l: '2×' },
                { v: 3, l: '3×' },
              ].map(({ v, l }) => (
                <button
                  key={v}
                  className={`cfg-chip ${cfg.speed === v ? 'active' : ''}`}
                  onClick={() => upd({ speed: v })}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Ease */}
          <div className="cfg-section">
            <label className="cfg-label">Ease</label>
            <select
              className="cfg-select"
              value={cfg.ease}
              onChange={e => upd({ ease: e.target.value })}
            >
              {EASE_GROUPS.map(grp => (
                <optgroup key={grp.g} label={grp.g}>
                  {grp.o.map(o => (
                    <option key={o.v} value={o.v}>{o.l}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Stagger */}
          <div className="cfg-section">
            <label className="cfg-label">
              Stagger
              <span className="cfg-val">{cfg.stagger === 0 ? 'default' : `${cfg.stagger}s`}</span>
            </label>
            <input
              type="range"
              className="cfg-range"
              min={0} max={0.3} step={0.01}
              value={cfg.stagger}
              onChange={e => upd({ stagger: parseFloat(e.target.value) })}
              style={{ '--pct': `${(cfg.stagger / 0.3) * 100}%`, '--acc': accent } as React.CSSProperties}
            />
            <div className="cfg-range-labels"><span>default</span><span>0.3s</span></div>
          </div>

          {/* Delay */}
          <div className="cfg-section">
            <label className="cfg-label">
              Delay
              <span className="cfg-val">{cfg.delay === 0 ? 'none' : `${cfg.delay}s`}</span>
            </label>
            <input
              type="range"
              className="cfg-range"
              min={0} max={2} step={0.1}
              value={cfg.delay}
              onChange={e => upd({ delay: parseFloat(e.target.value) })}
              style={{ '--pct': `${(cfg.delay / 2) * 100}%`, '--acc': accent } as React.CSSProperties}
            />
            <div className="cfg-range-labels"><span>0s</span><span>2s</span></div>
          </div>

          {/* Repeat */}
          <div className="cfg-section">
            <label className="cfg-label">Repeat</label>
            <div className="cfg-chips">
              {[{ v: 0, l: 'None' }, { v: 1, l: 'Once' }, { v: 2, l: '2×' }, { v: -1, l: '∞ Loop' }].map(({ v, l }) => (
                <button
                  key={v}
                  className={`cfg-chip ${cfg.repeat === v ? 'active' : ''}`}
                  onClick={() => upd({ repeat: v })}
                >
                  {l}
                </button>
              ))}
            </div>
            {cfg.repeat !== 0 && (
              <label className="cfg-toggle-row">
                <input
                  type="checkbox"
                  className="cfg-checkbox"
                  checked={cfg.yoyo}
                  onChange={e => upd({ yoyo: e.target.checked })}
                />
                <span>Yoyo (reverse on repeat)</span>
              </label>
            )}
          </div>

          {/* Trigger */}
          <div className="cfg-section">
            <label className="cfg-label">Trigger Mode</label>
            <div className="cfg-chips cfg-chips-half">
              <button
                className={`cfg-chip ${cfg.triggerMode === 'load' ? 'active' : ''}`}
                onClick={() => upd({ triggerMode: 'load' })}
              >
                On Load
              </button>
              <button
                className={`cfg-chip ${cfg.triggerMode === 'scroll' ? 'active' : ''}`}
                onClick={() => upd({ triggerMode: 'scroll' })}
              >
                On Scroll
              </button>
            </div>
            {cfg.triggerMode === 'scroll' && (
              <div style={{ marginTop: 10 }}>
                <label className="cfg-toggle-row" style={{ marginBottom: 8 }}>
                  <input
                    type="checkbox"
                    className="cfg-checkbox"
                    checked={cfg.scrub}
                    onChange={e => upd({ scrub: e.target.checked })}
                  />
                  <span>Scrub (tie to scroll position)</span>
                </label>
                {cfg.scrub && (
                  <>
                    <label className="cfg-label" style={{ marginBottom: 4 }}>
                      Scrub Amount
                      <span className="cfg-val">{cfg.scrubAmount}</span>
                    </label>
                    <input
                      type="range"
                      className="cfg-range"
                      min={0.1} max={3} step={0.1}
                      value={cfg.scrubAmount}
                      onChange={e => upd({ scrubAmount: parseFloat(e.target.value) })}
                      style={{ '--pct': `${((cfg.scrubAmount - 0.1) / 2.9) * 100}%`, '--acc': accent } as React.CSSProperties}
                    />
                    <div className="cfg-range-labels"><span>snappy</span><span>smooth</span></div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Embedding steps — live in the side panel below all controls */}
          <div className="detail-embed-steps">
            <div className="detail-embed-title">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M6.5 6V9.5M6.5 4V4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              How to embed
            </div>
            {tab === 'react' && (
              <ol className="detail-embed-list">
                <li><strong>Install GSAP</strong><code>npm install gsap</code></li>
                <li><strong>Copy the code</strong> into a new <code>.tsx</code> file</li>
                <li><strong>Import</strong><code>{'import TextAnimation from \'./TextAnimation\''}</code></li>
                <li><strong>Drop into JSX</strong><code>{'<TextAnimation />'}</code></li>
                <li><strong>Customize</strong> — swap text or change the <code>h1</code> tag</li>
              </ol>
            )}
            {tab === 'vanilla' && (
              <ol className="detail-embed-list">
                <li><strong>Add the HTML</strong> — paste the <code>{'<h1>'}</code> into your page</li>
                <li><strong>Add scripts</strong> — paste both <code>{'<script>'}</code> tags before <code>{'</body>'}</code></li>
                <li><strong>No install needed</strong> — CDN loads GSAP automatically</li>
                <li><strong>Change selector</strong> — replace <code>.text-animate</code> to target any element</li>
                <li><strong>Multiple elements</strong> — shared class animates all matches</li>
              </ol>
            )}
            {tab === 'webflow' && (
              <ol className="detail-embed-list">
                <li><strong>Select element</strong> in the Webflow Designer</li>
                <li><strong>Element Settings</strong> → Custom Attributes</li>
                <li><strong>Add</strong> Name: <code>data-animate</code> · Value: <code>{webflowAttr}</code></li>
                <li><strong>Site Settings → Custom Code</strong> → paste script before <code>{'</body>'}</code></li>
                <li><strong>Publish</strong> — animation fires on page load</li>
                <li><strong>Repeat</strong> the attribute on as many elements as needed</li>
              </ol>
            )}
          </div>

        </aside>

        {/* ── Code Section — left column, row 2 ────────── */}
        <section className="detail-code-section">
        <div className="detail-code-header">
          <div className="detail-code-tabs">
            {[
              { k: 'react' as const, l: 'React', c: '#61dafb' },
              { k: 'vanilla' as const, l: 'Vanilla JS', c: '#f7df1e' },
              { k: 'webflow' as const, l: 'Webflow', c: '#4488ff' },
            ].map(t => (
              <button
                key={t.k}
                className={`detail-code-tab ${tab === t.k ? 'active' : ''}`}
                style={{ '--tab-c': t.c } as React.CSSProperties}
                onClick={() => setTab(t.k)}
              >
                {t.l}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isModified && (
              <span className="detail-modified-badge">customized</span>
            )}
            <button className="detail-copy-btn" onClick={copy}>
              {copied ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Webflow attribute name customizer */}
        {tab === 'webflow' && (
          <div className="detail-webflow-attr">
            <label className="detail-webflow-attr-label">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="3" width="10" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M4 6h4M4 6l1.5-1.5M4 6l1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Webflow attribute value
            </label>
            <div className="detail-webflow-attr-row">
              <span className="detail-webflow-attr-prefix">data-animate=</span>
              <input
                className="detail-webflow-attr-input"
                value={webflowAttr}
                onChange={e => setWebflowAttr(e.target.value.replace(/[^a-z0-9-_]/gi, '-').toLowerCase())}
                placeholder={defaultAttr}
                spellCheck={false}
              />
              {webflowAttr !== defaultAttr && (
                <button className="detail-webflow-attr-reset" onClick={() => setWebflowAttr(defaultAttr)} title="Reset">
                  Reset
                </button>
              )}
            </div>
            <p className="detail-webflow-attr-hint">
              Set this exact value on your Webflow element: <code>data-animate</code> → <code>{webflowAttr}</code>
            </p>
          </div>
        )}

        <pre className="detail-code-pre"><code>{generatedCode}</code></pre>
      </section>

      </div>
    </div>
  )
}
