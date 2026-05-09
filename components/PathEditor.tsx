'use client'
import { useState, useRef, useMemo, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import { Play, RotateCcw, Code2, Check, Star, Heart, Hexagon, Circle } from 'lucide-react'
import { ensureDrawSVG } from '@/data/icons'

interface PathNode {
  x: number
  y: number
  cIn: { x: number; y: number }
  cOut: { x: number; y: number }
}

const VB = 400
const CX = 200
const CY = 200
const R_OUTER = 130
const R_INNER = 55
const HANDLE_LEN = 18

// Build a 5-point star with subtle bezier handles along each vertex's tangent.
// Initial handles are short (18px) so users can see them and grab them.
function buildStar(): PathNode[] {
  const positions: { x: number; y: number }[] = []
  for (let i = 0; i < 10; i++) {
    const angle = (i * 36 - 90) * (Math.PI / 180)
    const r = i % 2 === 0 ? R_OUTER : R_INNER
    positions.push({
      x: CX + r * Math.cos(angle),
      y: CY + r * Math.sin(angle),
    })
  }
  return positions.map((curr, i) => {
    const prev = positions[(i - 1 + 10) % 10]
    const next = positions[(i + 1) % 10]
    let tx = next.x - prev.x
    let ty = next.y - prev.y
    const len = Math.hypot(tx, ty) || 1
    tx /= len
    ty /= len
    return {
      x: curr.x,
      y: curr.y,
      cIn: { x: curr.x - tx * HANDLE_LEN, y: curr.y - ty * HANDLE_LEN },
      cOut: { x: curr.x + tx * HANDLE_LEN, y: curr.y + ty * HANDLE_LEN },
    }
  })
}

// Hexagon — 6 vertices on a circle with light tangent handles
function buildHexagon(): PathNode[] {
  const r = R_OUTER
  const positions: { x: number; y: number }[] = []
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 - 90) * (Math.PI / 180)
    positions.push({ x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) })
  }
  return positions.map((curr, i) => {
    const prev = positions[(i - 1 + 6) % 6]
    const next = positions[(i + 1) % 6]
    let tx = next.x - prev.x
    let ty = next.y - prev.y
    const len = Math.hypot(tx, ty) || 1
    tx /= len
    ty /= len
    return {
      x: curr.x,
      y: curr.y,
      cIn: { x: curr.x - tx * HANDLE_LEN, y: curr.y - ty * HANDLE_LEN },
      cOut: { x: curr.x + tx * HANDLE_LEN, y: curr.y + ty * HANDLE_LEN },
    }
  })
}

// Circle — 4 vertices at N/E/S/W with bezier handles using the kappa constant
// (0.5523) for a near-perfect cubic-bezier circle approximation.
function buildCircle(): PathNode[] {
  const r = R_OUTER
  const k = r * 0.5523
  return [
    // top
    { x: CX,     y: CY - r, cIn: { x: CX - k, y: CY - r }, cOut: { x: CX + k, y: CY - r } },
    // right
    { x: CX + r, y: CY,     cIn: { x: CX + r, y: CY - k }, cOut: { x: CX + r, y: CY + k } },
    // bottom
    { x: CX,     y: CY + r, cIn: { x: CX + k, y: CY + r }, cOut: { x: CX - k, y: CY + r } },
    // left
    { x: CX - r, y: CY,     cIn: { x: CX - r, y: CY + k }, cOut: { x: CX - r, y: CY - k } },
  ]
}

// Heart — 4-vertex cubic bezier heart, drawn clockwise from the top notch.
function buildHeart(): PathNode[] {
  return [
    // V0: top notch
    { x: 200, y: 170, cIn: { x: 130, y: 110 }, cOut: { x: 270, y: 110 } },
    // V1: right shoulder
    { x: 310, y: 220, cIn: { x: 310, y: 140 }, cOut: { x: 310, y: 290 } },
    // V2: bottom point
    { x: 200, y: 320, cIn: { x: 260, y: 320 }, cOut: { x: 140, y: 320 } },
    // V3: left shoulder
    { x: 90,  y: 220, cIn: { x: 90,  y: 290 }, cOut: { x: 90,  y: 140 } },
  ]
}

type ShapeId = 'star' | 'heart' | 'hexagon' | 'circle'

function buildShape(id: ShapeId): PathNode[] {
  switch (id) {
    case 'star':    return buildStar()
    case 'heart':   return buildHeart()
    case 'hexagon': return buildHexagon()
    case 'circle':  return buildCircle()
  }
}

