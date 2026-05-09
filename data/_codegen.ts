// Shared code-sample generators for both text animations and SVG icons.
// Auto-detects SplitText / DrawSVGPlugin usage in the body string and
// injects the appropriate imports / CDN scripts / register calls.

export const CDN_VER = '3.13.0'
export const CDN = `https://cdnjs.cloudflare.com/ajax/libs/gsap/${CDN_VER}/gsap.min.js`
export const CDN_SPLIT = `https://cdnjs.cloudflare.com/ajax/libs/gsap/${CDN_VER}/SplitText.min.js`
export const CDN_DRAWSVG = `https://cdnjs.cloudflare.com/ajax/libs/gsap/${CDN_VER}/DrawSVGPlugin.min.js`

function detectPlugins(body: string) {
  return {
    split: /\bSplitText\b/.test(body),
    // DrawSVGPlugin is needed whenever the `drawSVG` tween property is used
    // (e.g., `drawSVG: 0`, `drawSVG: '100% 100%'`).
    draw: /\bDrawSVGPlugin\b/.test(body) || /\bdrawSVG\s*:/.test(body),
  }
}

export function rc(body: string, extras = ''): string {
  const { split, draw } = detectPlugins(body)
  const imports: string[] = []
  if (split) imports.push("import { SplitText } from 'gsap/SplitText'")
  if (draw) imports.push("import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'")
  const importBlock = imports.length ? '\n' + imports.join('\n') : ''
  const registerArgs: string[] = []
  if (split) registerArgs.push('SplitText')
  if (draw) registerArgs.push('DrawSVGPlugin')
  const registerBlock = registerArgs.length ? `\n\ngsap.registerPlugin(${registerArgs.join(', ')})` : ''
  return `import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'${importBlock}${extras ? '\n' + extras : ''}${registerBlock}

export default function TextAnimation() {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    ${body.trim()}
  }, [])

  return <h1 ref={ref}>Your Text Here</h1>
}`
}

export function vc(body: string): string {
  const { split, draw } = detectPlugins(body)
  const scripts: string[] = []
  if (split) scripts.push(`<script src="${CDN_SPLIT}"></script>`)
  if (draw) scripts.push(`<script src="${CDN_DRAWSVG}"></script>`)
  const scriptBlock = scripts.length ? '\n' + scripts.join('\n') : ''
  const registerArgs: string[] = []
  if (split) registerArgs.push('SplitText')
  if (draw) registerArgs.push('DrawSVGPlugin')
  const registerLine = registerArgs.length ? `gsap.registerPlugin(${registerArgs.join(', ')})\n  ` : ''
  return `<h1 class="text-animate">Your Text Here</h1>

<script src="${CDN}"></script>${scriptBlock}
<script>
  ${registerLine}${body.trim()}
</script>`
}

export function wc(body: string): string {
  const { split, draw } = detectPlugins(body)
  const scripts: string[] = []
  if (split) scripts.push(`<script src="${CDN_SPLIT}"></script>`)
  if (draw) scripts.push(`<script src="${CDN_DRAWSVG}"></script>`)
  const scriptBlock = scripts.length ? '\n' + scripts.join('\n') : ''
  const registerArgs: string[] = []
  if (split) registerArgs.push('SplitText')
  if (draw) registerArgs.push('DrawSVGPlugin')
  const registerLine = registerArgs.length ? `gsap.registerPlugin(${registerArgs.join(', ')})\n    ` : ''
  return `<!-- Page Settings → Custom Code → Before </body> tag -->
<script src="${CDN}"></script>${scriptBlock}
<script>
  window.Webflow = window.Webflow || []
  window.Webflow.push(function () {
    ${registerLine}${body.trim()}
  })
</script>`
}

// Variant of rc() for SVG icon code samples — renders an <svg> element instead of <h1>
// and types the ref as SVGSVGElement. The body refers to `el` which is the SVG element.
export function rcIcon(body: string, svgMarkup: string): string {
  const { split, draw } = detectPlugins(body)
  const imports: string[] = []
  if (split) imports.push("import { SplitText } from 'gsap/SplitText'")
  if (draw) imports.push("import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'")
  const importBlock = imports.length ? '\n' + imports.join('\n') : ''
  const registerArgs: string[] = []
  if (split) registerArgs.push('SplitText')
  if (draw) registerArgs.push('DrawSVGPlugin')
  const registerBlock = registerArgs.length ? `\n\ngsap.registerPlugin(${registerArgs.join(', ')})` : ''
  return `import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'${importBlock}${registerBlock}

export default function IconAnimation() {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    ${body.trim()}
  }, [])

  return (
    ${svgMarkup}
  )
}`
}

// Variant of vc() for icons — emits the SVG element instead of an <h1>
export function vcIcon(body: string, svgMarkup: string): string {
  const { split, draw } = detectPlugins(body)
  const scripts: string[] = []
  if (split) scripts.push(`<script src="${CDN_SPLIT}"></script>`)
  if (draw) scripts.push(`<script src="${CDN_DRAWSVG}"></script>`)
  const scriptBlock = scripts.length ? '\n' + scripts.join('\n') : ''
  const registerArgs: string[] = []
  if (split) registerArgs.push('SplitText')
  if (draw) registerArgs.push('DrawSVGPlugin')
  const registerLine = registerArgs.length ? `gsap.registerPlugin(${registerArgs.join(', ')})\n  ` : ''
  return `${svgMarkup}

<script src="${CDN}"></script>${scriptBlock}
<script>
  ${registerLine}${body.trim()}
</script>`
}

// Variant of wc() for icons
export function wcIcon(body: string, svgMarkup: string): string {
  const { split, draw } = detectPlugins(body)
  const scripts: string[] = []
  if (split) scripts.push(`<script src="${CDN_SPLIT}"></script>`)
  if (draw) scripts.push(`<script src="${CDN_DRAWSVG}"></script>`)
  const scriptBlock = scripts.length ? '\n' + scripts.join('\n') : ''
  const registerArgs: string[] = []
  if (split) registerArgs.push('SplitText')
  if (draw) registerArgs.push('DrawSVGPlugin')
  const registerLine = registerArgs.length ? `gsap.registerPlugin(${registerArgs.join(', ')})\n    ` : ''
  return `<!-- Embed the SVG markup directly in your Webflow element -->
${svgMarkup}

<!-- Page Settings → Custom Code → Before </body> tag -->
<script src="${CDN}"></script>${scriptBlock}
<script>
  window.Webflow = window.Webflow || []
  window.Webflow.push(function () {
    ${registerLine}${body.trim()}
  })
</script>`
}
