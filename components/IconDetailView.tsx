'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowLeft, RotateCcw, Copy, Check, ChevronLeft, ChevronRight, Play, Code2 } from 'lucide-react'
import { icons, ensureDrawSVG } from '@/data/icons'

gsap.registerPlugin(ScrollTrigger)

// ─── Types ────────────────────────────────────────────────────────────────────

interface Cfg {
  speed: number
  ease: string
  stagger: number
  delay: number
  repeat: number
  yoyo: boolean
  triggerMode: 'load' | 'scroll'
  scrub: boolean
  scrubAmount: number
  strokeColor: string
  strokeWidth: number
  drawDirection: 'forward' | 'reverse'
}

// Note: strokeColor default is per-icon (the category accent) — set in component init.
const DEF_BASE: Omit<Cfg, 'strokeColor'> = {
  speed: 1, ease: '', stagger: 0, delay: 0,
  repeat: 0, yoyo: false,
  triggerMode: 'load', scrub: false, scrubAmount: 1,
  strokeWidth: 2,
  drawDirection: 'forward',
}

interface Props {
  slug: string
}

// ─── Colors ───────────────────────────────────────────────────────────────────

const CAT_COLOR: Record<string, string> = {
  arrow: '#aaff3e', ui: '#00d9ff', shape: '#ffd060', media: '#ff3e6e',
  comm: '#d03eef', misc: '#ff9f3e', files: '#aacfff',
  social: '#ff64d4', edit: '#b8ff5e', shop: '#ff5e87', weather: '#5ec5ff',
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
    // Reverse draw: swap drawSVG starting value
    if (cfg.drawDirection === 'reverse' && r.drawSVG !== undefined) {
      r.drawSVG = '100% 100%'
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

  if (cfg.drawDirection === 'reverse') {
    out = out.replace(/drawSVG:\s*0/, `drawSVG: '100% 100%'`)
  }

  if (cfg.strokeWidth !== 2) {
    out = out.replace(/stroke-width="2"/g, `stroke-width="${cfg.strokeWidth}"`)
    out = out.replace(/strokeWidth=\{2\}/g, `strokeWidth={${cfg.strokeWidth}}`)
  }

  if (cfg.triggerMode === 'scroll') {
    const scrubLine = cfg.scrub ? `\n        scrub: ${cfg.scrubAmount},` : `\n        toggleActions: 'play none none reverse',`
    const stBlock = `\n    scrollTrigger: {\n        trigger: el,\n        start: 'top 80%',${scrubLine}\n      },`

    if (tab === 'react') {
      out = out.replace(
        `import { gsap } from 'gsap'`,
        `import { gsap } from 'gsap'\nimport { ScrollTrigger } from 'gsap/ScrollTrigger'`
      )
      out = out.replace(
        /gsap\.registerPlugin\(([^)]+)\)/,
        `gsap.registerPlugin($1, ScrollTrigger)`
      )
    } else {
      const scrollImport = `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js"></script>\n`
      out = out.replace(
        `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js"></script>`,
        `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js"></script>\n${scrollImport}`
      )
      out = out.replace(/gsap\.registerPlugin\(([^)]+)\)/, `gsap.registerPlugin($1, ScrollTrigger)`)
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
    { v: 'power3.out', l: 'power3.out' }, { v: 'power4.out', l: 'power4.out' },
    { v: 'power2.inOut', l: 'power2.inOut ✦' }, { v: 'power3.inOut', l: 'power3.inOut' },
  ]},
  { g: 'Spring / Back', o: [
    { v: 'back.out(1.7)', l: 'back.out(1.7)' }, { v: 'back.out(2.5)', l: 'back.out(2.5)' },
    { v: 'elastic.out(1, 0.4)', l: 'elastic.out(1, 0.4)' },
  ]},
  { g: 'Sine / Expo', o: [
    { v: 'sine.inOut', l: 'sine.inOut' }, { v: 'expo.out', l: 'expo.out' }, { v: 'circ.out', l: 'circ.out' },
  ]},
]

// ─── Component ────────────────────────────────────────────────────────────────