const SHAPES: { id: ShapeId; label: string; Icon: typeof Star }[] = [
  { id: 'star',    label: 'Star',    Icon: Star },
  { id: 'heart',   label: 'Heart',   Icon: Heart },
  { id: 'hexagon', label: 'Hexagon', Icon: Hexagon },
  { id: 'circle',  label: 'Circle',  Icon: Circle },
]

function pathD(nodes: PathNode[]): string {
  if (nodes.length === 0) return ''
  const f = (n: number) => n.toFixed(2)
  let d = `M ${f(nodes[0].x)} ${f(nodes[0].y)}`
  for (let i = 1; i < nodes.length; i++) {
    const prev = nodes[i - 1]
    const curr = nodes[i]
    d += ` C ${f(prev.cOut.x)} ${f(prev.cOut.y)} ${f(curr.cIn.x)} ${f(curr.cIn.y)} ${f(curr.x)} ${f(curr.y)}`
  }
  const last = nodes[nodes.length - 1]
  const first = nodes[0]
  d += ` C ${f(last.cOut.x)} ${f(last.cOut.y)} ${f(first.cIn.x)} ${f(first.cIn.y)} ${f(first.x)} ${f(first.y)} Z`
  return d
}

type DragHandle = { type: 'anchor' | 'cIn' | 'cOut'; index: number }

interface Props {
  /** When true, strip the heavy card chrome — for embedding inside a hero column. */
  compact?: boolean
}

