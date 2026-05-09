import type { Animation } from '@/types'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { rc, vc, wc } from './_codegen'

// ─── SplitText helpers ────────────────────────────────────────────────────────
// Use the official GSAP SplitText plugin (free since v3.13). It handles emoji,
// RTL, accessibility (aria-label), and edge cases the manual splitter can't.
// Plugin is lazy-registered on first browser use to keep SSR safe.

let _splitRegistered = false
function _ensureSplit() {
  if (_splitRegistered || typeof window === 'undefined') return
  gsap.registerPlugin(SplitText)
  _splitRegistered = true
}

function splitChars(el: HTMLElement): HTMLElement[] {
  _ensureSplit()
  const split = SplitText.create(el, {
    type: 'words,chars',
    wordsClass: 'st-word',
    charsClass: 'st-char',
  })
  return split.chars as HTMLElement[]
}

function splitWords(el: HTMLElement): HTMLElement[] {
  _ensureSplit()
  const split = SplitText.create(el, { type: 'words', wordsClass: 'st-word' })
  return split.words as HTMLElement[]
}

// ─── Animations ──────────────────────────────────────────────────────────────

export const animations: Animation[] = [
  // ─── 1. FADE UP ───────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'Fade Up',
    slug: 'fade-up',
    category: 'fade',
    tags: ['fade', 'opacity', 'translate-y', 'simple'],
    difficulty: 'beginner',
    description: 'Classic opacity fade combined with vertical lift. The workhorse of all text reveals.',
    previewText: 'FADE UP',
    animateFn: (el, g: any) =>
      g.from(el, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }),
    reactCode: rc(
      `gsap.from(el, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' })`
    ),
    vanillaCode: vc(
      `gsap.from('.text-animate', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' })`
    ),
    webflowCode: wc(
      `gsap.from('[data-animate="fade-up"]', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' })`
    ),
  },

  // ─── 2. SLIDE IN LEFT ─────────────────────────────────────────────────────
  {
    id: 2,
    name: 'Slide In Left',
    slug: 'slide-in-left',
    category: 'slide',
    tags: ['slide', 'translate-x', 'horizontal', 'entrance'],
    difficulty: 'beginner',
    description: 'Text sweeps in from the left with a smooth power ease. Great for editorial headings.',
    previewText: 'SLIDE IN',
    animateFn: (el, g: any) =>
      g.from(el, { x: -80, opacity: 0, duration: 0.7, ease: 'power2.out' }),
    reactCode: rc(
      `gsap.from(el, { x: -80, opacity: 0, duration: 0.7, ease: 'power2.out' })`
    ),
    vanillaCode: vc(
      `gsap.from('.text-animate', { x: -80, opacity: 0, duration: 0.7, ease: 'power2.out' })`
    ),
    webflowCode: wc(
      `gsap.from('[data-animate="slide-left"]', { x: -80, opacity: 0, duration: 0.7, ease: 'power2.out' })`
    ),
  },

  // ─── 3. SPLIT CHARS STAGGER ───────────────────────────────────────────────
  {
    id: 3,
    name: 'Split Chars Stagger',
    slug: 'split-chars-stagger',
    category: 'split',
    tags: ['split', 'chars', 'stagger', 'back-ease'],
    difficulty: 'intermediate',
    description: 'Each character animates in with a staggered delay and a back-ease overshoot for kinetic energy.',
    previewText: 'CHARACTERS',
    animateFn: (el, g: any) => {
      const chars = splitChars(el)
      return g.from(chars, {
        y: 60,
        opacity: 0,
        duration: 0.5,
        stagger: 0.04,
        ease: 'back.out(1.7)',
      })
    },
    reactCode: rc(
      `const chars = SplitText.create(el, { type: 'chars' }).chars

gsap.from(chars, {
  y: 60,
  opacity: 0,
  duration: 0.5,
  stagger: 0.04,
  ease: 'back.out(1.7)',
})`
    ),
    vanillaCode: vc(
      `const chars = SplitText.create('.text-animate', { type: 'chars' }).chars

gsap.from(chars, {
  y: 60,
  opacity: 0,
  duration: 0.5,
  stagger: 0.04,
  ease: 'back.out(1.7)',
})`
    ),
    webflowCode: wc(
      `const chars = SplitText.create('[data-animate="split-chars"]', { type: 'chars' }).chars

gsap.from(chars, {
  y: 60,
  opacity: 0,
  duration: 0.5,
  stagger: 0.04,
  ease: 'back.out(1.7)',
})`
    ),
  },

  // ─── 4. TYPEWRITER ────────────────────────────────────────────────────────
  {
    id: 4,
    name: 'Typewriter',
    slug: 'typewriter',
    category: 'typewriter',
    tags: ['typewriter', 'chars', 'sequential', 'cursor'],
    difficulty: 'intermediate',
    description: 'Classic typewriter effect — characters appear one by one. Works with any monospace or proportional font.',
    previewText: 'TYPING...',
    animateFn: (el, g: any) => {
      const text = el.textContent || ''
      el.textContent = ''
      const tl = g.timeline()
      text.split('').forEach((char: string, i: number) => {
        tl.call(
          () => { el.textContent = text.slice(0, i + 1) },
          undefined,
          i * 0.08
        )
      })
      return tl
    },
    reactCode: rc(
      `const text = el.textContent || ''
el.textContent = ''
const tl = gsap.timeline()
text.split('').forEach((char, i) => {
  tl.call(
    () => { el.textContent = text.slice(0, i + 1) },
    undefined,
    i * 0.08
  )
})
return () => tl.kill()`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const text = el.textContent
el.textContent = ''
const tl = gsap.timeline()
text.split('').forEach((char, i) => {
  tl.call(() => { el.textContent = text.slice(0, i + 1) }, null, i * 0.08)
})`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="typewriter"]')
const text = el.textContent
el.textContent = ''
const tl = gsap.timeline()
text.split('').forEach((char, i) => {
  tl.call(() => { el.textContent = text.slice(0, i + 1) }, null, i * 0.08)
})`
    ),
  },

  // ─── 5. CLIP REVEAL ───────────────────────────────────────────────────────
  {
    id: 5,
    name: 'Clip Reveal',
    slug: 'clip-reveal',
    category: 'clip',
    tags: ['clip-path', 'reveal', 'wipe', 'horizontal'],
    difficulty: 'intermediate',
    description: 'Text wipes in from left to right using CSS clip-path. Crisp, cinematic reveal effect.',
    previewText: 'REVEAL',
    animateFn: (el, g: any) => {
      el.style.clipPath = 'inset(0 100% 0 0)'
      return g.to(el, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.85,
        ease: 'power3.inOut',
      })
    },
    reactCode: rc(
      `el.style.clipPath = 'inset(0 100% 0 0)'
gsap.to(el, {
  clipPath: 'inset(0 0% 0 0)',
  duration: 0.85,
  ease: 'power3.inOut',
})`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
el.style.clipPath = 'inset(0 100% 0 0)'
gsap.to(el, {
  clipPath: 'inset(0 0% 0 0)',
  duration: 0.85,
  ease: 'power3.inOut',
})`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="clip-reveal"]')
el.style.clipPath = 'inset(0 100% 0 0)'
gsap.to(el, {
  clipPath: 'inset(0 0% 0 0)',
  duration: 0.85,
  ease: 'power3.inOut',
})`
    ),
  },

  // ─── 6. SCRAMBLE TEXT ─────────────────────────────────────────────────────
  {
    id: 6,
    name: 'Scramble Text',
    slug: 'scramble-text',
    category: 'scramble',
    tags: ['scramble', 'random', 'chars', 'cyber'],
    difficulty: 'intermediate',
    description: 'Characters cycle through random glyphs before landing on the final text. No plugins needed.',
    previewText: 'SCRAMBLE',
    animateFn: (el, _g: any) => {
      const target = el.textContent || ''
      const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'
      let frame = 0
      const total = target.length * 8
      let rafId: number

      const tick = () => {
        el.textContent = target
          .split('')
          .map((char: string, i: number) => {
            if (char === ' ') return ' '
            if (i * 8 < frame) return char
            return pool[Math.floor(Math.random() * pool.length)]
          })
          .join('')
        frame++
        if (frame <= total) rafId = requestAnimationFrame(tick)
        else el.textContent = target
      }
      rafId = requestAnimationFrame(tick)
      return { kill() { cancelAnimationFrame(rafId) } }
    },
    reactCode: rc(
      `const target = el.textContent || ''
const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'
let frame = 0
const total = target.length * 8

const tick = () => {
  el.textContent = target.split('').map((char, i) => {
    if (char === ' ') return ' '
    if (i * 8 < frame) return char
    return pool[Math.floor(Math.random() * pool.length)]
  }).join('')
  frame++
  if (frame <= total) requestAnimationFrame(tick)
  else el.textContent = target
}
requestAnimationFrame(tick)

return () => { frame = total + 1 }`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const target = el.textContent
const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'
let frame = 0
const total = target.length * 8

function tick() {
  el.textContent = target.split('').map((char, i) => {
    if (char === ' ') return ' '
    if (i * 8 < frame) return char
    return pool[Math.floor(Math.random() * pool.length)]
  }).join('')
  frame++
  if (frame <= total) requestAnimationFrame(tick)
  else el.textContent = target
}
requestAnimationFrame(tick)`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="scramble"]')
const target = el.textContent
const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'
let frame = 0
const total = target.length * 8

function tick() {
  el.textContent = target.split('').map((char, i) => {
    if (char === ' ') return ' '
    if (i * 8 < frame) return char
    return pool[Math.floor(Math.random() * pool.length)]
  }).join('')
  frame++
  if (frame <= total) requestAnimationFrame(tick)
  else el.textContent = target
}
requestAnimationFrame(tick)`
    ),
  },

  // ─── 7. ELASTIC BOUNCE ────────────────────────────────────────────────────
  {
    id: 7,
    name: 'Elastic Bounce',
    slug: 'elastic-bounce',
    category: 'bounce',
    tags: ['elastic', 'bounce', 'stagger', 'spring'],
    difficulty: 'intermediate',
    description: 'Characters drop from above with elastic overshoot. Playful and energetic — perfect for display text.',
    previewText: 'BOUNCE!',
    animateFn: (el, g: any) => {
      const chars = splitChars(el)
      return g.from(chars, {
        y: -80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: 'elastic.out(1, 0.4)',
      })
    },
    reactCode: rc(
      `const chars = SplitText.create(el, { type: 'chars' }).chars

gsap.from(chars, {
  y: -80,
  opacity: 0,
  duration: 0.8,
  stagger: 0.06,
  ease: 'elastic.out(1, 0.4)',
})`
    ),
    vanillaCode: vc(
      `const chars = SplitText.create('.text-animate', { type: 'chars' }).chars

gsap.from(chars, {
  y: -80,
  opacity: 0,
  duration: 0.8,
  stagger: 0.06,
  ease: 'elastic.out(1, 0.4)',
})`
    ),
    webflowCode: wc(
      `const chars = SplitText.create('[data-animate="elastic-bounce"]', { type: 'chars' }).chars

gsap.from(chars, {
  y: -80,
  opacity: 0,
  duration: 0.8,
  stagger: 0.06,
  ease: 'elastic.out(1, 0.4)',
})`
    ),
  },

  // ─── 8. 3D FLIP X ─────────────────────────────────────────────────────────
  {
    id: 8,
    name: '3D Flip X',
    slug: '3d-flip-x',
    category: 'rotate',
    tags: ['3d', 'rotateX', 'perspective', 'flip', 'chars'],
    difficulty: 'intermediate',
    description: 'Each character flips in on the X-axis like turning pages in a book. Requires perspective.',
    previewText: 'FLIP 3D',
    animateFn: (el, g: any) => {
      el.style.perspective = '600px'
      const chars = splitChars(el)
      return g.from(chars, {
        rotateX: 90,
        opacity: 0,
        transformOrigin: '50% 50% -20px',
        duration: 0.5,
        stagger: 0.05,
        ease: 'back.out(1.5)',
      })
    },
    reactCode: rc(
      `el.style.perspective = '600px'
const chars = SplitText.create(el, { type: 'chars' }).chars

gsap.from(chars, {
  rotateX: 90,
  opacity: 0,
  transformOrigin: '50% 50% -20px',
  duration: 0.5,
  stagger: 0.05,
  ease: 'back.out(1.5)',
})`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
el.style.perspective = '600px'
const chars = SplitText.create(el, { type: 'chars' }).chars

gsap.from(chars, {
  rotateX: 90,
  opacity: 0,
  transformOrigin: '50% 50% -20px',
  duration: 0.5,
  stagger: 0.05,
  ease: 'back.out(1.5)',
})`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="flip-3d"]')
el.style.perspective = '600px'
const chars = SplitText.create(el, { type: 'chars' }).chars

gsap.from(chars, {
  rotateX: 90,
  opacity: 0,
  transformOrigin: '50% 50% -20px',
  duration: 0.5,
  stagger: 0.05,
  ease: 'back.out(1.5)',
})`
    ),
  },

  // ─── 9. WAVE EFFECT ───────────────────────────────────────────────────────
  {
    id: 9,
    name: 'Wave Effect',
    slug: 'wave-effect',
    category: 'wave',
    tags: ['wave', 'sine', 'chars', 'fluid'],
    difficulty: 'intermediate',
    description: 'Characters rise in a sine-wave pattern creating a fluid, organic entrance with rhythmic timing.',
    previewText: 'WAVE~',
    animateFn: (el, g: any) => {
      const chars = splitChars(el)
      return g.from(chars, {
        y: (i: number) => Math.sin(i * 0.6) * 35 + 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power3.out',
      })
    },
    reactCode: rc(
      `const chars = SplitText.create(el, { type: 'chars' }).chars

gsap.from(chars, {
  y: (i) => Math.sin(i * 0.6) * 35 + 30,
  opacity: 0,
  duration: 0.6,
  stagger: 0.05,
  ease: 'power3.out',
})`
    ),
    vanillaCode: vc(
      `const chars = SplitText.create('.text-animate', { type: 'chars' }).chars

gsap.from(chars, {
  y: (i) => Math.sin(i * 0.6) * 35 + 30,
  opacity: 0,
  duration: 0.6,
  stagger: 0.05,
  ease: 'power3.out',
})`
    ),
    webflowCode: wc(
      `const chars = SplitText.create('[data-animate="wave"]', { type: 'chars' }).chars

gsap.from(chars, {
  y: (i) => Math.sin(i * 0.6) * 35 + 30,
  opacity: 0,
  duration: 0.6,
  stagger: 0.05,
  ease: 'power3.out',
})`
    ),
  },

  // ─── 10. GLITCH EFFECT ────────────────────────────────────────────────────
  {
    id: 10,
    name: 'Glitch Effect',
    slug: 'glitch-effect',
    category: 'glitch',
    tags: ['glitch', 'skew', 'cyber', 'digital', 'shake'],
    difficulty: 'advanced',
    description: 'Text corrupts with rapid position shifts and skew distortions before settling. Pure digital energy.',
    previewText: 'GL1TCH',
    animateFn: (el, g: any) => {
      const tl = g.timeline()
      tl.set(el, { opacity: 1 })
        .from(el, { opacity: 0, duration: 0.01 })
        .to(el, { x: -6, skewX: 4, duration: 0.06, ease: 'none' })
        .to(el, { x: 5, skewX: -4, duration: 0.06, ease: 'none' })
        .to(el, { x: -3, skewX: 2, duration: 0.05, ease: 'none' })
        .to(el, { x: 4, skewX: -3, duration: 0.05, ease: 'none' })
        .to(el, { x: -1, skewX: 1, duration: 0.04, ease: 'none' })
        .to(el, { x: 0, skewX: 0, duration: 0.08, ease: 'power2.out' })
      return tl
    },
    reactCode: rc(
      `const tl = gsap.timeline()
tl.set(el, { opacity: 1 })
  .from(el, { opacity: 0, duration: 0.01 })
  .to(el, { x: -6, skewX: 4, duration: 0.06, ease: 'none' })
  .to(el, { x: 5,  skewX: -4, duration: 0.06, ease: 'none' })
  .to(el, { x: -3, skewX: 2, duration: 0.05, ease: 'none' })
  .to(el, { x: 4,  skewX: -3, duration: 0.05, ease: 'none' })
  .to(el, { x: -1, skewX: 1, duration: 0.04, ease: 'none' })
  .to(el, { x: 0,  skewX: 0, duration: 0.08, ease: 'power2.out' })

return () => tl.kill()`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const tl = gsap.timeline()
tl.set(el, { opacity: 1 })
  .from(el, { opacity: 0, duration: 0.01 })
  .to(el, { x: -6, skewX: 4,  duration: 0.06 })
  .to(el, { x: 5,  skewX: -4, duration: 0.06 })
  .to(el, { x: -3, skewX: 2,  duration: 0.05 })
  .to(el, { x: 4,  skewX: -3, duration: 0.05 })
  .to(el, { x: -1, skewX: 1,  duration: 0.04 })
  .to(el, { x: 0,  skewX: 0,  duration: 0.08, ease: 'power2.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="glitch"]')
const tl = gsap.timeline()
tl.set(el, { opacity: 1 })
  .from(el, { opacity: 0, duration: 0.01 })
  .to(el, { x: -6, skewX: 4,  duration: 0.06 })
  .to(el, { x: 5,  skewX: -4, duration: 0.06 })
  .to(el, { x: -3, skewX: 2,  duration: 0.05 })
  .to(el, { x: 4,  skewX: -3, duration: 0.05 })
  .to(el, { x: -1, skewX: 1,  duration: 0.04 })
  .to(el, { x: 0,  skewX: 0,  duration: 0.08, ease: 'power2.out' })`
    ),
  },

  // ─── 11. FADE DOWN ────────────────────────────────────────────────────────
  {
    id: 11,
    name: 'Fade Down',
    slug: 'fade-down',
    category: 'fade',
    tags: ['fade', 'opacity', 'translate-y', 'top'],
    difficulty: 'beginner',
    description: 'Text falls gently from above while fading in. Great for headers that drop onto the page.',
    previewText: 'FADE DOWN',
    animateFn: (el, g: any) =>
      g.from(el, { y: -40, opacity: 0, duration: 0.8, ease: 'power3.out' }),
    reactCode: rc(`gsap.from(el, { y: -40, opacity: 0, duration: 0.8, ease: 'power3.out' })`),
    vanillaCode: vc(`gsap.from('.text-animate', { y: -40, opacity: 0, duration: 0.8, ease: 'power3.out' })`),
    webflowCode: wc(`gsap.from('[data-animate="fade-down"]', { y: -40, opacity: 0, duration: 0.8, ease: 'power3.out' })`),
  },

  // ─── 12. SLIDE IN RIGHT ───────────────────────────────────────────────────
  {
    id: 12,
    name: 'Slide In Right',
    slug: 'slide-in-right',
    category: 'slide',
    tags: ['slide', 'translate-x', 'horizontal', 'right'],
    difficulty: 'beginner',
    description: 'Text sweeps in from the right. Mirror of Slide In Left — useful for alternating layouts.',
    previewText: 'SLIDE ←',
    animateFn: (el, g: any) =>
      g.from(el, { x: 80, opacity: 0, duration: 0.7, ease: 'power2.out' }),
    reactCode: rc(`gsap.from(el, { x: 80, opacity: 0, duration: 0.7, ease: 'power2.out' })`),
    vanillaCode: vc(`gsap.from('.text-animate', { x: 80, opacity: 0, duration: 0.7, ease: 'power2.out' })`),
    webflowCode: wc(`gsap.from('[data-animate="slide-right"]', { x: 80, opacity: 0, duration: 0.7, ease: 'power2.out' })`),
  },

  // ─── 13. SPLIT WORDS STAGGER ──────────────────────────────────────────────
  {
    id: 13,
    name: 'Split Words Stagger',
    slug: 'split-words-stagger',
    category: 'split',
    tags: ['split', 'words', 'stagger', 'slide'],
    difficulty: 'intermediate',
    description: 'Each word slides up independently with a staggered delay. Clean and readable for longer phrases.',
    previewText: 'WORD BY WORD',
    animateFn: (el, g: any) => {
      const words = splitWords(el)
      return g.from(words, { y: 40, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' })
    },
    reactCode: rc(
      `const words = SplitText.create(el, { type: 'words' }).words

gsap.from(words, {
  y: 40, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
})`
    ),
    vanillaCode: vc(
      `const words = SplitText.create('.text-animate', { type: 'words' }).words

gsap.from(words, {
  y: 40, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
})`
    ),
    webflowCode: wc(
      `const words = SplitText.create('[data-animate="split-words"]', { type: 'words' }).words

gsap.from(words, {
  y: 40, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
})`
    ),
  },

  // ─── 14. BLUR TO SHARP ────────────────────────────────────────────────────
  {
    id: 14,
    name: 'Blur to Sharp',
    slug: 'blur-to-sharp',
    category: 'blur',
    tags: ['blur', 'filter', 'focus', 'opacity'],
    difficulty: 'beginner',
    description: 'Text comes into focus from a blurred state. Elegant, cinematic — like a camera pulling focus.',
    previewText: 'IN FOCUS',
    animateFn: (el, g: any) =>
      g.from(el, { filter: 'blur(12px)', opacity: 0, duration: 1, ease: 'power3.out' }),
    reactCode: rc(`gsap.from(el, { filter: 'blur(12px)', opacity: 0, duration: 1, ease: 'power3.out' })`),
    vanillaCode: vc(`gsap.from('.text-animate', { filter: 'blur(12px)', opacity: 0, duration: 1, ease: 'power3.out' })`),
    webflowCode: wc(`gsap.from('[data-animate="blur-sharp"]', { filter: 'blur(12px)', opacity: 0, duration: 1, ease: 'power3.out' })`),
  },

  // ─── 15. SCALE UP ─────────────────────────────────────────────────────────
  {
    id: 15,
    name: 'Scale Up',
    slug: 'scale-up',
    category: 'scale',
    tags: ['scale', 'transform', 'pop', 'simple'],
    difficulty: 'beginner',
    description: 'Text grows from nothing to full size. Add opacity for a softer feel, or keep it sharp.',
    previewText: 'SCALE',
    animateFn: (el, g: any) =>
      g.from(el, { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' }),
    reactCode: rc(`gsap.from(el, { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' })`),
    vanillaCode: vc(`gsap.from('.text-animate', { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' })`),
    webflowCode: wc(`gsap.from('[data-animate="scale-up"]', { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' })`),
  },

  // ─── 16. CURTAIN UP (LINE REVEAL) ─────────────────────────────────────────
  {
    id: 16,
    name: 'Curtain Up',
    slug: 'curtain-up',
    category: 'clip',
    tags: ['curtain', 'overflow', 'reveal', 'line', 'slide'],
    difficulty: 'intermediate',
    description: 'Text slides up out of a hidden overflow container — the classic theatrical curtain reveal technique.',
    previewText: 'CURTAIN',
    animateFn: (el, g: any) => {
      const wrapper = document.createElement('div')
      wrapper.style.cssText = 'overflow:hidden;display:inline-block'
      el.parentNode?.insertBefore(wrapper, el)
      wrapper.appendChild(el)
      return g.from(el, { y: '110%', duration: 0.7, ease: 'power3.out' })
    },
    reactCode: rc(
      `// Wrap your text element in a div with overflow:hidden
// <div style={{ overflow: 'hidden' }}><h1 ref={ref}>Your Text</h1></div>

gsap.from(el, { y: '110%', duration: 0.7, ease: 'power3.out' })`
    ),
    vanillaCode: vc(
      `/* Wrap target in overflow:hidden parent */
/* <div class="overflow-hidden"><h1 class="text-animate">Your Text Here</h1></div> */

gsap.from('.text-animate', { y: '110%', duration: 0.7, ease: 'power3.out' })`
    ),
    webflowCode: wc(
      `/* Wrap target in a div with overflow:hidden (set in Webflow designer) */
gsap.from('[data-animate="curtain-up"]', { y: '110%', duration: 0.7, ease: 'power3.out' })`
    ),
  },

  // ─── 17. 3D FLIP Y ────────────────────────────────────────────────────────
  {
    id: 17,
    name: '3D Flip Y',
    slug: '3d-flip-y',
    category: 'rotate',
    tags: ['3d', 'rotateY', 'perspective', 'chars'],
    difficulty: 'intermediate',
    description: 'Characters spin in on the Y-axis like tiles on a revolving display board. Requires perspective.',
    previewText: 'SPIN',
    animateFn: (el, g: any) => {
      el.style.perspective = '600px'
      const chars = splitChars(el)
      return g.from(chars, {
        rotateY: -90,
        opacity: 0,
        transformOrigin: '50% 50% -20px',
        duration: 0.55,
        stagger: 0.05,
        ease: 'back.out(1.4)',
      })
    },
    reactCode: rc(
      `el.style.perspective = '600px'
const chars = SplitText.create(el, { type: 'chars' }).chars

gsap.from(chars, {
  rotateY: -90, opacity: 0,
  transformOrigin: '50% 50% -20px',
  duration: 0.55, stagger: 0.05, ease: 'back.out(1.4)',
})`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
el.style.perspective = '600px'
const chars = SplitText.create(el, { type: 'chars' }).chars

gsap.from(chars, {
  rotateY: -90, opacity: 0,
  transformOrigin: '50% 50% -20px',
  duration: 0.55, stagger: 0.05, ease: 'back.out(1.4)',
})`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="flip-y"]')
el.style.perspective = '600px'
const chars = SplitText.create(el, { type: 'chars' }).chars

gsap.from(chars, {
  rotateY: -90, opacity: 0,
  transformOrigin: '50% 50% -20px',
  duration: 0.55, stagger: 0.05, ease: 'back.out(1.4)',
})`
    ),
  },

  // ─── 18. NEON FLICKER ─────────────────────────────────────────────────────
  {
    id: 18,
    name: 'Neon Flicker',
    slug: 'neon-flicker',
    category: 'glitch',
    tags: ['neon', 'flicker', 'glow', 'opacity', 'loop'],
    difficulty: 'intermediate',
    description: 'Text flickers in like a buzzing neon sign powering up. Opacity pulses rapidly then steadies.',
    previewText: 'NEON',
    animateFn: (el, g: any) => {
      const tl = g.timeline()
      const flickers = [0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1]
      let t = 0
      flickers.forEach(v => {
        tl.set(el, { opacity: v }, t)
        t += v === 0 ? 0.05 : 0.08
      })
      tl.to(el, { opacity: 1, duration: 0.2 })
      return tl
    },
    reactCode: rc(
      `const tl = gsap.timeline()
const flickers = [0,1,0,1,0,0,1,0,1,1,0,1]
let t = 0
flickers.forEach(v => {
  tl.set(el, { opacity: v }, t)
  t += v === 0 ? 0.05 : 0.08
})
tl.to(el, { opacity: 1, duration: 0.2 })
return () => tl.kill()`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const tl = gsap.timeline()
const flickers = [0,1,0,1,0,0,1,0,1,1,0,1]
let t = 0
flickers.forEach(v => {
  tl.set(el, { opacity: v }, t)
  t += v === 0 ? 0.05 : 0.08
})
tl.to(el, { opacity: 1, duration: 0.2 })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="neon"]')
const tl = gsap.timeline()
const flickers = [0,1,0,1,0,0,1,0,1,1,0,1]
let t = 0
flickers.forEach(v => {
  tl.set(el, { opacity: v }, t)
  t += v === 0 ? 0.05 : 0.08
})
tl.to(el, { opacity: 1, duration: 0.2 })`
    ),
  },

  // ─── 19. ELASTIC SLIDE UP ─────────────────────────────────────────────────
  {
    id: 19,
    name: 'Elastic Slide Up',
    slug: 'elastic-slide-up',
    category: 'bounce',
    tags: ['elastic', 'slide', 'y', 'spring', 'overshoot'],
    difficulty: 'beginner',
    description: 'Text rockets up from below with an elastic overshoot. More energy than a plain slide.',
    previewText: 'ELASTIC',
    animateFn: (el, g: any) =>
      g.from(el, { y: 80, opacity: 0, duration: 1, ease: 'elastic.out(1, 0.5)' }),
    reactCode: rc(`gsap.from(el, { y: 80, opacity: 0, duration: 1, ease: 'elastic.out(1, 0.5)' })`),
    vanillaCode: vc(`gsap.from('.text-animate', { y: 80, opacity: 0, duration: 1, ease: 'elastic.out(1, 0.5)' })`),
    webflowCode: wc(`gsap.from('[data-animate="elastic-slide"]', { y: 80, opacity: 0, duration: 1, ease: 'elastic.out(1, 0.5)' })`),
  },

  // ─── 20. RANDOM STAGGER ───────────────────────────────────────────────────
  {
    id: 20,
    name: 'Random Stagger',
    slug: 'random-stagger',
    category: 'stagger',
    tags: ['stagger', 'random', 'chars', 'chaotic'],
    difficulty: 'intermediate',
    description: 'Characters appear in a random order rather than left-to-right. Chaotic energy, unified result.',
    previewText: 'CHAOS',
    animateFn: (el, g: any) => {
      const chars = splitChars(el)
      return g.from(chars, {
        opacity: 0, y: 30, duration: 0.4,
        stagger: { each: 0.06, from: 'random' },
        ease: 'power2.out',
      })
    },
    reactCode: rc(
      `const chars = SplitText.create(el, { type: 'chars' }).chars

gsap.from(chars, {
  opacity: 0, y: 30, duration: 0.4,
  stagger: { each: 0.06, from: 'random' },
  ease: 'power2.out',
})`
    ),
    vanillaCode: vc(
      `const chars = SplitText.create('.text-animate', { type: 'chars' }).chars

gsap.from(chars, {
  opacity: 0, y: 30, duration: 0.4,
  stagger: { each: 0.06, from: 'random' },
  ease: 'power2.out',
})`
    ),
    webflowCode: wc(
      `const chars = SplitText.create('[data-animate="random-stagger"]', { type: 'chars' }).chars

gsap.from(chars, {
  opacity: 0, y: 30, duration: 0.4,
  stagger: { each: 0.06, from: 'random' },
  ease: 'power2.out',
})`
    ),
  },

  // ─── 21. SPLIT WORDS BOUNCE ───────────────────────────────────────────────
  {
    id: 21,
    name: 'Split Words Bounce',
    slug: 'split-words-bounce',
    category: 'bounce',
    tags: ['words', 'bounce', 'elastic', 'stagger'],
    difficulty: 'intermediate',
    description: 'Each word drops in from above and bounces into place. Expressive and high-energy.',
    previewText: 'POP IT IN',
    animateFn: (el, g: any) => {
      const words = splitWords(el)
      return g.from(words, {
        y: -60, opacity: 0, duration: 0.7,
        stagger: 0.1, ease: 'bounce.out',
      })
    },
    reactCode: rc(
      `const words = SplitText.create(el, { type: 'words' }).words

gsap.from(words, {
  y: -60, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'bounce.out',
})`
    ),
    vanillaCode: vc(
      `const words = SplitText.create('.text-animate', { type: 'words' }).words

gsap.from(words, {
  y: -60, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'bounce.out',
})`
    ),
    webflowCode: wc(
      `const words = SplitText.create('[data-animate="words-bounce"]', { type: 'words' }).words

gsap.from(words, {
  y: -60, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'bounce.out',
})`
    ),
  },

  // ─── 22. CLIP TOP TO BOTTOM ───────────────────────────────────────────────
  {
    id: 22,
    name: 'Clip Top to Bottom',
    slug: 'clip-top-bottom',
    category: 'clip',
    tags: ['clip-path', 'reveal', 'wipe', 'vertical'],
    difficulty: 'intermediate',
    description: 'Text is unmasked from top to bottom using clip-path inset. Like pulling a shade up from the top.',
    previewText: 'UNVEIL',
    animateFn: (el, g: any) => {
      g.set(el, { clipPath: 'inset(0 0 100% 0)' })
      return g.to(el, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power3.inOut' })
    },
    reactCode: rc(
      `gsap.set(el, { clipPath: 'inset(0 0 100% 0)' })
gsap.to(el, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power3.inOut' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
gsap.set(el, { clipPath: 'inset(0 0 100% 0)' })
gsap.to(el, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power3.inOut' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="clip-tb"]')
gsap.set(el, { clipPath: 'inset(0 0 100% 0)' })
gsap.to(el, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power3.inOut' })`
    ),
  },

  // ─── 23. SCALE DOWN ───────────────────────────────────────────────────────
  {
    id: 23,
    name: 'Scale Down',
    slug: 'scale-down',
    category: 'scale',
    tags: ['scale', 'shrink', 'transform', 'impact'],
    difficulty: 'beginner',
    description: 'Text starts oversized and settles to full size. Creates an impact-then-settle feel.',
    previewText: 'IMPACT',
    animateFn: (el, g: any) =>
      g.from(el, { scale: 1.6, opacity: 0, duration: 0.65, ease: 'power3.out' }),
    reactCode: rc(`gsap.from(el, { scale: 1.6, opacity: 0, duration: 0.65, ease: 'power3.out' })`),
    vanillaCode: vc(`gsap.from('.text-animate', { scale: 1.6, opacity: 0, duration: 0.65, ease: 'power3.out' })`),
    webflowCode: wc(`gsap.from('[data-animate="scale-down"]', { scale: 1.6, opacity: 0, duration: 0.65, ease: 'power3.out' })`),
  },

  // ─── 24. RGB SPLIT ────────────────────────────────────────────────────────
  {
    id: 24,
    name: 'RGB Split',
    slug: 'rgb-split',
    category: 'glitch',
    tags: ['rgb', 'glitch', 'text-shadow', 'chromatic', 'cyber'],
    difficulty: 'advanced',
    description: 'Chromatic aberration effect — RGB channels split apart then converge. Pure cyberpunk energy.',
    previewText: 'RGB',
    animateFn: (el, g: any) => {
      const tl = g.timeline()
      tl.set(el, { opacity: 1 })
        .fromTo(el,
          { textShadow: '-8px 0 2px rgba(255,0,0,0.8), 8px 0 2px rgba(0,255,255,0.8)', x: 0 },
          { textShadow: '0px 0 0px rgba(255,0,0,0)', x: 0, duration: 0.8, ease: 'power3.out' }
        )
      return tl
    },
    reactCode: rc(
      `const tl = gsap.timeline()
tl.fromTo(el,
  { opacity: 0, textShadow: '-10px 0 3px rgba(255,0,0,0.9), 10px 0 3px rgba(0,255,255,0.9)' },
  { opacity: 1, textShadow: '0px 0 0px rgba(255,0,0,0)', duration: 0.9, ease: 'power3.out' }
)
return () => tl.kill()`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
gsap.fromTo(el,
  { opacity: 0, textShadow: '-10px 0 3px rgba(255,0,0,0.9), 10px 0 3px rgba(0,255,255,0.9)' },
  { opacity: 1, textShadow: '0px 0 0px rgba(255,0,0,0)', duration: 0.9, ease: 'power3.out' }
)`
    ),
    webflowCode: wc(
      `gsap.fromTo('[data-animate="rgb-split"]',
  { opacity: 0, textShadow: '-10px 0 3px rgba(255,0,0,0.9), 10px 0 3px rgba(0,255,255,0.9)' },
  { opacity: 1, textShadow: '0px 0 0px rgba(255,0,0,0)', duration: 0.9, ease: 'power3.out' }
)`
    ),
  },

  // ─── 25. STAGGER ROTATE Y (WORDS) ─────────────────────────────────────────
  {
    id: 25,
    name: 'Word Rotate Y',
    slug: 'word-rotate-y',
    category: 'rotate',
    tags: ['words', 'rotateY', '3d', 'stagger', 'perspective'],
    difficulty: 'intermediate',
    description: 'Words spin in one by one on the Y-axis. Elegant and magazine-like for headlines.',
    previewText: 'SPIN WORDS',
    animateFn: (el, g: any) => {
      el.style.perspective = '800px'
      const words = splitWords(el)
      return g.from(words, {
        rotateY: 60, opacity: 0, transformOrigin: '0% 50%',
        duration: 0.65, stagger: 0.15, ease: 'power3.out',
      })
    },
    reactCode: rc(
      `el.style.perspective = '800px'
const words = SplitText.create(el, { type: 'words' }).words

gsap.from(words, {
  rotateY: 60, opacity: 0, transformOrigin: '0% 50%',
  duration: 0.65, stagger: 0.15, ease: 'power3.out',
})`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
el.style.perspective = '800px'
const words = SplitText.create(el, { type: 'words' }).words

gsap.from(words, {
  rotateY: 60, opacity: 0, transformOrigin: '0% 50%',
  duration: 0.65, stagger: 0.15, ease: 'power3.out',
})`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="word-rotate-y"]')
el.style.perspective = '800px'
const words = SplitText.create(el, { type: 'words' }).words

gsap.from(words, {
  rotateY: 60, opacity: 0, transformOrigin: '0% 50%',
  duration: 0.65, stagger: 0.15, ease: 'power3.out',
})`
    ),
  },

  // ─── 26. BLUR SCALE IN ────────────────────────────────────────────────────
  {
    id: 26,
    name: 'Blur Scale In',
    slug: 'blur-scale-in',
    category: 'blur',
    tags: ['blur', 'scale', 'filter', 'combined', 'cinematic'],
    difficulty: 'intermediate',
    description: 'Blur and scale animate together for a cinematic punch-in entrance. Works great on hero text.',
    previewText: 'CINEMATIC',
    animateFn: (el, g: any) =>
      g.from(el, { scale: 1.15, filter: 'blur(8px)', opacity: 0, duration: 0.9, ease: 'power3.out' }),
    reactCode: rc(`gsap.from(el, { scale: 1.15, filter: 'blur(8px)', opacity: 0, duration: 0.9, ease: 'power3.out' })`),
    vanillaCode: vc(`gsap.from('.text-animate', { scale: 1.15, filter: 'blur(8px)', opacity: 0, duration: 0.9, ease: 'power3.out' })`),
    webflowCode: wc(`gsap.from('[data-animate="blur-scale"]', { scale: 1.15, filter: 'blur(8px)', opacity: 0, duration: 0.9, ease: 'power3.out' })`),
  },

  // ─── 27. COUNTER UP ───────────────────────────────────────────────────────
  {
    id: 27,
    name: 'Counter Up',
    slug: 'counter-up',
    category: 'advanced',
    tags: ['counter', 'number', 'count', 'stat', 'ticker'],
    difficulty: 'intermediate',
    description: 'Animates a number from 0 to its target value. Perfect for stats, metrics, and dashboards.',
    previewText: '100',
    animateFn: (el, g: any) => {
      const target = parseInt(el.textContent || '100', 10)
      const obj = { val: 0 }
      return g.to(obj, {
        val: target,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(obj.val).toString() },
      })
    },
    reactCode: rc(
      `const target = parseInt(el.textContent || '0', 10)
const obj = { val: 0 }
gsap.to(obj, {
  val: target,
  duration: 1.5,
  ease: 'power2.out',
  onUpdate: () => { el.textContent = Math.round(obj.val).toString() },
})`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const target = parseInt(el.textContent, 10)
const obj = { val: 0 }
gsap.to(obj, {
  val: target,
  duration: 1.5,
  ease: 'power2.out',
  onUpdate() { el.textContent = Math.round(obj.val) },
})`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="counter"]')
const target = parseInt(el.textContent, 10)
const obj = { val: 0 }
gsap.to(obj, {
  val: target,
  duration: 1.5,
  ease: 'power2.out',
  onUpdate() { el.textContent = Math.round(obj.val) },
})`
    ),
  },

  // ─── 28. GRAVITY DROP ─────────────────────────────────────────────────────
  {
    id: 28,
    name: 'Gravity Drop',
    slug: 'gravity-drop',
    category: 'advanced',
    tags: ['gravity', 'drop', 'chars', 'physics', 'stagger'],
    difficulty: 'advanced',
    description: 'Characters fall in from above with increasing stagger — simulating real gravitational pull.',
    previewText: 'FALLING',
    animateFn: (el, g: any) => {
      const chars = splitChars(el)
      return g.from(chars, {
        y: -120,
        opacity: 0,
        duration: (i: number) => 0.4 + i * 0.04,
        delay: (i: number) => i * 0.05,
        ease: 'bounce.out',
      })
    },
    reactCode: rc(
      `const chars = SplitText.create(el, { type: 'chars' }).chars

gsap.from(chars, {
  y: -120,
  opacity: 0,
  duration: (i) => 0.4 + i * 0.04,
  delay:    (i) => i * 0.05,
  ease: 'bounce.out',
})`
    ),
    vanillaCode: vc(
      `const chars = SplitText.create('.text-animate', { type: 'chars' }).chars

gsap.from(chars, {
  y: -120,
  opacity: 0,
  duration: (i) => 0.4 + i * 0.04,
  delay:    (i) => i * 0.05,
  ease: 'bounce.out',
})`
    ),
    webflowCode: wc(
      `const chars = SplitText.create('[data-animate="gravity-drop"]', { type: 'chars' }).chars

gsap.from(chars, {
  y: -120,
  opacity: 0,
  duration: (i) => 0.4 + i * 0.04,
  delay:    (i) => i * 0.05,
  ease: 'bounce.out',
})`
    ),
  },

  // ─── 29. SLIDE + FADE ─────────────────────────────────────────────────────
  {
    id: 29,
    name: 'Slide + Fade',
    slug: 'slide-fade',
    category: 'slide',
    tags: ['slide', 'fade', 'combined', 'smooth', 'x', 'opacity'],
    difficulty: 'beginner',
    description: 'Horizontal slide and fade combined. Subtle and versatile — the Swiss Army knife of entrances.',
    previewText: 'SMOOTH',
    animateFn: (el, g: any) =>
      g.from(el, { x: -50, opacity: 0, duration: 0.75, ease: 'power2.out' }),
    reactCode: rc(`gsap.from(el, { x: -50, opacity: 0, duration: 0.75, ease: 'power2.out' })`),
    vanillaCode: vc(`gsap.from('.text-animate', { x: -50, opacity: 0, duration: 0.75, ease: 'power2.out' })`),
    webflowCode: wc(`gsap.from('[data-animate="slide-fade"]', { x: -50, opacity: 0, duration: 0.75, ease: 'power2.out' })`),
  },

  // ─── 30. SPOTLIGHT REVEAL ─────────────────────────────────────────────────
  {
    id: 30,
    name: 'Spotlight Reveal',
    slug: 'spotlight-reveal',
    category: 'clip',
    tags: ['clip-path', 'circle', 'spotlight', 'reveal', 'radial'],
    difficulty: 'intermediate',
    description: 'Text is revealed by a growing circle clip-path from the center — like a spotlight turning on.',
    previewText: 'SPOTLIGHT',
    animateFn: (el, g: any) => {
      g.set(el, { clipPath: 'circle(0% at 50% 50%)' })
      return g.to(el, {
        clipPath: 'circle(100% at 50% 50%)',
        duration: 0.7,
        ease: 'power3.out',
      })
    },
    reactCode: rc(
      `gsap.set(el, { clipPath: 'circle(0% at 50% 50%)' })
gsap.to(el, { clipPath: 'circle(100% at 50% 50%)', duration: 0.7, ease: 'power3.out' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
gsap.set(el, { clipPath: 'circle(0% at 50% 50%)' })
gsap.to(el, { clipPath: 'circle(100% at 50% 50%)', duration: 0.7, ease: 'power3.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="spotlight"]')
gsap.set(el, { clipPath: 'circle(0% at 50% 50%)' })
gsap.to(el, { clipPath: 'circle(100% at 50% 50%)', duration: 0.7, ease: 'power3.out' })`
    ),
  },

  // ─── 31. FADE LEFT ───────────────────────────────────────────────────────
  {
    id: 31,
    name: 'Fade Left',
    slug: 'fade-left',
    category: 'fade',
    tags: ['fade', 'opacity', 'x', 'horizontal'],
    difficulty: 'beginner',
    description: 'Text slides in from the right while fading into view.',
    previewText: 'FADE LEFT',
    animateFn: (el, g: any) =>
      g.from(el, { x: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }),
    reactCode: rc(`gsap.from(el, { x: 30, opacity: 0, duration: 0.7, ease: 'power3.out' })`),
    vanillaCode: vc(`gsap.from('.text-animate', { x: 30, opacity: 0, duration: 0.7, ease: 'power3.out' })`),
    webflowCode: wc(`gsap.from('[data-animate="fade-left"]', { x: 30, opacity: 0, duration: 0.7, ease: 'power3.out' })`),
  },

  // ─── 32. FADE SCALE IN ───────────────────────────────────────────────────
  {
    id: 32,
    name: 'Fade Scale In',
    slug: 'fade-scale-in',
    category: 'fade',
    tags: ['fade', 'scale', 'opacity', 'zoom'],
    difficulty: 'beginner',
    description: 'Text grows from slightly smaller while fading in — a polished, modern entrance.',
    previewText: 'SCALE FADE',
    animateFn: (el, g: any) =>
      g.from(el, { scale: 0.85, opacity: 0, duration: 0.7, ease: 'power3.out' }),
    reactCode: rc(`gsap.from(el, { scale: 0.85, opacity: 0, duration: 0.7, ease: 'power3.out' })`),
    vanillaCode: vc(`gsap.from('.text-animate', { scale: 0.85, opacity: 0, duration: 0.7, ease: 'power3.out' })`),
    webflowCode: wc(`gsap.from('[data-animate="fade-scale-in"]', { scale: 0.85, opacity: 0, duration: 0.7, ease: 'power3.out' })`),
  },

  // ─── 33. FADE ROTATE IN ──────────────────────────────────────────────────
  {
    id: 33,
    name: 'Fade Rotate In',
    slug: 'fade-rotate-in',
    category: 'fade',
    tags: ['fade', 'rotation', 'opacity', 'tilt'],
    difficulty: 'beginner',
    description: 'Text tilts slightly as it fades in — a subtle editorial touch.',
    previewText: 'TILT IN',
    animateFn: (el, g: any) =>
      g.from(el, { rotation: 8, opacity: 0, duration: 0.7, ease: 'power3.out' }),
    reactCode: rc(`gsap.from(el, { rotation: 8, opacity: 0, duration: 0.7, ease: 'power3.out' })`),
    vanillaCode: vc(`gsap.from('.text-animate', { rotation: 8, opacity: 0, duration: 0.7, ease: 'power3.out' })`),
    webflowCode: wc(`gsap.from('[data-animate="fade-rotate-in"]', { rotation: 8, opacity: 0, duration: 0.7, ease: 'power3.out' })`),
  },

  // ─── 34. STAGGER FADE WORDS ──────────────────────────────────────────────
  {
    id: 34,
    name: 'Stagger Fade Words',
    slug: 'stagger-fade-words',
    category: 'fade',
    tags: ['fade', 'stagger', 'words', 'opacity'],
    difficulty: 'beginner',
    description: 'Each word fades and rises in sequence — great for taglines.',
    previewText: 'WORD BY WORD',
    animateFn: (el, g: any) => {
      const words = splitWords(el)
      return g.from(words, { y: 12, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' })
    },
    reactCode: rc(
      `const words = SplitText.create(el, { type: 'words' }).words
gsap.from(words, { y: 12, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const words = SplitText.create(el, { type: 'words' }).words
gsap.from(words, { y: 12, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="stagger-fade-words"]')
const words = SplitText.create(el, { type: 'words' }).words
gsap.from(words, { y: 12, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' })`
    ),
  },

  // ─── 35. SLIDE UP (NO OPACITY) ───────────────────────────────────────────
  {
    id: 35,
    name: 'Slide Up Pure',
    slug: 'slide-up-pure',
    category: 'slide',
    tags: ['slide', 'y', 'translate', 'clip', 'no-opacity'],
    difficulty: 'beginner',
    description: 'Text slides up from below with no opacity change — pure positional entrance.',
    previewText: 'PURE SLIDE',
    animateFn: (el, g: any) => {
      g.set(el, { overflow: 'hidden', display: 'block' })
      return g.from(el, { y: '100%', duration: 0.6, ease: 'power3.out' })
    },
    reactCode: rc(
      `gsap.set(el, { overflow: 'hidden', display: 'block' })
gsap.from(el, { y: '100%', duration: 0.6, ease: 'power3.out' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
gsap.set(el, { overflow: 'hidden', display: 'block' })
gsap.from(el, { y: '100%', duration: 0.6, ease: 'power3.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="slide-up-pure"]')
gsap.set(el, { overflow: 'hidden', display: 'block' })
gsap.from(el, { y: '100%', duration: 0.6, ease: 'power3.out' })`
    ),
  },

  // ─── 36. SLIDE + SCALE ───────────────────────────────────────────────────
  {
    id: 36,
    name: 'Slide Scale',
    slug: 'slide-scale',
    category: 'slide',
    tags: ['slide', 'scale', 'y', 'opacity'],
    difficulty: 'beginner',
    description: 'Text rises and expands simultaneously for a confident, weighty entrance.',
    previewText: 'RISE & SCALE',
    animateFn: (el, g: any) =>
      g.from(el, { y: 60, scale: 0.9, opacity: 0, duration: 0.8, ease: 'power3.out' }),
    reactCode: rc(`gsap.from(el, { y: 60, scale: 0.9, opacity: 0, duration: 0.8, ease: 'power3.out' })`),
    vanillaCode: vc(`gsap.from('.text-animate', { y: 60, scale: 0.9, opacity: 0, duration: 0.8, ease: 'power3.out' })`),
    webflowCode: wc(`gsap.from('[data-animate="slide-scale"]', { y: 60, scale: 0.9, opacity: 0, duration: 0.8, ease: 'power3.out' })`),
  },

  // ─── 37. STAGGER SLIDE LINES ─────────────────────────────────────────────
  {
    id: 37,
    name: 'Stagger Slide Lines',
    slug: 'stagger-slide-lines',
    category: 'slide',
    tags: ['slide', 'stagger', 'words', 'overflow', 'mask'],
    difficulty: 'intermediate',
    description: 'Words slide up from behind a hidden overflow mask in sequence.',
    previewText: 'LINE BY LINE',
    animateFn: (el, g: any) => {
      const words = splitWords(el)
      words.forEach(w => {
        const wrap = document.createElement('span')
        wrap.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom'
        w.parentNode!.insertBefore(wrap, w)
        wrap.appendChild(w)
      })
      return g.from(words, { y: '110%', duration: 0.6, stagger: 0.08, ease: 'power3.out' })
    },
    reactCode: rc(
      `const words = SplitText.create(el, { type: 'words' }).words
words.forEach(w => {
  const wrap = document.createElement('span')
  wrap.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom'
  w.parentNode.insertBefore(wrap, w)
  wrap.appendChild(w)
})
gsap.from(words, { y: '110%', duration: 0.6, stagger: 0.08, ease: 'power3.out' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const split = SplitText.create(el, { type: 'words', mask: 'words' })
const words = split.words
gsap.from(words, { y: '110%', duration: 0.6, stagger: 0.08, ease: 'power3.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="stagger-slide-lines"]')
const split = SplitText.create(el, { type: 'words', mask: 'words' })
const words = split.words
gsap.from(words, { y: '110%', duration: 0.6, stagger: 0.08, ease: 'power3.out' })`
    ),
  },

  // ─── 38. POWER4 SLIDE ────────────────────────────────────────────────────
  {
    id: 38,
    name: 'Power4 Slide',
    slug: 'power4-slide',
    category: 'slide',
    tags: ['slide', 'x', 'power4', 'fast', 'horizontal'],
    difficulty: 'beginner',
    description: 'Text rockets in from the left using an aggressive Power4 ease — fast start, snappy stop.',
    previewText: 'POWER SLIDE',
    animateFn: (el, g: any) =>
      g.from(el, { x: -100, opacity: 0, duration: 0.6, ease: 'power4.out' }),
    reactCode: rc(`gsap.from(el, { x: -100, opacity: 0, duration: 0.6, ease: 'power4.out' })`),
    vanillaCode: vc(`gsap.from('.text-animate', { x: -100, opacity: 0, duration: 0.6, ease: 'power4.out' })`),
    webflowCode: wc(`gsap.from('[data-animate="power4-slide"]', { x: -100, opacity: 0, duration: 0.6, ease: 'power4.out' })`),
  },

  // ─── 39. SPLIT LINES CURTAIN ─────────────────────────────────────────────
  {
    id: 39,
    name: 'Split Lines Curtain',
    slug: 'split-lines-curtain',
    category: 'split',
    tags: ['split', 'words', 'overflow', 'curtain', 'mask'],
    difficulty: 'intermediate',
    description: 'Words are masked by hidden overflow containers and rise like theatre curtains.',
    previewText: 'CURTAIN RISE',
    animateFn: (el, g: any) => {
      const words = splitWords(el)
      words.forEach(w => {
        const wrap = document.createElement('span')
        wrap.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom'
        w.parentNode!.insertBefore(wrap, w)
        wrap.appendChild(w)
      })
      return g.from(words, {
        y: '100%',
        duration: 0.7,
        stagger: { each: 0.06, from: 'start' },
        ease: 'power4.out',
      })
    },
    reactCode: rc(
      `const words = SplitText.create(el, { type: 'words' }).words
words.forEach(w => {
  const wrap = document.createElement('span')
  wrap.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom'
  w.parentNode.insertBefore(wrap, w)
  wrap.appendChild(w)
})
gsap.from(words, { y: '100%', duration: 0.7, stagger: { each: 0.06, from: 'start' }, ease: 'power4.out' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const split = SplitText.create(el, { type: 'words', mask: 'words' })
const words = split.words
gsap.from(words, { y: '100%', duration: 0.7, stagger: { each: 0.06, from: 'start' }, ease: 'power4.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="split-lines-curtain"]')
const split = SplitText.create(el, { type: 'words', mask: 'words' })
const words = split.words
gsap.from(words, { y: '100%', duration: 0.7, stagger: { each: 0.06, from: 'start' }, ease: 'power4.out' })`
    ),
  },

  // ─── 40. SPLIT CHARS SCATTER ─────────────────────────────────────────────
  {
    id: 40,
    name: 'Split Chars Scatter',
    slug: 'split-chars-scatter',
    category: 'split',
    tags: ['split', 'chars', 'scatter', 'random', 'x', 'y'],
    difficulty: 'intermediate',
    description: 'Characters fly in from random positions to assemble the word.',
    previewText: 'SCATTER',
    animateFn: (el, g: any) => {
      const chars = splitChars(el)
      return g.from(chars, {
        x: () => (Math.random() - 0.5) * 240,
        y: () => (Math.random() - 0.5) * 120,
        opacity: 0,
        duration: 0.7,
        stagger: 0.03,
        ease: 'power3.out',
      })
    },
    reactCode: rc(
      `const chars = SplitText.create(el, { type: 'chars' }).chars
gsap.from(chars, {
  x: () => (Math.random() - 0.5) * 240,
  y: () => (Math.random() - 0.5) * 120,
  opacity: 0,
  duration: 0.7,
  stagger: 0.03,
  ease: 'power3.out',
})`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.from(chars, {
  x: () => (Math.random() - 0.5) * 240,
  y: () => (Math.random() - 0.5) * 120,
  opacity: 0, duration: 0.7, stagger: 0.03, ease: 'power3.out',
})`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="split-chars-scatter"]')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.from(chars, {
  x: () => (Math.random() - 0.5) * 240,
  y: () => (Math.random() - 0.5) * 120,
  opacity: 0, duration: 0.7, stagger: 0.03, ease: 'power3.out',
})`
    ),
  },

  // ─── 41. SPLIT WORDS CASCADE ─────────────────────────────────────────────
  {
    id: 41,
    name: 'Split Words Cascade',
    slug: 'split-words-cascade',
    category: 'split',
    tags: ['split', 'words', 'scaleX', 'wipe', 'cascade'],
    difficulty: 'intermediate',
    description: 'Each word wipes open from the left using a scaleX reveal.',
    previewText: 'WORD CASCADE',
    animateFn: (el, g: any) => {
      const words = splitWords(el)
      return g.from(words, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
      })
    },
    reactCode: rc(
      `const words = SplitText.create(el, { type: 'words' }).words
gsap.from(words, {
  scaleX: 0,
  transformOrigin: 'left center',
  duration: 0.5,
  stagger: 0.1,
  ease: 'power3.out',
})`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const words = SplitText.create(el, { type: 'words' }).words
gsap.from(words, { scaleX: 0, transformOrigin: 'left center', duration: 0.5, stagger: 0.1, ease: 'power3.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="split-words-cascade"]')
const words = SplitText.create(el, { type: 'words' }).words
gsap.from(words, { scaleX: 0, transformOrigin: 'left center', duration: 0.5, stagger: 0.1, ease: 'power3.out' })`
    ),
  },

  // ─── 42. STAGGER FROM CENTER ─────────────────────────────────────────────
  {
    id: 42,
    name: 'Stagger From Center',
    slug: 'stagger-from-center',
    category: 'split',
    tags: ['split', 'chars', 'stagger', 'center', 'y'],
    difficulty: 'intermediate',
    description: 'Characters animate outward from the center of the word — balanced and symmetrical.',
    previewText: 'CENTER OUT',
    animateFn: (el, g: any) => {
      const chars = splitChars(el)
      return g.from(chars, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: { each: 0.04, from: 'center' },
        ease: 'power3.out',
      })
    },
    reactCode: rc(
      `const chars = SplitText.create(el, { type: 'chars' }).chars
gsap.from(chars, {
  y: 30, opacity: 0, duration: 0.5,
  stagger: { each: 0.04, from: 'center' },
  ease: 'power3.out',
})`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.from(chars, { y: 30, opacity: 0, duration: 0.5, stagger: { each: 0.04, from: 'center' }, ease: 'power3.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="stagger-from-center"]')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.from(chars, { y: 30, opacity: 0, duration: 0.5, stagger: { each: 0.04, from: 'center' }, ease: 'power3.out' })`
    ),
  },

  // ─── 43. SPLIT CHARS DIAGONAL ────────────────────────────────────────────
  {
    id: 43,
    name: 'Split Chars Diagonal',
    slug: 'split-chars-diagonal',
    category: 'split',
    tags: ['split', 'chars', 'diagonal', 'y', 'stagger'],
    difficulty: 'intermediate',
    description: 'Characters drop in from above with increasing offset — creating a diagonal wave entrance.',
    previewText: 'DIAGONAL',
    animateFn: (el, g: any) => {
      const chars = splitChars(el)
      return g.from(chars, {
        y: 40,
        opacity: 0,
        duration: 0.5,
        stagger: { each: 0.03, from: 'start' },
        ease: 'power2.out',
      })
    },
    reactCode: rc(
      `const chars = SplitText.create(el, { type: 'chars' }).chars
gsap.from(chars, {
  y: 40, opacity: 0, duration: 0.5,
  stagger: { each: 0.03, from: 'start' },
  ease: 'power2.out',
})`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.from(chars, { y: 40, opacity: 0, duration: 0.5, stagger: { each: 0.03, from: 'start' }, ease: 'power2.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="split-chars-diagonal"]')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.from(chars, { y: 40, opacity: 0, duration: 0.5, stagger: { each: 0.03, from: 'start' }, ease: 'power2.out' })`
    ),
  },

  // ─── 44. SPLIT WORDS SCALE ───────────────────────────────────────────────
  {
    id: 44,
    name: 'Split Words Scale',
    slug: 'split-words-scale',
    category: 'split',
    tags: ['split', 'words', 'scale', 'back', 'pop'],
    difficulty: 'intermediate',
    description: 'Words pop into existence from zero scale with a springy back ease.',
    previewText: 'WORD POP',
    animateFn: (el, g: any) => {
      const words = splitWords(el)
      return g.from(words, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(2)',
      })
    },
    reactCode: rc(
      `const words = SplitText.create(el, { type: 'words' }).words
gsap.from(words, { scale: 0, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(2)' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const words = SplitText.create(el, { type: 'words' }).words
gsap.from(words, { scale: 0, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(2)' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="split-words-scale"]')
const words = SplitText.create(el, { type: 'words' }).words
gsap.from(words, { scale: 0, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(2)' })`
    ),
  },

  // ─── 45. SPLIT CHARS FLOAT UP ────────────────────────────────────────────
  {
    id: 45,
    name: 'Split Chars Float Up',
    slug: 'split-chars-float-up',
    category: 'split',
    tags: ['split', 'chars', 'float', 'rotation', 'slow'],
    difficulty: 'intermediate',
    description: 'Characters drift upward with a slight tilt — dreamy and atmospheric.',
    previewText: 'FLOAT UP',
    animateFn: (el, g: any) => {
      const chars = splitChars(el)
      return g.from(chars, {
        y: 50,
        rotation: -8,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power2.out',
      })
    },
    reactCode: rc(
      `const chars = SplitText.create(el, { type: 'chars' }).chars
gsap.from(chars, { y: 50, rotation: -8, opacity: 0, duration: 0.8, stagger: 0.05, ease: 'power2.out' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.from(chars, { y: 50, rotation: -8, opacity: 0, duration: 0.8, stagger: 0.05, ease: 'power2.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="split-chars-float-up"]')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.from(chars, { y: 50, rotation: -8, opacity: 0, duration: 0.8, stagger: 0.05, ease: 'power2.out' })`
    ),
  },

  // ─── 46. SPLIT LINES WIPE ────────────────────────────────────────────────
  {
    id: 46,
    name: 'Split Lines Wipe',
    slug: 'split-lines-wipe',
    category: 'split',
    tags: ['split', 'words', 'clip-path', 'wipe', 'reveal'],
    difficulty: 'advanced',
    description: 'Each word is wiped open with a clip-path reveal from left to right.',
    previewText: 'WIPE REVEAL',
    animateFn: (el, g: any) => {
      const words = splitWords(el)
      g.set(words, { clipPath: 'inset(0 100% 0 0)' })
      return g.to(words, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.6,
        stagger: 0.07,
        ease: 'power3.out',
      })
    },
    reactCode: rc(
      `const words = SplitText.create(el, { type: 'words' }).words
gsap.set(words, { clipPath: 'inset(0 100% 0 0)' })
gsap.to(words, { clipPath: 'inset(0 0% 0 0)', duration: 0.6, stagger: 0.07, ease: 'power3.out' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const words = SplitText.create(el, { type: 'words' }).words
gsap.set(words, { clipPath: 'inset(0 100% 0 0)' })
gsap.to(words, { clipPath: 'inset(0 0% 0 0)', duration: 0.6, stagger: 0.07, ease: 'power3.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="split-lines-wipe"]')
const words = SplitText.create(el, { type: 'words' }).words
gsap.set(words, { clipPath: 'inset(0 100% 0 0)' })
gsap.to(words, { clipPath: 'inset(0 0% 0 0)', duration: 0.6, stagger: 0.07, ease: 'power3.out' })`
    ),
  },

  // ─── 47. WORD SCRAMBLE ───────────────────────────────────────────────────
  {
    id: 47,
    name: 'Word Scramble',
    slug: 'word-scramble',
    category: 'scramble',
    tags: ['scramble', 'words', 'random', 'raf'],
    difficulty: 'intermediate',
    description: 'Each word scrambles through random letters sequentially before resolving.',
    previewText: 'WORD SCRAMBLE',
    animateFn: (el, _g: any) => {
      const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const words = (el.textContent || '').split(' ')
      const spans = words.map(w => {
        const s = document.createElement('span')
        s.style.cssText = 'display:inline-block;margin-right:0.3em'
        s.textContent = w
        return s
      })
      el.innerHTML = ''
      spans.forEach(s => el.appendChild(s))

      const timers: ReturnType<typeof setTimeout>[] = []
      const rafs: number[] = []

      spans.forEach((span, wi) => {
        const target = span.textContent
        let frame = 0
        const total = target.length * 8
        const delay = wi * 120

        const tick = () => {
          span.textContent = target.split('').map((c, i) => {
            if (c === ' ') return ' '
            if (i * 8 < frame) return c
            return pool[Math.floor(Math.random() * pool.length)]
          }).join('')
          frame++
          if (frame <= total) rafs[wi] = requestAnimationFrame(tick)
          else span.textContent = target
        }
        timers[wi] = setTimeout(() => { rafs[wi] = requestAnimationFrame(tick) }, delay)
      })

      return {
        kill() {
          timers.forEach(t => clearTimeout(t))
          rafs.forEach(r => cancelAnimationFrame(r))
        }
      }
    },
    reactCode: rc(
      `const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const words = (el.textContent || '').split(' ')
const spans = words.map(w => {
  const s = document.createElement('span')
  s.style.cssText = 'display:inline-block;margin-right:0.3em'
  s.textContent = w
  return s
})
el.innerHTML = ''
spans.forEach(s => el.appendChild(s))

spans.forEach((span, wi) => {
  const target = span.textContent
  let frame = 0
  const total = target.length * 8
  setTimeout(() => {
    const tick = () => {
      span.textContent = target.split('').map((c, i) =>
        i * 8 < frame ? c : pool[Math.floor(Math.random() * pool.length)]
      ).join('')
      frame++
      if (frame <= total) requestAnimationFrame(tick)
      else span.textContent = target
    }
    requestAnimationFrame(tick)
  }, wi * 120)
})`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const spans = SplitText.create(el, { type: 'words' }).words
spans.forEach((span, wi) => {
  const target = span.textContent
  let frame = 0
  const total = target.length * 8
  setTimeout(() => {
    function tick() {
      span.textContent = target.split('').map((c, i) =>
        i * 8 < frame ? c : pool[Math.floor(Math.random() * pool.length)]
      ).join('')
      frame++
      if (frame <= total) requestAnimationFrame(tick)
      else span.textContent = target
    }
    requestAnimationFrame(tick)
  }, wi * 120)
})`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="word-scramble"]')
const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const spans = SplitText.create(el, { type: 'words' }).words
spans.forEach((span, wi) => {
  const target = span.textContent
  let frame = 0
  const total = target.length * 8
  setTimeout(() => {
    function tick() {
      span.textContent = target.split('').map((c, i) =>
        i * 8 < frame ? c : pool[Math.floor(Math.random() * pool.length)]
      ).join('')
      frame++
      if (frame <= total) requestAnimationFrame(tick)
      else span.textContent = target
    }
    requestAnimationFrame(tick)
  }, wi * 120)
})`
    ),
  },

  // ─── 48. PARTIAL SCRAMBLE ────────────────────────────────────────────────
  {
    id: 48,
    name: 'Partial Scramble',
    slug: 'partial-scramble',
    category: 'scramble',
    tags: ['scramble', 'partial', 'even', 'chars', 'selective'],
    difficulty: 'intermediate',
    description: 'Only even-indexed characters scramble while odd ones stay fixed — a glitchy partial reveal.',
    previewText: 'PARTIAL',
    animateFn: (el, _g: any) => {
      const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      const target = el.textContent || ''
      let frame = 0
      const total = target.length * 10
      let rafId: number

      const tick = () => {
        el.textContent = target.split('').map((c, i) => {
          if (c === ' ') return ' '
          if (i % 2 !== 0) return c
          if (i * 10 < frame) return c
          return pool[Math.floor(Math.random() * pool.length)]
        }).join('')
        frame++
        if (frame <= total) rafId = requestAnimationFrame(tick)
        else el.textContent = target
      }
      rafId = requestAnimationFrame(tick)
      return { kill() { cancelAnimationFrame(rafId) } }
    },
    reactCode: rc(
      `const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const target = el.textContent || ''
let frame = 0
const total = target.length * 10

const tick = () => {
  el.textContent = target.split('').map((c, i) => {
    if (c === ' ') return ' '
    if (i % 2 !== 0) return c
    if (i * 10 < frame) return c
    return pool[Math.floor(Math.random() * pool.length)]
  }).join('')
  frame++
  if (frame <= total) requestAnimationFrame(tick)
  else el.textContent = target
}
requestAnimationFrame(tick)
return () => { frame = total + 1 }`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const target = el.textContent
let frame = 0
const total = target.length * 10
function tick() {
  el.textContent = target.split('').map((c, i) => {
    if (c === ' ') return ' '
    if (i % 2 !== 0) return c
    if (i * 10 < frame) return c
    return pool[Math.floor(Math.random() * pool.length)]
  }).join('')
  frame++
  if (frame <= total) requestAnimationFrame(tick)
  else el.textContent = target
}
requestAnimationFrame(tick)`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="partial-scramble"]')
const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const target = el.textContent
let frame = 0
const total = target.length * 10
function tick() {
  el.textContent = target.split('').map((c, i) => {
    if (c === ' ') return ' '
    if (i % 2 !== 0) return c
    if (i * 10 < frame) return c
    return pool[Math.floor(Math.random() * pool.length)]
  }).join('')
  frame++
  if (frame <= total) requestAnimationFrame(tick)
  else el.textContent = target
}
requestAnimationFrame(tick)`
    ),
  },

  // ─── 49. SCRAMBLE REVEAL ─────────────────────────────────────────────────
  {
    id: 49,
    name: 'Scramble Reveal',
    slug: 'scramble-reveal',
    category: 'scramble',
    tags: ['scramble', 'reveal', 'left-to-right', 'cyber'],
    difficulty: 'intermediate',
    description: 'Text starts fully scrambled and resolves from left to right.',
    previewText: 'REVEAL',
    animateFn: (el, _g: any) => {
      const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*'
      const target = el.textContent || ''
      let frame = 0
      const framesPerChar = 12
      const total = target.length * framesPerChar
      let rafId: number

      const tick = () => {
        const revealed = Math.floor(frame / framesPerChar)
        el.textContent = target.split('').map((c, i) => {
          if (c === ' ') return ' '
          if (i < revealed) return c
          return pool[Math.floor(Math.random() * pool.length)]
        }).join('')
        frame++
        if (frame <= total) rafId = requestAnimationFrame(tick)
        else el.textContent = target
      }
      rafId = requestAnimationFrame(tick)
      return { kill() { cancelAnimationFrame(rafId) } }
    },
    reactCode: rc(
      `const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*'
const target = el.textContent || ''
let frame = 0
const framesPerChar = 12
const total = target.length * framesPerChar
const tick = () => {
  const revealed = Math.floor(frame / framesPerChar)
  el.textContent = target.split('').map((c, i) => {
    if (c === ' ') return ' '
    if (i < revealed) return c
    return pool[Math.floor(Math.random() * pool.length)]
  }).join('')
  frame++
  if (frame <= total) requestAnimationFrame(tick)
  else el.textContent = target
}
requestAnimationFrame(tick)
return () => { frame = total + 1 }`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*'
const target = el.textContent
let frame = 0
const framesPerChar = 12
const total = target.length * framesPerChar
function tick() {
  const revealed = Math.floor(frame / framesPerChar)
  el.textContent = target.split('').map((c, i) => {
    if (c === ' ') return ' '
    if (i < revealed) return c
    return pool[Math.floor(Math.random() * pool.length)]
  }).join('')
  frame++
  if (frame <= total) requestAnimationFrame(tick)
  else el.textContent = target
}
requestAnimationFrame(tick)`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="scramble-reveal"]')
const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*'
const target = el.textContent
let frame = 0
const framesPerChar = 12
const total = target.length * framesPerChar
function tick() {
  const revealed = Math.floor(frame / framesPerChar)
  el.textContent = target.split('').map((c, i) => {
    if (c === ' ') return ' '
    if (i < revealed) return c
    return pool[Math.floor(Math.random() * pool.length)]
  }).join('')
  frame++
  if (frame <= total) requestAnimationFrame(tick)
  else el.textContent = target
}
requestAnimationFrame(tick)`
    ),
  },

  // ─── 50. TYPEWRITER + CURSOR ─────────────────────────────────────────────
  {
    id: 50,
    name: 'Typewriter + Cursor',
    slug: 'typewriter-cursor',
    category: 'typewriter',
    tags: ['typewriter', 'cursor', 'char-by-char', 'blink'],
    difficulty: 'intermediate',
    description: 'Classic typewriter effect with a blinking cursor appended after typing.',
    previewText: 'TYPEWRITER',
    animateFn: (el, g: any) => {
      const target = el.textContent || ''
      el.textContent = ''
      const cursor = document.createElement('span')
      cursor.textContent = '|'
      cursor.style.cssText = 'opacity:1;margin-left:1px'
      el.appendChild(cursor)

      let i = 0
      let cursorTween: any
      const interval = setInterval(() => {
        el.insertBefore(document.createTextNode(target[i] || ''), cursor)
        i++
        if (i >= target.length) {
          clearInterval(interval)
          cursorTween = g.to(cursor, { opacity: 0, duration: 0.4, repeat: -1, yoyo: true, ease: 'none' })
        }
      }, 80)

      return {
        kill() {
          clearInterval(interval)
          if (cursorTween) cursorTween.kill()
        }
      }
    },
    reactCode: rc(
      `const target = el.textContent || ''
el.textContent = ''
const cursor = document.createElement('span')
cursor.textContent = '|'
cursor.style.cssText = 'opacity:1;margin-left:1px'
el.appendChild(cursor)
let i = 0
const interval = setInterval(() => {
  el.insertBefore(document.createTextNode(target[i] || ''), cursor)
  i++
  if (i >= target.length) {
    clearInterval(interval)
    gsap.to(cursor, { opacity: 0, duration: 0.4, repeat: -1, yoyo: true, ease: 'none' })
  }
}, 80)
return () => clearInterval(interval)`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const target = el.textContent
el.textContent = ''
const cursor = document.createElement('span')
cursor.textContent = '|'
cursor.style.cssText = 'opacity:1;margin-left:1px'
el.appendChild(cursor)
let i = 0
const interval = setInterval(() => {
  el.insertBefore(document.createTextNode(target[i] || ''), cursor)
  i++
  if (i >= target.length) {
    clearInterval(interval)
    gsap.to(cursor, { opacity: 0, duration: 0.4, repeat: -1, yoyo: true, ease: 'none' })
  }
}, 80)`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="typewriter-cursor"]')
const target = el.textContent
el.textContent = ''
const cursor = document.createElement('span')
cursor.textContent = '|'
cursor.style.cssText = 'opacity:1;margin-left:1px'
el.appendChild(cursor)
let i = 0
const interval = setInterval(() => {
  el.insertBefore(document.createTextNode(target[i] || ''), cursor)
  i++
  if (i >= target.length) {
    clearInterval(interval)
    gsap.to(cursor, { opacity: 0, duration: 0.4, repeat: -1, yoyo: true, ease: 'none' })
  }
}, 80)`
    ),
  },

  // ─── 51. WORD TYPEWRITER ─────────────────────────────────────────────────
  {
    id: 51,
    name: 'Word Typewriter',
    slug: 'word-typewriter',
    category: 'typewriter',
    tags: ['typewriter', 'words', 'appear', 'stagger'],
    difficulty: 'beginner',
    description: 'Whole words appear one at a time — readable and rhythmic.',
    previewText: 'WORD BY WORD APPEARS',
    animateFn: (el, g: any) => {
      const words = splitWords(el)
      g.set(words, { autoAlpha: 0 })
      return g.to(words, { autoAlpha: 1, duration: 0.01, stagger: 0.18, ease: 'none' })
    },
    reactCode: rc(
      `const words = SplitText.create(el, { type: 'words' }).words
gsap.set(words, { autoAlpha: 0 })
gsap.to(words, { autoAlpha: 1, duration: 0.01, stagger: 0.18, ease: 'none' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const words = SplitText.create(el, { type: 'words' }).words
words.forEach(w => w.style.cssText = 'visibility:hidden')
gsap.to(words, { visibility: 'visible', duration: 0.01, stagger: 0.18 })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="word-typewriter"]')
const words = SplitText.create(el, { type: 'words' }).words
words.forEach(w => w.style.cssText = 'visibility:hidden')
gsap.to(words, { visibility: 'visible', duration: 0.01, stagger: 0.18 })`
    ),
  },

  // ─── 52. DELETE & RETYPE ─────────────────────────────────────────────────
  {
    id: 52,
    name: 'Delete & Retype',
    slug: 'delete-retype',
    category: 'typewriter',
    tags: ['typewriter', 'delete', 'retype', 'backspace', 'loop'],
    difficulty: 'advanced',
    description: 'Text types in, pauses, deletes itself, then retypes — perfect for hero sections.',
    previewText: 'RETYPE ME',
    animateFn: (el, _g: any) => {
      const target = el.textContent || ''
      el.textContent = ''
      let i = 0
      let deleting = false
      let killed = false
      let timerId: ReturnType<typeof setTimeout>

      const tick = () => {
        if (killed) return
        if (!deleting) {
          el.textContent = target.slice(0, i + 1)
          i++
          if (i >= target.length) {
            deleting = true
            timerId = setTimeout(tick, 900)
            return
          }
        } else {
          el.textContent = target.slice(0, i)
          i--
          if (i < 0) {
            i = 0
            deleting = false
            timerId = setTimeout(tick, 300)
            return
          }
        }
        timerId = setTimeout(tick, deleting ? 50 : 80)
      }
      tick()

      return {
        kill() {
          killed = true
          clearTimeout(timerId)
        }
      }
    },
    reactCode: rc(
      `const target = el.textContent || ''
el.textContent = ''
let i = 0, deleting = false
const tick = () => {
  if (!deleting) {
    el.textContent = target.slice(0, i + 1)
    i++
    if (i >= target.length) { deleting = true; setTimeout(tick, 900); return }
  } else {
    el.textContent = target.slice(0, i)
    i--
    if (i < 0) { i = 0; deleting = false; setTimeout(tick, 300); return }
  }
  setTimeout(tick, deleting ? 50 : 80)
}
tick()`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const target = el.textContent
el.textContent = ''
let i = 0, deleting = false
function tick() {
  if (!deleting) {
    el.textContent = target.slice(0, i + 1)
    i++
    if (i >= target.length) { deleting = true; setTimeout(tick, 900); return }
  } else {
    el.textContent = target.slice(0, i)
    i--
    if (i < 0) { i = 0; deleting = false; setTimeout(tick, 300); return }
  }
  setTimeout(tick, deleting ? 50 : 80)
}
tick()`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="delete-retype"]')
const target = el.textContent
el.textContent = ''
let i = 0, deleting = false
function tick() {
  if (!deleting) {
    el.textContent = target.slice(0, i + 1)
    i++
    if (i >= target.length) { deleting = true; setTimeout(tick, 900); return }
  } else {
    el.textContent = target.slice(0, i)
    i--
    if (i < 0) { i = 0; deleting = false; setTimeout(tick, 300); return }
  }
  setTimeout(tick, deleting ? 50 : 80)
}
tick()`
    ),
  },

  // ─── 53. CLIP BOTTOM TO TOP ──────────────────────────────────────────────
  {
    id: 53,
    name: 'Clip Bottom to Top',
    slug: 'clip-bottom-to-top',
    category: 'clip',
    tags: ['clip-path', 'inset', 'reveal', 'vertical', 'bottom'],
    difficulty: 'intermediate',
    description: 'Text is revealed from bottom to top — like a curtain lifting up from beneath.',
    previewText: 'LIFT UP',
    animateFn: (el, g: any) => {
      g.set(el, { clipPath: 'inset(100% 0 0 0)' })
      return g.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 0.7, ease: 'power3.out' })
    },
    reactCode: rc(
      `gsap.set(el, { clipPath: 'inset(100% 0 0 0)' })
gsap.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 0.7, ease: 'power3.out' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
gsap.set(el, { clipPath: 'inset(100% 0 0 0)' })
gsap.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 0.7, ease: 'power3.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="clip-bottom-to-top"]')
gsap.set(el, { clipPath: 'inset(100% 0 0 0)' })
gsap.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 0.7, ease: 'power3.out' })`
    ),
  },

  // ─── 54. DIAGONAL CLIP ───────────────────────────────────────────────────
  {
    id: 54,
    name: 'Diagonal Clip',
    slug: 'diagonal-clip',
    category: 'clip',
    tags: ['clip-path', 'polygon', 'diagonal', 'wipe'],
    difficulty: 'advanced',
    description: 'Text is revealed by a diagonal polygon that sweeps across from the left edge.',
    previewText: 'DIAGONAL',
    animateFn: (el, g: any) => {
      g.set(el, { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' })
      return g.to(el, {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 0.8,
        ease: 'power3.out',
      })
    },
    reactCode: rc(
      `gsap.set(el, { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' })
gsap.to(el, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 0.8, ease: 'power3.out' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
gsap.set(el, { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' })
gsap.to(el, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 0.8, ease: 'power3.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="diagonal-clip"]')
gsap.set(el, { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' })
gsap.to(el, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 0.8, ease: 'power3.out' })`
    ),
  },

  // ─── 55. CLIP CENTER OUT ─────────────────────────────────────────────────
  {
    id: 55,
    name: 'Clip Center Out',
    slug: 'clip-center-out',
    category: 'clip',
    tags: ['clip-path', 'inset', 'center', 'expand', 'reveal'],
    difficulty: 'intermediate',
    description: 'Text expands outward from the center using symmetric inset clip-path.',
    previewText: 'CENTER OUT',
    animateFn: (el, g: any) => {
      g.set(el, { clipPath: 'inset(0 50% 0 50%)' })
      return g.to(el, { clipPath: 'inset(0 0% 0 0%)', duration: 0.7, ease: 'power3.out' })
    },
    reactCode: rc(
      `gsap.set(el, { clipPath: 'inset(0 50% 0 50%)' })
gsap.to(el, { clipPath: 'inset(0 0% 0 0%)', duration: 0.7, ease: 'power3.out' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
gsap.set(el, { clipPath: 'inset(0 50% 0 50%)' })
gsap.to(el, { clipPath: 'inset(0 0% 0 0%)', duration: 0.7, ease: 'power3.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="clip-center-out"]')
gsap.set(el, { clipPath: 'inset(0 50% 0 50%)' })
gsap.to(el, { clipPath: 'inset(0 0% 0 0%)', duration: 0.7, ease: 'power3.out' })`
    ),
  },

  // ─── 56. IRIS OPEN ───────────────────────────────────────────────────────
  {
    id: 56,
    name: 'Iris Open',
    slug: 'iris-open',
    category: 'clip',
    tags: ['clip-path', 'circle', 'iris', 'spotlight', 'custom'],
    difficulty: 'intermediate',
    description: 'A circle grows from a custom position — like an iris or camera aperture opening.',
    previewText: 'IRIS OPEN',
    animateFn: (el, g: any) => {
      g.set(el, { clipPath: 'circle(0% at 30% 50%)' })
      return g.to(el, { clipPath: 'circle(150% at 30% 50%)', duration: 0.8, ease: 'power3.out' })
    },
    reactCode: rc(
      `gsap.set(el, { clipPath: 'circle(0% at 30% 50%)' })
gsap.to(el, { clipPath: 'circle(150% at 30% 50%)', duration: 0.8, ease: 'power3.out' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
gsap.set(el, { clipPath: 'circle(0% at 30% 50%)' })
gsap.to(el, { clipPath: 'circle(150% at 30% 50%)', duration: 0.8, ease: 'power3.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="iris-open"]')
gsap.set(el, { clipPath: 'circle(0% at 30% 50%)' })
gsap.to(el, { clipPath: 'circle(150% at 30% 50%)', duration: 0.8, ease: 'power3.out' })`
    ),
  },

  // ─── 57. STAGGER BLUR CHARS ──────────────────────────────────────────────
  {
    id: 57,
    name: 'Stagger Blur Chars',
    slug: 'stagger-blur-chars',
    category: 'blur',
    tags: ['blur', 'chars', 'stagger', 'filter', 'opacity'],
    difficulty: 'intermediate',
    description: 'Characters emerge from a blurred state in sequence — like focusing a lens.',
    previewText: 'BLUR CHARS',
    animateFn: (el, g: any) => {
      const chars = splitChars(el)
      g.set(chars, { filter: 'blur(6px)', opacity: 0 })
      return g.to(chars, {
        filter: 'blur(0px)',
        opacity: 1,
        duration: 0.5,
        stagger: 0.04,
        ease: 'power2.out',
      })
    },
    reactCode: rc(
      `const chars = SplitText.create(el, { type: 'chars' }).chars
gsap.set(chars, { filter: 'blur(6px)', opacity: 0 })
gsap.to(chars, { filter: 'blur(0px)', opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power2.out' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.cssText = 'display:inline-block;filter:blur(6px);opacity:0'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.to(chars, { filter: 'blur(0px)', opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power2.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="stagger-blur-chars"]')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.cssText = 'display:inline-block;filter:blur(6px);opacity:0'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.to(chars, { filter: 'blur(0px)', opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power2.out' })`
    ),
  },

  // ─── 58. DEPTH OF FIELD ──────────────────────────────────────────────────
  {
    id: 58,
    name: 'Depth of Field',
    slug: 'depth-of-field',
    category: 'blur',
    tags: ['blur', 'words', 'depth', 'focus', 'sequential'],
    difficulty: 'advanced',
    description: 'Words sequentially come into focus, simulating a camera rack focus effect.',
    previewText: 'RACK FOCUS',
    animateFn: (el, g: any) => {
      const words = splitWords(el)
      g.set(words, { filter: 'blur(8px)', opacity: 0.3 })
      const tl = g.timeline()
      words.forEach((w, i) => {
        tl.to(w, { filter: 'blur(0px)', opacity: 1, duration: 0.35, ease: 'power2.out' }, i * 0.2)
      })
      return tl
    },
    reactCode: rc(
      `const words = SplitText.create(el, { type: 'words' }).words
gsap.set(words, { filter: 'blur(8px)', opacity: 0.3 })
const tl = gsap.timeline()
words.forEach((w, i) => {
  tl.to(w, { filter: 'blur(0px)', opacity: 1, duration: 0.35, ease: 'power2.out' }, i * 0.2)
})
return () => tl.kill()`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const words = SplitText.create(el, { type: 'words' }).words
words.forEach(w => w.style.cssText = 'filter:blur(8px);opacity:0.3')
const tl = gsap.timeline()
words.forEach((w, i) => {
  tl.to(w, { filter: 'blur(0px)', opacity: 1, duration: 0.35, ease: 'power2.out' }, i * 0.2)
})`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="depth-of-field"]')
const words = SplitText.create(el, { type: 'words' }).words
words.forEach(w => w.style.cssText = 'filter:blur(8px);opacity:0.3')
const tl = gsap.timeline()
words.forEach((w, i) => {
  tl.to(w, { filter: 'blur(0px)', opacity: 1, duration: 0.35, ease: 'power2.out' }, i * 0.2)
})`
    ),
  },

  // ─── 59. MOTION BLUR ─────────────────────────────────────────────────────
  {
    id: 59,
    name: 'Motion Blur',
    slug: 'motion-blur',
    category: 'blur',
    tags: ['blur', 'x', 'motion', 'speed', 'filter'],
    difficulty: 'intermediate',
    description: 'Text shoots in from the left while a blur effect simulates high-speed motion.',
    previewText: 'MOTION BLUR',
    animateFn: (el, g: any) => {
      g.set(el, { x: -40, filter: 'blur(16px)', opacity: 0 })
      return g.to(el, { x: 0, filter: 'blur(0px)', opacity: 1, duration: 0.7, ease: 'power3.out' })
    },
    reactCode: rc(
      `gsap.set(el, { x: -40, filter: 'blur(16px)', opacity: 0 })
gsap.to(el, { x: 0, filter: 'blur(0px)', opacity: 1, duration: 0.7, ease: 'power3.out' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
gsap.set(el, { x: -40, filter: 'blur(16px)', opacity: 0 })
gsap.to(el, { x: 0, filter: 'blur(0px)', opacity: 1, duration: 0.7, ease: 'power3.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="motion-blur"]')
gsap.set(el, { x: -40, filter: 'blur(16px)', opacity: 0 })
gsap.to(el, { x: 0, filter: 'blur(0px)', opacity: 1, duration: 0.7, ease: 'power3.out' })`
    ),
  },

  // ─── 60. STAGGER SCALE CHARS ─────────────────────────────────────────────
  {
    id: 60,
    name: 'Stagger Scale Chars',
    slug: 'stagger-scale-chars',
    category: 'scale',
    tags: ['scale', 'chars', 'stagger', 'back', 'pop'],
    difficulty: 'intermediate',
    description: 'Each character pops in from zero scale with a springy back ease.',
    previewText: 'SCALE CHARS',
    animateFn: (el, g: any) => {
      const chars = splitChars(el)
      return g.from(chars, {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        stagger: 0.04,
        ease: 'back.out(2)',
      })
    },
    reactCode: rc(
      `const chars = SplitText.create(el, { type: 'chars' }).chars
gsap.from(chars, { scale: 0, opacity: 0, duration: 0.4, stagger: 0.04, ease: 'back.out(2)' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.from(chars, { scale: 0, opacity: 0, duration: 0.4, stagger: 0.04, ease: 'back.out(2)' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="stagger-scale-chars"]')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.from(chars, { scale: 0, opacity: 0, duration: 0.4, stagger: 0.04, ease: 'back.out(2)' })`
    ),
  },

  // ─── 61. ELASTIC POP ─────────────────────────────────────────────────────
  {
    id: 61,
    name: 'Elastic Pop',
    slug: 'elastic-pop',
    category: 'scale',
    tags: ['scale', 'elastic', 'pop', 'spring', 'bounce'],
    difficulty: 'beginner',
    description: 'The entire text pops from nothing with a satisfying elastic overshoot.',
    previewText: 'ELASTIC POP',
    animateFn: (el, g: any) =>
      g.from(el, { scale: 0, opacity: 0, duration: 0.8, ease: 'elastic.out(1.2, 0.4)' }),
    reactCode: rc(`gsap.from(el, { scale: 0, opacity: 0, duration: 0.8, ease: 'elastic.out(1.2, 0.4)' })`),
    vanillaCode: vc(`gsap.from('.text-animate', { scale: 0, opacity: 0, duration: 0.8, ease: 'elastic.out(1.2, 0.4)' })`),
    webflowCode: wc(`gsap.from('[data-animate="elastic-pop"]', { scale: 0, opacity: 0, duration: 0.8, ease: 'elastic.out(1.2, 0.4)' })`),
  },

  // ─── 62. SCALE + ROTATE ──────────────────────────────────────────────────
  {
    id: 62,
    name: 'Scale Rotate',
    slug: 'scale-rotate',
    category: 'scale',
    tags: ['scale', 'rotation', 'opacity', 'combo'],
    difficulty: 'beginner',
    description: 'Text scales up from zero while untwisting from a slight rotation.',
    previewText: 'SCALE ROTATE',
    animateFn: (el, g: any) =>
      g.from(el, { scale: 0, rotation: -15, opacity: 0, duration: 0.7, ease: 'back.out(1.7)' }),
    reactCode: rc(`gsap.from(el, { scale: 0, rotation: -15, opacity: 0, duration: 0.7, ease: 'back.out(1.7)' })`),
    vanillaCode: vc(`gsap.from('.text-animate', { scale: 0, rotation: -15, opacity: 0, duration: 0.7, ease: 'back.out(1.7)' })`),
    webflowCode: wc(`gsap.from('[data-animate="scale-rotate"]', { scale: 0, rotation: -15, opacity: 0, duration: 0.7, ease: 'back.out(1.7)' })`),
  },

  // ─── 63. CONTINUOUS WAVE ─────────────────────────────────────────────────
  {
    id: 63,
    name: 'Continuous Wave',
    slug: 'continuous-wave',
    category: 'wave',
    tags: ['wave', 'chars', 'repeat', 'yoyo', 'continuous'],
    difficulty: 'intermediate',
    description: 'Characters continuously ripple up and down in a perpetual wave — ideal for loading states.',
    previewText: 'WAVE WAVE',
    animateFn: (el, g: any) => {
      const chars = splitChars(el)
      return g.to(chars, {
        y: -10,
        duration: 0.5,
        stagger: { each: 0.06, repeat: -1, yoyo: true },
        ease: 'sine.inOut',
      })
    },
    reactCode: rc(
      `const chars = SplitText.create(el, { type: 'chars' }).chars
gsap.to(chars, {
  y: -10, duration: 0.5,
  stagger: { each: 0.06, repeat: -1, yoyo: true },
  ease: 'sine.inOut',
})`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.to(chars, { y: -10, duration: 0.5, stagger: { each: 0.06, repeat: -1, yoyo: true }, ease: 'sine.inOut' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="continuous-wave"]')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.to(chars, { y: -10, duration: 0.5, stagger: { each: 0.06, repeat: -1, yoyo: true }, ease: 'sine.inOut' })`
    ),
  },

  // ─── 64. DIAGONAL WAVE ───────────────────────────────────────────────────
  {
    id: 64,
    name: 'Diagonal Wave',
    slug: 'diagonal-wave',
    category: 'wave',
    tags: ['wave', 'chars', 'diagonal', 'x', 'y', 'stagger'],
    difficulty: 'intermediate',
    description: 'Characters enter with both vertical and horizontal offset, creating a diagonal wave.',
    previewText: 'DIAGONAL WAVE',
    animateFn: (el, g: any) => {
      const chars = splitChars(el)
      return g.from(chars, {
        x: (i: number) => i * 4,
        y: (i: number) => Math.sin(i * 0.8) * 25,
        opacity: 0,
        duration: 0.6,
        stagger: 0.04,
        ease: 'power2.out',
      })
    },
    reactCode: rc(
      `const chars = SplitText.create(el, { type: 'chars' }).chars
gsap.from(chars, {
  x: (i) => i * 4,
  y: (i) => Math.sin(i * 0.8) * 25,
  opacity: 0, duration: 0.6, stagger: 0.04, ease: 'power2.out',
})`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.from(chars, {
  x: (i) => i * 4,
  y: (i) => Math.sin(i * 0.8) * 25,
  opacity: 0, duration: 0.6, stagger: 0.04, ease: 'power2.out',
})`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="diagonal-wave"]')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.from(chars, {
  x: (i) => i * 4,
  y: (i) => Math.sin(i * 0.8) * 25,
  opacity: 0, duration: 0.6, stagger: 0.04, ease: 'power2.out',
})`
    ),
  },

  // ─── 65. RIPPLE FROM CENTER ──────────────────────────────────────────────
  {
    id: 65,
    name: 'Ripple From Center',
    slug: 'ripple-from-center',
    category: 'wave',
    tags: ['wave', 'chars', 'ripple', 'center', 'stagger'],
    difficulty: 'intermediate',
    description: 'A wave ripples outward from the center character, like a stone dropped in water.',
    previewText: 'RIPPLE',
    animateFn: (el, g: any) => {
      const chars = splitChars(el)
      return g.from(chars, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: { each: 0.05, from: 'center' },
        ease: 'power3.out',
      })
    },
    reactCode: rc(
      `const chars = SplitText.create(el, { type: 'chars' }).chars
gsap.from(chars, {
  y: 30, opacity: 0, duration: 0.5,
  stagger: { each: 0.05, from: 'center' },
  ease: 'power3.out',
})`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.from(chars, { y: 30, opacity: 0, duration: 0.5, stagger: { each: 0.05, from: 'center' }, ease: 'power3.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="ripple-from-center"]')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.from(chars, { y: 30, opacity: 0, duration: 0.5, stagger: { each: 0.05, from: 'center' }, ease: 'power3.out' })`
    ),
  },

  // ─── 66. FREQUENCY PULSE ─────────────────────────────────────────────────
  {
    id: 66,
    name: 'Frequency Pulse',
    slug: 'frequency-pulse',
    category: 'wave',
    tags: ['wave', 'chars', 'scaleY', 'pulse', 'repeat'],
    difficulty: 'advanced',
    description: 'Characters pulse in scaleY like an audio frequency visualizer — perpetual and hypnotic.',
    previewText: 'FREQUENCY',
    animateFn: (el, g: any) => {
      const chars = splitChars(el)
      return g.to(chars, {
        scaleY: (i: number) => 0.4 + Math.random() * 1.4,
        duration: 0.25,
        stagger: { each: 0.04, repeat: -1, yoyo: true },
        ease: 'power1.inOut',
        transformOrigin: 'center bottom',
      })
    },
    reactCode: rc(
      `const chars = SplitText.create(el, { type: 'chars' }).chars
gsap.to(chars, {
  scaleY: () => 0.4 + Math.random() * 1.4,
  duration: 0.25,
  stagger: { each: 0.04, repeat: -1, yoyo: true },
  ease: 'power1.inOut',
  transformOrigin: 'center bottom',
})`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.to(chars, {
  scaleY: () => 0.4 + Math.random() * 1.4,
  duration: 0.25,
  stagger: { each: 0.04, repeat: -1, yoyo: true },
  ease: 'power1.inOut',
  transformOrigin: 'center bottom',
})`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="frequency-pulse"]')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.to(chars, {
  scaleY: () => 0.4 + Math.random() * 1.4,
  duration: 0.25,
  stagger: { each: 0.04, repeat: -1, yoyo: true },
  ease: 'power1.inOut',
  transformOrigin: 'center bottom',
})`
    ),
  },

  // ─── 67. STAGGER 3D FLIP X ───────────────────────────────────────────────
  {
    id: 67,
    name: 'Stagger 3D Flip X',
    slug: 'stagger-3d-flip-x',
    category: 'rotate',
    tags: ['rotate', 'rotateX', '3d', 'flip', 'stagger', 'perspective'],
    difficulty: 'advanced',
    description: 'Characters flip in from a 90° X-axis rotation — cinematic 3D entrance.',
    previewText: '3D FLIP',
    animateFn: (el, g: any) => {
      const chars = splitChars(el)
      g.set(el, { perspective: 400 })
      return g.from(chars, {
        rotateX: 90,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power3.out',
        transformOrigin: 'center top',
      })
    },
    reactCode: rc(
      `const chars = SplitText.create(el, { type: 'chars' }).chars
gsap.set(el, { perspective: 400 })
gsap.from(chars, {
  rotateX: 90, opacity: 0, duration: 0.5, stagger: 0.05,
  ease: 'power3.out', transformOrigin: 'center top',
})`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.set(el, { perspective: 400 })
gsap.from(chars, {
  rotateX: 90, opacity: 0, duration: 0.5, stagger: 0.05,
  ease: 'power3.out', transformOrigin: 'center top',
})`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="stagger-3d-flip-x"]')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.set(el, { perspective: 400 })
gsap.from(chars, {
  rotateX: 90, opacity: 0, duration: 0.5, stagger: 0.05,
  ease: 'power3.out', transformOrigin: 'center top',
})`
    ),
  },

  // ─── 68. PERSPECTIVE TILT IN ─────────────────────────────────────────────
  {
    id: 68,
    name: 'Perspective Tilt In',
    slug: 'perspective-tilt-in',
    category: 'rotate',
    tags: ['rotate', 'rotateX', 'perspective', '3d', 'tilt'],
    difficulty: 'intermediate',
    description: 'The whole text block tilts forward from a horizontal angle into view.',
    previewText: 'TILT FORWARD',
    animateFn: (el, g: any) => {
      g.set(el, { perspective: 600, transformOrigin: 'center bottom' })
      return g.from(el, { rotateX: 40, opacity: 0, duration: 0.8, ease: 'power3.out' })
    },
    reactCode: rc(
      `gsap.set(el, { perspective: 600, transformOrigin: 'center bottom' })
gsap.from(el, { rotateX: 40, opacity: 0, duration: 0.8, ease: 'power3.out' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
gsap.set(el, { perspective: 600, transformOrigin: 'center bottom' })
gsap.from(el, { rotateX: 40, opacity: 0, duration: 0.8, ease: 'power3.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="perspective-tilt-in"]')
gsap.set(el, { perspective: 600, transformOrigin: 'center bottom' })
gsap.from(el, { rotateX: 40, opacity: 0, duration: 0.8, ease: 'power3.out' })`
    ),
  },

  // ─── 69. LETTER SPIN ─────────────────────────────────────────────────────
  {
    id: 69,
    name: 'Letter Spin',
    slug: 'letter-spin',
    category: 'rotate',
    tags: ['rotate', 'chars', 'spin', '360', 'stagger'],
    difficulty: 'intermediate',
    description: 'Each letter completes a full 360° spin before landing in place.',
    previewText: 'SPIN IN',
    animateFn: (el, g: any) => {
      const chars = splitChars(el)
      return g.from(chars, {
        rotation: 360,
        opacity: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: 'power2.out',
      })
    },
    reactCode: rc(
      `const chars = SplitText.create(el, { type: 'chars' }).chars
gsap.from(chars, { rotation: 360, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.from(chars, { rotation: 360, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="letter-spin"]')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.from(chars, { rotation: 360, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out' })`
    ),
  },

  // ─── 70. VHS GLITCH ──────────────────────────────────────────────────────
  {
    id: 70,
    name: 'VHS Glitch',
    slug: 'vhs-glitch',
    category: 'glitch',
    tags: ['glitch', 'vhs', 'skewY', 'opacity', 'timeline'],
    difficulty: 'advanced',
    description: 'Text flickers and skews like a VHS tape rewinding — aggressive and retro.',
    previewText: 'VHS GLITCH',
    animateFn: (el, g: any) => {
      const tl = g.timeline()
      tl.set(el, { opacity: 1 })
        .to(el, { skewY: 6, opacity: 0.8, duration: 0.05 })
        .to(el, { skewY: -4, opacity: 1, duration: 0.05 })
        .to(el, { skewY: 2, opacity: 0.6, x: 4, duration: 0.04 })
        .to(el, { skewY: 0, opacity: 1, x: 0, duration: 0.06, ease: 'power2.out' })
        .to(el, { skewY: -3, opacity: 0.9, duration: 0.04 }, '+=0.1')
        .to(el, { skewY: 0, opacity: 1, duration: 0.08, ease: 'power2.out' })
      return tl
    },
    reactCode: rc(
      `const tl = gsap.timeline()
tl.set(el, { opacity: 1 })
  .to(el, { skewY: 6,  opacity: 0.8, duration: 0.05 })
  .to(el, { skewY: -4, opacity: 1,   duration: 0.05 })
  .to(el, { skewY: 2,  opacity: 0.6, x: 4, duration: 0.04 })
  .to(el, { skewY: 0,  opacity: 1,   x: 0, duration: 0.06, ease: 'power2.out' })
  .to(el, { skewY: -3, opacity: 0.9, duration: 0.04 }, '+=0.1')
  .to(el, { skewY: 0,  opacity: 1,   duration: 0.08, ease: 'power2.out' })
return () => tl.kill()`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const tl = gsap.timeline()
tl.set(el, { opacity: 1 })
  .to(el, { skewY: 6,  opacity: 0.8, duration: 0.05 })
  .to(el, { skewY: -4, opacity: 1,   duration: 0.05 })
  .to(el, { skewY: 2,  opacity: 0.6, x: 4, duration: 0.04 })
  .to(el, { skewY: 0,  opacity: 1,   x: 0, duration: 0.06, ease: 'power2.out' })
  .to(el, { skewY: -3, opacity: 0.9, duration: 0.04 }, '+=0.1')
  .to(el, { skewY: 0,  opacity: 1,   duration: 0.08, ease: 'power2.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="vhs-glitch"]')
const tl = gsap.timeline()
tl.set(el, { opacity: 1 })
  .to(el, { skewY: 6,  opacity: 0.8, duration: 0.05 })
  .to(el, { skewY: -4, opacity: 1,   duration: 0.05 })
  .to(el, { skewY: 2,  opacity: 0.6, x: 4, duration: 0.04 })
  .to(el, { skewY: 0,  opacity: 1,   x: 0, duration: 0.06, ease: 'power2.out' })
  .to(el, { skewY: -3, opacity: 0.9, duration: 0.04 }, '+=0.1')
  .to(el, { skewY: 0,  opacity: 1,   duration: 0.08, ease: 'power2.out' })`
    ),
  },

  // ─── 71. PIXEL SHIFT ─────────────────────────────────────────────────────
  {
    id: 71,
    name: 'Pixel Shift',
    slug: 'pixel-shift',
    category: 'glitch',
    tags: ['glitch', 'chars', 'x', 'random', 'rapid', 'settle'],
    difficulty: 'advanced',
    description: 'Characters jitter sideways rapidly then snap into position.',
    previewText: 'PIXEL SHIFT',
    animateFn: (el, g: any) => {
      const chars = splitChars(el)
      const tl = g.timeline()
      tl.from(chars, { opacity: 0, duration: 0.01 })
        .to(chars, {
          x: () => (Math.random() - 0.5) * 16,
          duration: 0.06,
          stagger: 0.01,
          ease: 'none',
        })
        .to(chars, {
          x: () => (Math.random() - 0.5) * 10,
          duration: 0.05,
          stagger: 0.01,
          ease: 'none',
        })
        .to(chars, { x: 0, duration: 0.15, stagger: 0.01, ease: 'power3.out' })
      return tl
    },
    reactCode: rc(
      `const chars = SplitText.create(el, { type: 'chars' }).chars
const tl = gsap.timeline()
tl.from(chars, { opacity: 0, duration: 0.01 })
  .to(chars, { x: () => (Math.random() - 0.5) * 16, duration: 0.06, stagger: 0.01 })
  .to(chars, { x: () => (Math.random() - 0.5) * 10, duration: 0.05, stagger: 0.01 })
  .to(chars, { x: 0, duration: 0.15, stagger: 0.01, ease: 'power3.out' })
return () => tl.kill()`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
const tl = gsap.timeline()
tl.from(chars, { opacity: 0, duration: 0.01 })
  .to(chars, { x: () => (Math.random() - 0.5) * 16, duration: 0.06, stagger: 0.01 })
  .to(chars, { x: () => (Math.random() - 0.5) * 10, duration: 0.05, stagger: 0.01 })
  .to(chars, { x: 0, duration: 0.15, stagger: 0.01, ease: 'power3.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="pixel-shift"]')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
const tl = gsap.timeline()
tl.from(chars, { opacity: 0, duration: 0.01 })
  .to(chars, { x: () => (Math.random() - 0.5) * 16, duration: 0.06, stagger: 0.01 })
  .to(chars, { x: () => (Math.random() - 0.5) * 10, duration: 0.05, stagger: 0.01 })
  .to(chars, { x: 0, duration: 0.15, stagger: 0.01, ease: 'power3.out' })`
    ),
  },

  // ─── 72. FROM CENTER OUT ─────────────────────────────────────────────────
  {
    id: 72,
    name: 'From Center Out',
    slug: 'from-center-out',
    category: 'stagger',
    tags: ['stagger', 'center', 'chars', 'expand', 'symmetric'],
    difficulty: 'intermediate',
    description: 'Characters animate outward from the center — perfectly symmetrical.',
    previewText: 'CENTER EXPAND',
    animateFn: (el, g: any) => {
      const chars = splitChars(el)
      return g.from(chars, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: { each: 0.05, from: 'center' },
        ease: 'power2.out',
      })
    },
    reactCode: rc(
      `const chars = SplitText.create(el, { type: 'chars' }).chars
gsap.from(chars, { opacity: 0, y: 20, duration: 0.5, stagger: { each: 0.05, from: 'center' }, ease: 'power2.out' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.from(chars, { opacity: 0, y: 20, duration: 0.5, stagger: { each: 0.05, from: 'center' }, ease: 'power2.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="from-center-out"]')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.from(chars, { opacity: 0, y: 20, duration: 0.5, stagger: { each: 0.05, from: 'center' }, ease: 'power2.out' })`
    ),
  },

  // ─── 73. FROM EDGES IN ───────────────────────────────────────────────────
  {
    id: 73,
    name: 'From Edges In',
    slug: 'from-edges-in',
    category: 'stagger',
    tags: ['stagger', 'edges', 'chars', 'inward', 'converge'],
    difficulty: 'intermediate',
    description: 'Characters converge from both edges toward the center.',
    previewText: 'EDGES INWARD',
    animateFn: (el, g: any) => {
      const chars = splitChars(el)
      return g.from(chars, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: { each: 0.05, from: 'edges' },
        ease: 'power2.out',
      })
    },
    reactCode: rc(
      `const chars = SplitText.create(el, { type: 'chars' }).chars
gsap.from(chars, { opacity: 0, y: 20, duration: 0.5, stagger: { each: 0.05, from: 'edges' }, ease: 'power2.out' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.from(chars, { opacity: 0, y: 20, duration: 0.5, stagger: { each: 0.05, from: 'edges' }, ease: 'power2.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="from-edges-in"]')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.from(chars, { opacity: 0, y: 20, duration: 0.5, stagger: { each: 0.05, from: 'edges' }, ease: 'power2.out' })`
    ),
  },

  // ─── 74. END TO START ────────────────────────────────────────────────────
  {
    id: 74,
    name: 'End to Start',
    slug: 'end-to-start',
    category: 'stagger',
    tags: ['stagger', 'end', 'reverse', 'chars', 'right-to-left'],
    difficulty: 'beginner',
    description: 'Characters animate from the last letter to the first — right to left reveal.',
    previewText: 'REVERSE ORDER',
    animateFn: (el, g: any) => {
      const chars = splitChars(el)
      return g.from(chars, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: { each: 0.04, from: 'end' },
        ease: 'power2.out',
      })
    },
    reactCode: rc(
      `const chars = SplitText.create(el, { type: 'chars' }).chars
gsap.from(chars, { opacity: 0, y: 20, duration: 0.4, stagger: { each: 0.04, from: 'end' }, ease: 'power2.out' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.from(chars, { opacity: 0, y: 20, duration: 0.4, stagger: { each: 0.04, from: 'end' }, ease: 'power2.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="end-to-start"]')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
gsap.from(chars, { opacity: 0, y: 20, duration: 0.4, stagger: { each: 0.04, from: 'end' }, ease: 'power2.out' })`
    ),
  },

  // ─── 75. FIBONACCI DELAYS ────────────────────────────────────────────────
  {
    id: 75,
    name: 'Fibonacci Delays',
    slug: 'fibonacci-delays',
    category: 'stagger',
    tags: ['stagger', 'fibonacci', 'delay', 'chars', 'mathematical'],
    difficulty: 'advanced',
    description: 'Characters appear with Fibonacci-scaled delays — mathematical and organic.',
    previewText: 'FIBONACCI',
    animateFn: (el, g: any) => {
      const chars = splitChars(el)
      const fib = (n: number): number => n <= 1 ? n : fib(n - 1) + fib(n - 2)
      return g.from(chars, {
        opacity: 0,
        y: 25,
        duration: 0.4,
        delay: (i: number) => fib(Math.min(i, 7)) * 0.05,
        ease: 'power2.out',
      })
    },
    reactCode: rc(
      `const chars = SplitText.create(el, { type: 'chars' }).chars
const fib = (n) => n <= 1 ? n : fib(n-1) + fib(n-2)
gsap.from(chars, {
  opacity: 0, y: 25, duration: 0.4,
  delay: (i) => fib(Math.min(i, 7)) * 0.05,
  ease: 'power2.out',
})`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
const fib = (n) => n <= 1 ? n : fib(n-1) + fib(n-2)
gsap.from(chars, {
  opacity: 0, y: 25, duration: 0.4,
  delay: (i) => fib(Math.min(i, 7)) * 0.05,
  ease: 'power2.out',
})`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="fibonacci-delays"]')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.display = 'inline-block'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
const fib = (n) => n <= 1 ? n : fib(n-1) + fib(n-2)
gsap.from(chars, {
  opacity: 0, y: 25, duration: 0.4,
  delay: (i) => fib(Math.min(i, 7)) * 0.05,
  ease: 'power2.out',
})`
    ),
  },

  // ─── 76. RUBBER BAND ─────────────────────────────────────────────────────
  {
    id: 76,
    name: 'Rubber Band',
    slug: 'rubber-band',
    category: 'bounce',
    tags: ['bounce', 'scaleX', 'scaleY', 'elastic', 'squash'],
    difficulty: 'intermediate',
    description: 'Text squashes then snaps back — the classic rubber band effect.',
    previewText: 'RUBBER BAND',
    animateFn: (el, g: any) => {
      const tl = g.timeline()
      tl.from(el, { opacity: 0, scaleY: 0.1, scaleX: 1.5, duration: 0.2, ease: 'power2.out' })
        .to(el, { scaleX: 0.8, scaleY: 1.2, duration: 0.15, ease: 'power2.out' })
        .to(el, { scaleX: 1.1, scaleY: 0.9, duration: 0.12 })
        .to(el, { scaleX: 1, scaleY: 1, duration: 0.18, ease: 'elastic.out(1, 0.5)' })
      return tl
    },
    reactCode: rc(
      `const tl = gsap.timeline()
tl.from(el, { opacity: 0, scaleY: 0.1, scaleX: 1.5, duration: 0.2, ease: 'power2.out' })
  .to(el, { scaleX: 0.8, scaleY: 1.2, duration: 0.15 })
  .to(el, { scaleX: 1.1, scaleY: 0.9, duration: 0.12 })
  .to(el, { scaleX: 1, scaleY: 1, duration: 0.18, ease: 'elastic.out(1, 0.5)' })
return () => tl.kill()`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const tl = gsap.timeline()
tl.from(el, { opacity: 0, scaleY: 0.1, scaleX: 1.5, duration: 0.2, ease: 'power2.out' })
  .to(el, { scaleX: 0.8, scaleY: 1.2, duration: 0.15 })
  .to(el, { scaleX: 1.1, scaleY: 0.9, duration: 0.12 })
  .to(el, { scaleX: 1, scaleY: 1, duration: 0.18, ease: 'elastic.out(1, 0.5)' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="rubber-band"]')
const tl = gsap.timeline()
tl.from(el, { opacity: 0, scaleY: 0.1, scaleX: 1.5, duration: 0.2, ease: 'power2.out' })
  .to(el, { scaleX: 0.8, scaleY: 1.2, duration: 0.15 })
  .to(el, { scaleX: 1.1, scaleY: 0.9, duration: 0.12 })
  .to(el, { scaleX: 1, scaleY: 1, duration: 0.18, ease: 'elastic.out(1, 0.5)' })`
    ),
  },

  // ─── 77. SPRING OVERSHOOT ────────────────────────────────────────────────
  {
    id: 77,
    name: 'Spring Overshoot',
    slug: 'spring-overshoot',
    category: 'bounce',
    tags: ['bounce', 'spring', 'words', 'elastic', 'overshoot'],
    difficulty: 'intermediate',
    description: 'Words spring up from below with an aggressive elastic overshoot.',
    previewText: 'SPRING UP',
    animateFn: (el, g: any) => {
      const words = splitWords(el)
      return g.from(words, {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'elastic.out(1.5, 0.3)',
      })
    },
    reactCode: rc(
      `const words = SplitText.create(el, { type: 'words' }).words
gsap.from(words, { y: 60, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'elastic.out(1.5, 0.3)' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const words = SplitText.create(el, { type: 'words' }).words
gsap.from(words, { y: 60, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'elastic.out(1.5, 0.3)' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="spring-overshoot"]')
const words = SplitText.create(el, { type: 'words' }).words
gsap.from(words, { y: 60, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'elastic.out(1.5, 0.3)' })`
    ),
  },

  // ─── 78. HIGHLIGHT SWEEP ─────────────────────────────────────────────────
  {
    id: 78,
    name: 'Highlight Sweep',
    slug: 'highlight-sweep',
    category: 'advanced',
    tags: ['advanced', 'highlight', 'background', 'sweep', 'underline'],
    difficulty: 'advanced',
    description: 'A colored highlight sweeps under the text from left to right, then text fades in.',
    previewText: 'HIGHLIGHT',
    animateFn: (el, g: any) => {
      el.style.cssText += ';position:relative;display:inline-block'
      const hl = document.createElement('span')
      hl.style.cssText = 'position:absolute;bottom:0;left:0;height:35%;width:0%;background:rgba(255,200,0,0.45);z-index:-1;border-radius:2px'
      el.appendChild(hl)
      g.set(el, { opacity: 0 })
      const tl = g.timeline()
      tl.to(el, { opacity: 1, duration: 0.3 })
        .to(hl, { width: '100%', duration: 0.5, ease: 'power3.out' }, 0.1)
      return tl
    },
    reactCode: rc(
      `el.style.cssText += ';position:relative;display:inline-block'
const hl = document.createElement('span')
hl.style.cssText = 'position:absolute;bottom:0;left:0;height:35%;width:0%;background:rgba(255,200,0,0.45);z-index:-1;border-radius:2px'
el.appendChild(hl)
gsap.set(el, { opacity: 0 })
const tl = gsap.timeline()
tl.to(el, { opacity: 1, duration: 0.3 })
  .to(hl, { width: '100%', duration: 0.5, ease: 'power3.out' }, 0.1)
return () => tl.kill()`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
el.style.cssText += ';position:relative;display:inline-block'
const hl = document.createElement('span')
hl.style.cssText = 'position:absolute;bottom:0;left:0;height:35%;width:0%;background:rgba(255,200,0,0.45);z-index:-1;border-radius:2px'
el.appendChild(hl)
gsap.set(el, { opacity: 0 })
const tl = gsap.timeline()
tl.to(el, { opacity: 1, duration: 0.3 })
  .to(hl, { width: '100%', duration: 0.5, ease: 'power3.out' }, 0.1)`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="highlight-sweep"]')
el.style.cssText += ';position:relative;display:inline-block'
const hl = document.createElement('span')
hl.style.cssText = 'position:absolute;bottom:0;left:0;height:35%;width:0%;background:rgba(255,200,0,0.45);z-index:-1;border-radius:2px'
el.appendChild(hl)
gsap.set(el, { opacity: 0 })
const tl = gsap.timeline()
tl.to(el, { opacity: 1, duration: 0.3 })
  .to(hl, { width: '100%', duration: 0.5, ease: 'power3.out' }, 0.1)`
    ),
  },

  // ─── 79. INFINITE MARQUEE ────────────────────────────────────────────────
  {
    id: 79,
    name: 'Infinite Marquee',
    slug: 'infinite-marquee',
    category: 'advanced',
    tags: ['advanced', 'marquee', 'loop', 'repeat', 'infinite', 'scroll'],
    difficulty: 'intermediate',
    description: 'Text scrolls horizontally in an infinite loop — perfect for ticker bars.',
    previewText: 'INFINITE LOOP •',
    animateFn: (el, g: any) => {
      const orig = el.textContent || ''
      el.style.cssText += ';overflow:hidden;white-space:nowrap;display:block'
      const inner = document.createElement('span')
      inner.style.cssText = 'display:inline-block;padding-right:3em'
      inner.textContent = orig
      const clone = inner.cloneNode(true) as HTMLElement
      el.innerHTML = ''
      el.appendChild(inner)
      el.appendChild(clone)
      return g.to([inner, clone], {
        x: '-50%',
        duration: 4,
        ease: 'none',
        repeat: -1,
      })
    },
    reactCode: rc(
      `const orig = el.textContent || ''
el.style.cssText += ';overflow:hidden;white-space:nowrap;display:block'
const inner = document.createElement('span')
inner.style.cssText = 'display:inline-block;padding-right:3em'
inner.textContent = orig
const clone = inner.cloneNode(true)
el.innerHTML = ''
el.appendChild(inner)
el.appendChild(clone)
gsap.to([inner, clone], { x: '-50%', duration: 4, ease: 'none', repeat: -1 })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const orig = el.textContent
el.style.cssText += ';overflow:hidden;white-space:nowrap;display:block'
const inner = document.createElement('span')
inner.style.cssText = 'display:inline-block;padding-right:3em'
inner.textContent = orig
const clone = inner.cloneNode(true)
el.innerHTML = ''
el.appendChild(inner)
el.appendChild(clone)
gsap.to([inner, clone], { x: '-50%', duration: 4, ease: 'none', repeat: -1 })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="infinite-marquee"]')
const orig = el.textContent
el.style.cssText += ';overflow:hidden;white-space:nowrap;display:block'
const inner = document.createElement('span')
inner.style.cssText = 'display:inline-block;padding-right:3em'
inner.textContent = orig
const clone = inner.cloneNode(true)
el.innerHTML = ''
el.appendChild(inner)
el.appendChild(clone)
gsap.to([inner, clone], { x: '-50%', duration: 4, ease: 'none', repeat: -1 })`
    ),
  },

  // ─── 80. KINETIC FLASH ───────────────────────────────────────────────────
  {
    id: 80,
    name: 'Kinetic Flash',
    slug: 'kinetic-flash',
    category: 'advanced',
    tags: ['advanced', 'flash', 'flicker', 'opacity', 'chars', 'stagger'],
    difficulty: 'advanced',
    description: 'Characters flicker rapidly in and out before all settling to full opacity.',
    previewText: 'KINETIC',
    animateFn: (el, g: any) => {
      const chars = splitChars(el)
      g.set(chars, { opacity: 0 })
      const tl = g.timeline()
      tl.to(chars, { opacity: 1, duration: 0.04, stagger: 0.03, ease: 'none' })
        .to(chars, { opacity: 0.1, duration: 0.04, stagger: 0.02, ease: 'none' })
        .to(chars, { opacity: 1, duration: 0.04, stagger: 0.03, ease: 'none' })
        .to(chars, { opacity: 0.2, duration: 0.03, stagger: 0.015, ease: 'none' })
        .to(chars, { opacity: 1, duration: 0.25, stagger: 0.02, ease: 'power2.out' })
      return tl
    },
    reactCode: rc(
      `const chars = SplitText.create(el, { type: 'chars' }).chars
gsap.set(chars, { opacity: 0 })
const tl = gsap.timeline()
tl.to(chars, { opacity: 1,   duration: 0.04, stagger: 0.03 })
  .to(chars, { opacity: 0.1, duration: 0.04, stagger: 0.02 })
  .to(chars, { opacity: 1,   duration: 0.04, stagger: 0.03 })
  .to(chars, { opacity: 0.2, duration: 0.03, stagger: 0.015 })
  .to(chars, { opacity: 1,   duration: 0.25, stagger: 0.02, ease: 'power2.out' })
return () => tl.kill()`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.cssText = 'display:inline-block;opacity:0'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
const tl = gsap.timeline()
tl.to(chars, { opacity: 1,   duration: 0.04, stagger: 0.03 })
  .to(chars, { opacity: 0.1, duration: 0.04, stagger: 0.02 })
  .to(chars, { opacity: 1,   duration: 0.04, stagger: 0.03 })
  .to(chars, { opacity: 0.2, duration: 0.03, stagger: 0.015 })
  .to(chars, { opacity: 1,   duration: 0.25, stagger: 0.02, ease: 'power2.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="kinetic-flash"]')
const chars = [...el.textContent].map(c => {
  const s = document.createElement('span')
  s.style.cssText = 'display:inline-block;opacity:0'
  s.textContent = c
  return s
})
el.innerHTML = ''
chars.forEach(c => el.appendChild(c))
const tl = gsap.timeline()
tl.to(chars, { opacity: 1,   duration: 0.04, stagger: 0.03 })
  .to(chars, { opacity: 0.1, duration: 0.04, stagger: 0.02 })
  .to(chars, { opacity: 1,   duration: 0.04, stagger: 0.03 })
  .to(chars, { opacity: 0.2, duration: 0.03, stagger: 0.015 })
  .to(chars, { opacity: 1,   duration: 0.25, stagger: 0.02, ease: 'power2.out' })`
    ),
  },

  // ─── 81. FADE RIGHT ──────────────────────────────────────────────────────
  {
    id: 81,
    name: 'Fade Right',
    slug: 'fade-right',
    category: 'fade',
    tags: ['fade', 'opacity', 'x', 'horizontal'],
    difficulty: 'beginner',
    description: 'Text slides rightward while fading in — completes the four-direction fade family.',
    previewText: 'FADE RIGHT',
    animateFn: (el, g: any) =>
      g.from(el, { x: -30, opacity: 0, duration: 0.7, ease: 'power3.out' }),
    reactCode: rc(`gsap.from(el, { x: -30, opacity: 0, duration: 0.7, ease: 'power3.out' })`),
    vanillaCode: vc(`gsap.from('.text-animate', { x: -30, opacity: 0, duration: 0.7, ease: 'power3.out' })`),
    webflowCode: wc(`gsap.from('[data-animate="fade-right"]', { x: -30, opacity: 0, duration: 0.7, ease: 'power3.out' })`),
  },

  // ─── 82. SLIDE DOWN ──────────────────────────────────────────────────────
  {
    id: 82,
    name: 'Slide Down',
    slug: 'slide-down',
    category: 'slide',
    tags: ['slide', 'y', 'translate', 'top', 'opacity'],
    difficulty: 'beginner',
    description: 'Text drops down from above while fading in — completes the vertical slide pair.',
    previewText: 'SLIDE DOWN',
    animateFn: (el, g: any) =>
      g.from(el, { y: -60, opacity: 0, duration: 0.7, ease: 'power3.out' }),
    reactCode: rc(`gsap.from(el, { y: -60, opacity: 0, duration: 0.7, ease: 'power3.out' })`),
    vanillaCode: vc(`gsap.from('.text-animate', { y: -60, opacity: 0, duration: 0.7, ease: 'power3.out' })`),
    webflowCode: wc(`gsap.from('[data-animate="slide-down"]', { y: -60, opacity: 0, duration: 0.7, ease: 'power3.out' })`),
  },

  // ─── 83. CLIP RIGHT TO LEFT ──────────────────────────────────────────────
  {
    id: 83,
    name: 'Clip Right to Left',
    slug: 'clip-right-to-left',
    category: 'clip',
    tags: ['clip-path', 'inset', 'reveal', 'wipe', 'horizontal'],
    difficulty: 'intermediate',
    description: 'Text is unmasked from right to left — the mirror of the classic left-to-right wipe.',
    previewText: 'WIPE LEFT',
    animateFn: (el, g: any) => {
      g.set(el, { clipPath: 'inset(0 0 0 100%)' })
      return g.to(el, { clipPath: 'inset(0 0 0 0%)', duration: 0.85, ease: 'power3.inOut' })
    },
    reactCode: rc(
      `gsap.set(el, { clipPath: 'inset(0 0 0 100%)' })
gsap.to(el, { clipPath: 'inset(0 0 0 0%)', duration: 0.85, ease: 'power3.inOut' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
gsap.set(el, { clipPath: 'inset(0 0 0 100%)' })
gsap.to(el, { clipPath: 'inset(0 0 0 0%)', duration: 0.85, ease: 'power3.inOut' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="clip-right-to-left"]')
gsap.set(el, { clipPath: 'inset(0 0 0 100%)' })
gsap.to(el, { clipPath: 'inset(0 0 0 0%)', duration: 0.85, ease: 'power3.inOut' })`
    ),
  },

  // ─── 84. CLIP VERTICAL CENTER ────────────────────────────────────────────
  {
    id: 84,
    name: 'Clip Vertical Center',
    slug: 'clip-vertical-center',
    category: 'clip',
    tags: ['clip-path', 'inset', 'center', 'vertical', 'expand'],
    difficulty: 'intermediate',
    description: 'Text expands from a horizontal center line outward — the vertical mirror of Clip Center Out.',
    previewText: 'OPEN OUT',
    animateFn: (el, g: any) => {
      g.set(el, { clipPath: 'inset(50% 0 50% 0)' })
      return g.to(el, { clipPath: 'inset(0% 0 0% 0)', duration: 0.75, ease: 'power3.out' })
    },
    reactCode: rc(
      `gsap.set(el, { clipPath: 'inset(50% 0 50% 0)' })
gsap.to(el, { clipPath: 'inset(0% 0 0% 0)', duration: 0.75, ease: 'power3.out' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
gsap.set(el, { clipPath: 'inset(50% 0 50% 0)' })
gsap.to(el, { clipPath: 'inset(0% 0 0% 0)', duration: 0.75, ease: 'power3.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="clip-vertical-center"]')
gsap.set(el, { clipPath: 'inset(50% 0 50% 0)' })
gsap.to(el, { clipPath: 'inset(0% 0 0% 0)', duration: 0.75, ease: 'power3.out' })`
    ),
  },

  // ─── 85. SCALE X ─────────────────────────────────────────────────────────
  {
    id: 85,
    name: 'Scale X',
    slug: 'scale-x',
    category: 'scale',
    tags: ['scale', 'scaleX', 'horizontal', 'stretch', 'back'],
    difficulty: 'beginner',
    description: 'Text stretches open on the horizontal axis from center — like a venetian blind opening sideways.',
    previewText: 'STRETCH',
    animateFn: (el, g: any) =>
      g.from(el, { scaleX: 0, opacity: 0, transformOrigin: 'center', duration: 0.6, ease: 'back.out(1.7)' }),
    reactCode: rc(`gsap.from(el, { scaleX: 0, opacity: 0, transformOrigin: 'center', duration: 0.6, ease: 'back.out(1.7)' })`),
    vanillaCode: vc(`gsap.from('.text-animate', { scaleX: 0, opacity: 0, transformOrigin: 'center', duration: 0.6, ease: 'back.out(1.7)' })`),
    webflowCode: wc(`gsap.from('[data-animate="scale-x"]', { scaleX: 0, opacity: 0, transformOrigin: 'center', duration: 0.6, ease: 'back.out(1.7)' })`),
  },

  // ─── 86. SCALE Y ─────────────────────────────────────────────────────────
  {
    id: 86,
    name: 'Scale Y',
    slug: 'scale-y',
    category: 'scale',
    tags: ['scale', 'scaleY', 'vertical', 'expand', 'back'],
    difficulty: 'beginner',
    description: 'Text unfolds downward from the top edge — a vertical-only scale reveal.',
    previewText: 'UNFOLD',
    animateFn: (el, g: any) =>
      g.from(el, { scaleY: 0, opacity: 0, transformOrigin: 'top center', duration: 0.6, ease: 'back.out(1.7)' }),
    reactCode: rc(`gsap.from(el, { scaleY: 0, opacity: 0, transformOrigin: 'top center', duration: 0.6, ease: 'back.out(1.7)' })`),
    vanillaCode: vc(`gsap.from('.text-animate', { scaleY: 0, opacity: 0, transformOrigin: 'top center', duration: 0.6, ease: 'back.out(1.7)' })`),
    webflowCode: wc(`gsap.from('[data-animate="scale-y"]', { scaleY: 0, opacity: 0, transformOrigin: 'top center', duration: 0.6, ease: 'back.out(1.7)' })`),
  },

  // ─── 87. MOTION BLUR RIGHT ───────────────────────────────────────────────
  {
    id: 87,
    name: 'Motion Blur Right',
    slug: 'motion-blur-right',
    category: 'blur',
    tags: ['blur', 'x', 'motion', 'speed', 'filter', 'right'],
    difficulty: 'intermediate',
    description: 'Text shoots in from the right trailing a blur — the mirror of Motion Blur.',
    previewText: 'BLUR RIGHT',
    animateFn: (el, g: any) => {
      g.set(el, { x: 40, filter: 'blur(16px)', opacity: 0 })
      return g.to(el, { x: 0, filter: 'blur(0px)', opacity: 1, duration: 0.7, ease: 'power3.out' })
    },
    reactCode: rc(
      `gsap.set(el, { x: 40, filter: 'blur(16px)', opacity: 0 })
gsap.to(el, { x: 0, filter: 'blur(0px)', opacity: 1, duration: 0.7, ease: 'power3.out' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
gsap.set(el, { x: 40, filter: 'blur(16px)', opacity: 0 })
gsap.to(el, { x: 0, filter: 'blur(0px)', opacity: 1, duration: 0.7, ease: 'power3.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="motion-blur-right"]')
gsap.set(el, { x: 40, filter: 'blur(16px)', opacity: 0 })
gsap.to(el, { x: 0, filter: 'blur(0px)', opacity: 1, duration: 0.7, ease: 'power3.out' })`
    ),
  },

  // ─── 88. MOTION BLUR DOWN ────────────────────────────────────────────────
  {
    id: 88,
    name: 'Motion Blur Down',
    slug: 'motion-blur-down',
    category: 'blur',
    tags: ['blur', 'y', 'motion', 'speed', 'filter', 'top'],
    difficulty: 'intermediate',
    description: 'Text drops from above through a speed blur — cinematic vertical entrance.',
    previewText: 'BLUR DOWN',
    animateFn: (el, g: any) => {
      g.set(el, { y: -30, filter: 'blur(12px)', opacity: 0 })
      return g.to(el, { y: 0, filter: 'blur(0px)', opacity: 1, duration: 0.7, ease: 'power3.out' })
    },
    reactCode: rc(
      `gsap.set(el, { y: -30, filter: 'blur(12px)', opacity: 0 })
gsap.to(el, { y: 0, filter: 'blur(0px)', opacity: 1, duration: 0.7, ease: 'power3.out' })`
    ),
    vanillaCode: vc(
      `const el = document.querySelector('.text-animate')
gsap.set(el, { y: -30, filter: 'blur(12px)', opacity: 0 })
gsap.to(el, { y: 0, filter: 'blur(0px)', opacity: 1, duration: 0.7, ease: 'power3.out' })`
    ),
    webflowCode: wc(
      `const el = document.querySelector('[data-animate="motion-blur-down"]')
gsap.set(el, { y: -30, filter: 'blur(12px)', opacity: 0 })
gsap.to(el, { y: 0, filter: 'blur(0px)', opacity: 1, duration: 0.7, ease: 'power3.out' })`
    ),
  },
]