export function IconDetailView({ slug }: Props) {
  const idx = icons.findIndex(i => i.slug === slug)
  const icon = icons[idx]
  const prev = idx > 0 ? { name: icons[idx - 1].name, slug: icons[idx - 1].slug } : null
  const next = idx < icons.length - 1 ? { name: icons[idx + 1].name, slug: icons[idx + 1].slug } : null
  const index = idx + 1
  const total = icons.length

  const accent = CAT_COLOR[icon.category] ?? '#aaff3e'
  const DEF: Cfg = { ...DEF_BASE, strokeColor: accent }

  const [cfg, setCfg] = useState<Cfg>({ ...DEF })
  const [tab, setTab] = useState<'react' | 'vanilla' | 'webflow'>('webflow')
  const [copied, setCopied] = useState(false)
  const [svgCopied, setSvgCopied] = useState(false)

  const svgRef = useRef<SVGSVGElement>(null)
  const tweenRef = useRef<any>(null)
  const scrollBoxRef = useRef<HTMLDivElement>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firstPlay = useRef(true)

  const upd = useCallback((patch: Partial<Cfg>) => setCfg(c => ({ ...c, ...patch })), [])

  const killAll = useCallback(() => {
    if (tweenRef.current?.kill) tweenRef.current.kill()
    tweenRef.current = null
    ScrollTrigger.getAll().forEach(t => t.kill())
    const svg = svgRef.current
    if (!svg) return
    const paths = svg.querySelectorAll('path')
    gsap.killTweensOf(paths)
    gsap.set(paths, { clearProps: 'all' })
  }, [])

  const play = useCallback((c: Cfg) => {
    const svg = svgRef.current
    if (!svg) return
    killAll()
    ensureDrawSVG()

    if (c.triggerMode === 'scroll') {
      const box = scrollBoxRef.current
      if (!box) return
      box.scrollTop = 0

      const proxy = makeProxy(gsap, { ...c, delay: 0 })
      const pausedProxy = {
        ...proxy,
        from:     (t: any, v: any) => proxy.from(t, { ...v, paused: true }),
        to:       (t: any, v: any) => proxy.to(t,   { ...v, paused: true }),
        fromTo:   (t: any, fv: any, tv: any) => proxy.fromTo(t, fv, { ...tv, paused: true }),
        timeline: (vars?: any) => proxy.timeline({ ...(vars ?? {}), paused: true }),
      }

      const result = icon.animateFn(svg, pausedProxy)
      tweenRef.current = result ?? null

      if (result) {
        if (typeof (result as any).repeat === 'function' && c.repeat !== 0) {
          (result as any).repeat(c.repeat).yoyo(c.yoyo)
        }
        ScrollTrigger.create({
          trigger: svg,
          scroller: box,
          start: 'top 55%',
          animation: result as any,
          ...(c.scrub
            ? { end: 'bottom 30%', scrub: c.scrubAmount }
            : { toggleActions: 'play none none none', once: c.repeat === 0 }
          ),
        })
      }

      ScrollTrigger.refresh()
    } else {
      const proxy = makeProxy(gsap, c)
      const result = icon.animateFn(svg, proxy)
      if (result && typeof (result as any).repeat === 'function' && c.repeat !== 0) {
        (result as any).repeat(c.repeat).yoyo(c.yoyo)
      }
      tweenRef.current = result ?? null
    }
  }, [icon, killAll])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      killAll()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Single play trigger
  const cfgKey = JSON.stringify(cfg)
  useEffect(() => {
    const delay = firstPlay.current ? 350 : cfg.triggerMode === 'scroll' ? 0 : 180
    firstPlay.current = false
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => play(cfg), delay)
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfgKey])

  const rawCode = tab === 'react' ? icon.reactCode
    : tab === 'vanilla' ? icon.vanillaCode
    : icon.webflowCode

  const generatedCode = applyToCode(rawCode, cfg, tab)

  const isModified = cfg.speed !== 1 || cfg.ease !== '' || cfg.stagger !== 0 ||
    cfg.delay !== 0 || cfg.repeat !== 0 || cfg.triggerMode !== 'load' ||
    cfg.strokeColor !== DEF.strokeColor || cfg.strokeWidth !== DEF.strokeWidth ||
    cfg.drawDirection !== 'forward'

  const copy = async () => {
    await navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  // Build raw SVG markup (no animation code) and copy it to the clipboard.
  // Uses the live customizer settings: stroke color, stroke width.
  const copySvg = async () => {
    const pathLines = icon.paths.map(d => `  <path d="${d}" />`).join('\n')
    const svgString = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="${icon.viewBox}"
  fill="none"
  stroke="${cfg.strokeColor}"
  stroke-width="${cfg.strokeWidth}"
  stroke-linecap="round"
  stroke-linejoin="round"
>
${pathLines}
</svg>`
    await navigator.clipboard.writeText(svgString)
    setSvgCopied(true)
    setTimeout(() => setSvgCopied(false), 1800)
  }

  // SVG markup driven by current cfg (stroke color + width)
  const svgEl = (
    <svg
      ref={svgRef}
      className="icon-detail-svg"
      viewBox={icon.viewBox}
      fill="none"
      stroke={cfg.strokeColor}
      strokeWidth={cfg.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icon.paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  )

  const stageContent = cfg.triggerMode === 'scroll' ? (
    <div ref={scrollBoxRef} className="detail-scroll-box">
      <div className="detail-scroll-hint">
        <svg width="16" height="16" fill="none" viewBox="0 0 16 16" style={{ opacity: 0.5 }}>
          <path d="M8 3v10M5 10l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        scroll to trigger
      </div>
      <div className="detail-scroll-spacer" />
      <div className="detail-scroll-stage icon-detail-stage">
        {svgEl}
      </div>
      <div className="detail-scroll-spacer" />
    </div>
  ) : (
    <div className="detail-load-stage icon-detail-stage">
      {svgEl}
    </div>
  )

  return (
    <div className="detail-wrap">
      <nav className="detail-topbar" style={{ '--accent': accent } as React.CSSProperties}>
        <Link href="/" className="detail-back">
          <span className="detail-back-arrow" aria-hidden="true">
            <ArrowLeft size={12} strokeWidth={2.4} />
          </span>
          <span>All Icons</span>
        </Link>

        <div className="detail-breadcrumb">
          <span className="detail-id">#{String(index).padStart(2, '0')}</span>
          <span className="detail-name">{icon.name}</span>
          <span className="detail-cat-badge" style={{ color: accent }}>{icon.category}</span>
          <span className="detail-diff-badge">{DIFF[icon.difficulty]}</span>
        </div>

        <div className="detail-nav-btns">
          {prev ? (
            <Link href={`/icons/${prev.slug}`} className="detail-nav-btn" title={prev.name}>
              <ChevronLeft size={14} />
            </Link>
          ) : (
            <span className="detail-nav-btn disabled"><ChevronLeft size={14} /></span>
          )}
          <span className="detail-nav-counter">{index} / {total}</span>
          {next ? (
            <Link href={`/icons/${next.slug}`} className="detail-nav-btn" title={next.name}>
              <ChevronRight size={14} />
            </Link>
          ) : (
            <span className="detail-nav-btn disabled"><ChevronRight size={14} /></span>
          )}
        </div>
      </nav>

      <div className="detail-body">
        <div className="detail-preview-pane">
          <div
            className="detail-stage-wrap"
            style={{ '--accent': accent } as React.CSSProperties}
            onMouseEnter={cfg.triggerMode === 'load' ? () => play(cfg) : undefined}
          >
            {stageContent}
          </div>

          <div className="detail-stage-footer">
            <div className="detail-tags">
              {icon.tags.slice(0, 5).map(t => (
                <span key={t} className="detail-tag">{t}</span>
              ))}
            </div>
            <div className="detail-stage-actions">
              <button
                className={`detail-svg-copy-btn ${svgCopied ? 'is-copied' : ''}`}
                onClick={copySvg}
                title="Copy raw SVG markup (no animation)"
              >
                {svgCopied ? <Check size={12} strokeWidth={2.5} /> : <Code2 size={12} />}
                {svgCopied ? 'Copied!' : 'Copy SVG'}
              </button>
              <button className="detail-replay-btn" onClick={() => play(cfg)} title="Replay">
                <Play size={12} fill="currentColor" />
                Replay
              </button>
            </div>
          </div>

          <p className="detail-desc">{icon.description}</p>
        </div>

        <aside className="detail-cfg-panel">
          <div className="cfg-header">
            <span className="cfg-title">Customize</span>
            {isModified && (
              <button className="cfg-reset" onClick={() => setCfg({ ...DEF })}>
                <RotateCcw size={11} />
                Reset
              </button>
            )}
          </div>

          {/* Stroke Color */}
          <div className="cfg-section">
            <label className="cfg-label">Stroke Color</label>
            <div className="cfg-color-row">
              <input
                type="color"
                className="cfg-color-input"
                value={cfg.strokeColor === 'currentColor' ? accent : cfg.strokeColor}
                disabled={cfg.strokeColor === 'currentColor'}
                onChange={e => upd({ strokeColor: e.target.value })}
              />
              <input
                type="text"
                className="cfg-text-input cfg-color-text"
                value={cfg.strokeColor}
                onChange={e => upd({ strokeColor: e.target.value })}
                spellCheck={false}
              />
            </div>
            <button
              className={`cfg-current-color-btn ${cfg.strokeColor === 'currentColor' ? 'active' : ''}`}
              onClick={() =>
                upd({ strokeColor: cfg.strokeColor === 'currentColor' ? accent : 'currentColor' })
              }
              title="Use CSS currentColor — inherits from parent text color"
            >
              <span className="cfg-current-color-swatch" aria-hidden="true" />
              {cfg.strokeColor === 'currentColor' ? 'Using currentColor' : 'Use currentColor'}
            </button>
          </div>

          {/* Stroke Width */}
          <div className="cfg-section">
            <label className="cfg-label">
              Stroke Width
              <span className="cfg-val">{cfg.strokeWidth}px</span>
            </label>
            <input
              type="range"
              className="cfg-range"
              min={0.5} max={4} step={0.5}
              value={cfg.strokeWidth}
              onChange={e => upd({ strokeWidth: parseFloat(e.target.value) })}
              style={{ '--pct': `${((cfg.strokeWidth - 0.5) / 3.5) * 100}%`, '--acc': accent } as React.CSSProperties}
            />
            <div className="cfg-range-labels"><span>0.5</span><span>4</span></div>
          </div>

          {/* Draw Direction */}
          <div className="cfg-section">
            <label className="cfg-label">Draw Direction</label>
            <div className="cfg-chips cfg-chips-half">
              <button
                className={`cfg-chip ${cfg.drawDirection === 'forward' ? 'active' : ''}`}
                onClick={() => upd({ drawDirection: 'forward' })}
              >
                Forward
              </button>
              <button
                className={`cfg-chip ${cfg.drawDirection === 'reverse' ? 'active' : ''}`}
                onClick={() => upd({ drawDirection: 'reverse' })}
              >
                Reverse
              </button>
            </div>
          </div>

          {/* Speed */}
          <div className="cfg-section">
            <label className="cfg-label">Speed</label>
            <div className="cfg-chips">
              {[
                { v: 0.25, l: '¼×' }, { v: 0.5, l: '½×' }, { v: 1, l: '1×' },
                { v: 1.5, l: '1.5×' }, { v: 2, l: '2×' }, { v: 3, l: '3×' },
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
            <select className="cfg-select" value={cfg.ease} onChange={e => upd({ ease: e.target.value })}>
              {EASE_GROUPS.map(grp => (
                <optgroup key={grp.g} label={grp.g}>
                  {grp.o.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
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
                <li><strong>Copy the component</strong> into a new <code>.tsx</code> file</li>
                <li><strong>Import & use</strong><code>{'<IconAnimation />'}</code></li>
                <li><strong>Customize</strong> — change stroke color, width, or paths</li>
              </ol>
            )}
            {tab === 'vanilla' && (
              <ol className="detail-embed-list">
                <li><strong>Add the SVG</strong> markup to your HTML</li>
                <li><strong>Add scripts</strong> — both <code>gsap</code> and <code>DrawSVGPlugin</code> CDNs</li>
                <li><strong>Match selector</strong> — replace <code>.icon-animate</code> if needed</li>
                <li><strong>Theme via CSS</strong> — <code>color: …</code> sets stroke (uses currentColor)</li>
              </ol>
            )}
            {tab === 'webflow' && (
              <ol className="detail-embed-list">
                <li><strong>Embed SVG</strong> in a Webflow Embed element with <code>data-icon</code></li>
                <li><strong>Site Settings → Custom Code</strong> → paste script before <code>{'</body>'}</code></li>
                <li><strong>Color via CSS</strong> — Webflow class with <code>color: ...</code> tints the icon</li>
                <li><strong>Publish</strong> — animation runs on page load</li>
              </ol>
            )}
          </div>
        </aside>

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
              {isModified && <span className="detail-modified-badge">customized</span>}
              <button className="detail-copy-btn" onClick={copy}>
                {copied ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <pre className="detail-code-pre"><code>{generatedCode}</code></pre>
        </section>
      </div>
    </div>
  )
}