export function PathEditor({ compact = false }: Props = {}) {
  const [shape, setShape] = useState<ShapeId>('star')
  const [nodes, setNodes] = useState<PathNode[]>(() => buildShape('star'))
  const [drag, setDrag] = useState<DragHandle | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const tweenRef = useRef<any>(null)

  const d = useMemo(() => pathD(nodes), [nodes])

  const clientToSVG = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current
    if (!svg) return null
    const pt = svg.createSVGPoint()
    pt.x = clientX
    pt.y = clientY
    const ctm = svg.getScreenCTM()
    if (!ctm) return null
    return pt.matrixTransform(ctm.inverse())
  }, [])

  // Window-level drag tracking — keeps drag working even if pointer leaves the SVG
  useEffect(() => {
    if (!drag) return

    const onMove = (e: PointerEvent) => {
      e.preventDefault()
      const local = clientToSVG(e.clientX, e.clientY)
      if (!local) return
      // Clamp to viewBox so handles don't drift beyond the canvas
      const lx = Math.max(0, Math.min(VB, local.x))
      const ly = Math.max(0, Math.min(VB, local.y))
      setNodes(prev => prev.map((n, i) => {
        if (i !== drag.index) return n
        if (drag.type === 'anchor') {
          const dx = lx - n.x
          const dy = ly - n.y
          return {
            x: lx,
            y: ly,
            cIn: { x: n.cIn.x + dx, y: n.cIn.y + dy },
            cOut: { x: n.cOut.x + dx, y: n.cOut.y + dy },
          }
        }
        if (drag.type === 'cIn') return { ...n, cIn: { x: lx, y: ly } }
        return { ...n, cOut: { x: lx, y: ly } }
      }))
    }

    const onUp = () => setDrag(null)

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [drag, clientToSVG])

  const startDrag = (e: React.PointerEvent, type: DragHandle['type'], index: number) => {
    e.preventDefault()
    e.stopPropagation()
    setDrag({ type, index })
  }

  const play = () => {
    if (!pathRef.current) return
    if (tweenRef.current?.kill) tweenRef.current.kill()
    ensureDrawSVG()
    gsap.set(pathRef.current, { clearProps: 'all' })
    tweenRef.current = gsap.from(pathRef.current, {
      drawSVG: 0,
      duration: 1.2,
      ease: 'power2.inOut',
    })
  }

  const reset = () => {
    if (tweenRef.current?.kill) tweenRef.current.kill()
    if (pathRef.current) gsap.set(pathRef.current, { clearProps: 'all' })
    setNodes(buildShape(shape))
  }

  const switchShape = (id: ShapeId) => {
    if (tweenRef.current?.kill) tweenRef.current.kill()
    if (pathRef.current) gsap.set(pathRef.current, { clearProps: 'all' })
    setShape(id)
    setNodes(buildShape(id))
  }

  const copySvg = async () => {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VB} ${VB}" fill="none" stroke="#2929ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="${d}" />
</svg>`
    try {
      await navigator.clipboard.writeText(svgString)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  // Show handles for hovered/dragging anchor more prominently. All visible by default.
  return (
    <section className={`path-editor ${compact ? 'path-editor-compact' : ''}`}>
      {compact ? (
        <div className="path-editor-mini-label">
          <span className="path-editor-eyebrow">Path Playground</span>
          <span className="path-editor-mini-hint">
            <span className="path-editor-legend-dot path-editor-legend-anchor" aria-hidden />
            drag anchors
            <span className="path-editor-mini-sep">·</span>
            <span className="path-editor-legend-dot path-editor-legend-control" aria-hidden />
            bend handles
          </span>
        </div>
      ) : (
        <div className="path-editor-header">
          <span className="path-editor-eyebrow">Path Playground</span>
          <h2 className="path-editor-title">
            Sketch your own star, then <em>animate</em>
          </h2>
          <p className="path-editor-desc">
            Drag the
            <span className="path-editor-legend-dot path-editor-legend-anchor" aria-hidden />
            anchor squares to reshape. Drag the
            <span className="path-editor-legend-dot path-editor-legend-control" aria-hidden />
            bezier handles to bend the curves between them. Hit play to draw
            your custom path with GSAP DrawSVG.
          </p>
        </div>
      )}

      <div className="path-editor-stage">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB} ${VB}`}
          className="path-editor-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Path stroke (the result the user is editing) */}
          <path
            ref={pathRef}
            d={d}
            stroke="#2929ff"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Tangent guide lines */}
          {nodes.map((n, i) => (
            <g key={`l-${i}`} className="path-edit-tangent-group">
              <line
                x1={n.x} y1={n.y} x2={n.cIn.x} y2={n.cIn.y}
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="0.8"
                strokeDasharray="3 3"
              />
              <line
                x1={n.x} y1={n.y} x2={n.cOut.x} y2={n.cOut.y}
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="0.8"
                strokeDasharray="3 3"
              />
            </g>
          ))}

          {/* Control points (bezier handles) — circles */}
          {nodes.map((n, i) => (
            <g key={`c-${i}`}>
              <circle
                cx={n.cIn.x}
                cy={n.cIn.y}
                r={drag?.type === 'cIn' && drag.index === i ? 6.2 : 4.5}
                className="path-edit-control"
                onPointerDown={e => startDrag(e, 'cIn', i)}
              />
              <circle
                cx={n.cOut.x}
                cy={n.cOut.y}
                r={drag?.type === 'cOut' && drag.index === i ? 6.2 : 4.5}
                className="path-edit-control"
                onPointerDown={e => startDrag(e, 'cOut', i)}
              />
            </g>
          ))}

          {/* Anchor points — squares (drawn on top) */}
          {nodes.map((n, i) => {
            const size = (drag?.type === 'anchor' && drag.index === i) || hovered === i ? 14 : 11
            return (
              <rect
                key={`a-${i}`}
                x={n.x - size / 2}
                y={n.y - size / 2}
                width={size}
                height={size}
                rx="1.5"
                className="path-edit-anchor"
                onPointerDown={e => startDrag(e, 'anchor', i)}
                onPointerEnter={() => setHovered(i)}
                onPointerLeave={() => setHovered(null)}
              />
            )
          })}
        </svg>
      </div>

      <div className="path-editor-shapes" role="tablist" aria-label="Choose shape">
        <span className="path-editor-shapes-label">Shape</span>
        {SHAPES.map(s => (
          <button
            key={s.id}
            role="tab"
            aria-selected={shape === s.id}
            className={`path-editor-shape ${shape === s.id ? 'active' : ''}`}
            onClick={() => switchShape(s.id)}
            title={s.label}
          >
            <s.Icon size={14} strokeWidth={2} />
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      <div className="path-editor-actions">
        <button className="path-editor-play" onClick={play}>
          <Play size={14} fill="currentColor" />
          <span>Play Animation</span>
        </button>
        <button className="path-editor-action" onClick={reset} title="Reset to default star">
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
        <button
          className={`path-editor-action ${copied ? 'is-copied' : ''}`}
          onClick={copySvg}
          title="Copy raw SVG markup"
        >
          {copied ? <Check size={13} strokeWidth={2.5} /> : <Code2 size={13} />}
          <span>{copied ? 'Copied!' : 'Copy SVG'}</span>
        </button>
      </div>
    </section>
  )
}
