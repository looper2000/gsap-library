import type { Icon } from '@/types'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { rcIcon, vcIcon, wcIcon } from './_codegen'

// ─── DrawSVG lazy registration ────────────────────────────────────────────────
// Plugin is registered on first browser use; SSR-safe.

let _drawRegistered = false
export function ensureDrawSVG() {
  if (_drawRegistered || typeof window === 'undefined') return
  gsap.registerPlugin(DrawSVGPlugin)
  _drawRegistered = true
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Render an icon's paths inside an <svg> markup string for code samples.
function svgMarkup(viewBox: string, paths: string[], indent = '    '): string {
  const pathLines = paths.map(d => `${indent}  <path d="${d}" />`).join('\n')
  return `<svg
${indent}  ref={ref}
${indent}  viewBox="${viewBox}"
${indent}  fill="none"
${indent}  stroke="currentColor"
${indent}  strokeWidth={2}
${indent}  strokeLinecap="round"
${indent}  strokeLinejoin="round"
${indent}>
${pathLines}
${indent}</svg>`
}

function svgMarkupVanilla(viewBox: string, paths: string[]): string {
  const pathLines = paths.map(d => `  <path d="${d}" />`).join('\n')
  return `<svg
  class="icon-animate"
  width="48"
  height="48"
  viewBox="${viewBox}"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
${pathLines}
</svg>`
}

function svgMarkupWebflow(slug: string, viewBox: string, paths: string[]): string {
  const pathLines = paths.map(d => `  <path d="${d}" />`).join('\n')
  return `<svg
  data-icon="${slug}"
  width="48"
  height="48"
  viewBox="${viewBox}"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
${pathLines}
</svg>`
}

// Standard animateFn — draws each path with stagger.
function drawAll(svg: SVGSVGElement, g: any) {
  ensureDrawSVG()
  const paths = svg.querySelectorAll('path')
  return g.from(paths, {
    drawSVG: 0,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power2.inOut',
  })
}

// Build standard React/Vanilla/Webflow code samples for a draw-all icon.
function buildCode(slug: string, viewBox: string, paths: string[]) {
  const reactBody = `const paths = el.querySelectorAll('path')
gsap.from(paths, {
  drawSVG: 0,
  duration: 0.7,
  stagger: 0.08,
  ease: 'power2.inOut',
})`

  const vanillaBody = `const svg = document.querySelector('.icon-animate')
const paths = svg.querySelectorAll('path')
gsap.from(paths, {
  drawSVG: 0,
  duration: 0.7,
  stagger: 0.08,
  ease: 'power2.inOut',
})`

  const webflowBody = `const svg = document.querySelector('[data-icon="${slug}"]')
const paths = svg.querySelectorAll('path')
gsap.from(paths, {
  drawSVG: 0,
  duration: 0.7,
  stagger: 0.08,
  ease: 'power2.inOut',
})`

  return {
    reactCode: rcIcon(reactBody, svgMarkup(viewBox, paths)),
    vanillaCode: vcIcon(vanillaBody, svgMarkupVanilla(viewBox, paths)),
    webflowCode: wcIcon(webflowBody, svgMarkupWebflow(slug, viewBox, paths)),
  }
}

// ─── Icon definitions ─────────────────────────────────────────────────────────

const ARROW_RIGHT_PATHS = ['M5 12h14', 'M13 5l7 7-7 7']
const ARROW_LEFT_PATHS = ['M19 12H5', 'M11 5l-7 7 7 7']
const ARROW_UP_PATHS = ['M12 19V5', 'M5 11l7-7 7 7']
const ARROW_DOWN_PATHS = ['M12 5v14', 'M5 13l7 7 7-7']
const CHEVRON_UP_PATHS = ['M6 15l6-6 6 6']
const CHEVRON_LEFT_PATHS = ['M15 6l-6 6 6 6']
const CHEVRON_RIGHT_PATHS = ['M9 6l6 6-6 6']
const CHECK_PATHS = ['M4 12.5l5 5L20 6.5']
const CROSS_PATHS = ['M6 6l12 12', 'M18 6L6 18']
const HEART_PATHS = ['M12 21s-7.5-4.5-9.5-9.5C1 7.5 4 4 7.5 4c2 0 3.5 1 4.5 2.5C13 5 14.5 4 16.5 4 20 4 23 7.5 21.5 11.5 19.5 16.5 12 21 12 21z']
const STAR_PATHS = ['M12 3l2.6 5.7 6.4.7-4.8 4.4 1.3 6.2L12 17l-5.5 3 1.3-6.2L3 9.4l6.4-.7L12 3z']
const PLAY_PATHS = ['M7 4l13 8-13 8V4z']
const MENU_PATHS = ['M3 6h18', 'M3 12h18', 'M3 18h18']
// UI
const SETTINGS_PATHS = [
  'M12 8a4 4 0 100 8 4 4 0 000-8z',
  'M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z',
]
const USER_PATHS = ['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2', 'M12 11a4 4 0 100-8 4 4 0 000 8z']
const BELL_PATHS = ['M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9', 'M13.73 21a2 2 0 01-3.46 0']
const MAIL_PATHS = ['M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z', 'M22 6l-10 7L2 6']
const LOCK_PATHS = ['M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z', 'M7 11V7a5 5 0 0110 0v4']
const UNLOCK_PATHS = ['M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z', 'M7 11V7a5 5 0 019.9-1']
const EYE_PATHS = ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z', 'M12 15a3 3 0 100-6 3 3 0 000 6z']
const EYE_OFF_PATHS = [
  'M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94',
  'M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19',
  'M14.12 14.12a3 3 0 11-4.24-4.24',
  'M1 1l22 22',
]
const EDIT_PATHS = ['M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7', 'M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z']
const TRASH_PATHS = ['M3 6h18', 'M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2']
const DOWNLOAD_PATHS = ['M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3']
const UPLOAD_PATHS = ['M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4', 'M17 8l-5-5-5 5', 'M12 3v12']
const SHARE_PATHS = ['M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8', 'M16 6l-4-4-4 4', 'M12 2v13']
const LINK_PATHS = ['M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71']
const FILTER_PATHS = ['M22 3H2l8 9.46V19l4 2v-8.54L22 3z']
const INFO_PATHS = ['M12 22a10 10 0 100-20 10 10 0 000 20z', 'M12 16v-4', 'M12 8h.01']
const WARNING_PATHS = ['M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z', 'M12 9v4', 'M12 17h.01']
const QUESTION_PATHS = ['M12 22a10 10 0 100-20 10 10 0 000 20z', 'M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3', 'M12 17h.01']
const LOADER_PATHS = [
  'M12 2v4', 'M12 18v4',
  'M4.93 4.93l2.83 2.83', 'M16.24 16.24l2.83 2.83',
  'M2 12h4', 'M18 12h4',
  'M4.93 19.07l2.83-2.83', 'M16.24 7.76l2.83-2.83',
]
const BOOKMARK_PATHS = ['M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z']
const HOME_PATHS = ['M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z', 'M9 22V12h6v10']
const REFRESH_PATHS = ['M23 4v6h-6', 'M1 20v-6h6', 'M3.51 9a9 9 0 0114.85-3.36L23 10', 'M20.49 15a9 9 0 01-14.85 3.36L1 14']
const EXTERNAL_LINK_PATHS = ['M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6', 'M15 3h6v6', 'M10 14L21 3']
const FOLDER_PATHS = ['M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z']
// Shapes
const CIRCLE_PATHS = ['M12 2a10 10 0 100 20 10 10 0 000-20z']
const SQUARE_PATHS = ['M3 3h18v18H3z']
const TRIANGLE_PATHS = ['M12 2L2 22h20L12 2z']
const DIAMOND_PATHS = ['M12 2l10 10-10 10L2 12 12 2z']
const HEXAGON_PATHS = ['M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z']
const PENTAGON_PATHS = ['M12 2l10 7.5L18 22H6L2 9.5 12 2z']
// Media
const PAUSE_PATHS = ['M6 4v16', 'M18 4v16']
const STOP_PATHS = ['M5 5h14v14H5z']
const SKIP_FORWARD_PATHS = ['M5 4l10 8-10 8V4z', 'M19 5v14']
const VOLUME_PATHS = ['M11 5L6 9H2v6h4l5 4V5z', 'M15.54 8.46a5 5 0 010 7.07']
// Communication
const CHAT_PATHS = ['M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z']
const PHONE_PATHS = ['M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z']
const SEND_PATHS = ['M22 2L11 13', 'M22 2l-7 20-4-9-9-4 20-7z']
const AT_SIGN_PATHS = ['M16 12a4 4 0 11-8 0 4 4 0 018 0z', 'M16 8v5a3 3 0 006 0v-1a10 10 0 10-3.92 7.94']
const HASH_PATHS = ['M4 9h16', 'M4 15h16', 'M10 3L8 21', 'M16 3l-2 18']
// Misc
const CALENDAR_PATHS = ['M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z', 'M16 2v4', 'M8 2v4', 'M3 10h18']
const CLOCK_PATHS = ['M12 22a10 10 0 100-20 10 10 0 000 20z', 'M12 6v6l4 2']
const LOCATION_PATHS = ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z', 'M12 13a3 3 0 100-6 3 3 0 000 6z']
const TAG_PATHS = ['M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z', 'M7 7h.01']
const CAMERA_PATHS = ['M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z', 'M12 17a4 4 0 100-8 4 4 0 000 8z']
// Direction (continued)
const MOVE_PATHS = ['M5 9l-3 3 3 3', 'M9 5l3-3 3 3', 'M9 19l3 3 3-3', 'M19 9l3 3-3 3', 'M2 12h20', 'M12 2v20']
const MAXIMIZE_PATHS = ['M15 3h6v6', 'M9 21H3v-6', 'M21 3l-7 7', 'M3 21l7-7']
const MINIMIZE_PATHS = ['M4 14h6v6', 'M20 10h-6V4', 'M14 10l7-7', 'M3 21l7-7']
const SWAP_PATHS = ['M11 5l-4 4 4 4', 'M7 9V21', 'M13 19l4-4-4-4', 'M17 15V3']
const REPEAT_PATHS = ['M17 1l4 4-4 4', 'M3 11V9a4 4 0 014-4h14', 'M7 23l-4-4 4-4', 'M21 13v2a4 4 0 01-4 4H3']
// UI (continued)
const SAVE_PATHS = ['M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z', 'M17 21v-8H7v8', 'M7 3v5h8']
const COPY_PATHS = ['M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2z', 'M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1']
const PRINT_PATHS = ['M6 9V2h12v7', 'M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2', 'M6 14h12v8H6z']
const UNDO_PATHS = ['M1 4v6h6', 'M3.51 15a9 9 0 102.13-9.36L1 10']
const REDO_PATHS = ['M23 4v6h-6', 'M20.49 15a9 9 0 11-2.13-9.36L23 10']
const POWER_PATHS = ['M18.36 6.64a9 9 0 11-12.73 0', 'M12 2v10']
const FLAG_PATHS = ['M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z', 'M4 22V15']
const SUN_PATHS = [
  'M12 17a5 5 0 100-10 5 5 0 000 10z',
  'M12 1v2', 'M12 21v2',
  'M4.22 4.22l1.42 1.42', 'M18.36 18.36l1.42 1.42',
  'M1 12h2', 'M21 12h2',
  'M4.22 19.78l1.42-1.42', 'M18.36 5.64l1.42-1.42',
]
const MOON_PATHS = ['M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z']
const CLOUD_PATHS = ['M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z']
const CODE_PATHS = ['M16 18l6-6-6-6', 'M8 6l-6 6 6 6']
const TERMINAL_PATHS = ['M4 17l6-6-6-6', 'M12 19h8']
const FILE_PATHS = ['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', 'M14 2v6h6']
const IMAGE_PATHS = ['M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z', 'M8.5 11a2.5 2.5 0 100-5 2.5 2.5 0 000 5z', 'M21 15l-5-5L5 21']
const MUSIC_PATHS = ['M9 18V5l12-2v13', 'M6 21a3 3 0 100-6 3 3 0 000 6z', 'M18 18a3 3 0 100-6 3 3 0 000 6z']
const AWARD_PATHS = ['M12 15a7 7 0 100-14 7 7 0 000 14z', 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12']
// Shapes (continued)
const OCTAGON_PATHS = ['M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2z']
const CRESCENT_PATHS = ['M19 12a7 7 0 11-7-7c0 4 3 7 7 7z']
const HALF_CIRCLE_PATHS = ['M2 12h20a10 10 0 00-20 0z']
const CROSS_SHAPE_PATHS = ['M9 2h6v7h7v6h-7v7H9v-7H2V9h7V2z']
const PILL_PATHS = ['M3 12a4 4 0 014-4h10a4 4 0 010 8H7a4 4 0 01-4-4z']
// Media (continued)
const VIDEO_PATHS = ['M23 7l-7 5 7 5V7z', 'M14 5H3a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2z']
const MIC_PATHS = ['M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z', 'M19 10v2a7 7 0 01-14 0v-2', 'M12 19v4', 'M8 23h8']
const HEADPHONES_PATHS = [
  'M3 18v-6a9 9 0 0118 0v6',
  'M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3z',
  'M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z',
]
// Communication (continued)
const WIFI_PATHS = ['M5 12.55a11 11 0 0114.08 0', 'M1.42 9a16 16 0 0121.16 0', 'M8.53 16.11a6 6 0 016.95 0', 'M12 20h.01']
const BLUETOOTH_PATHS = ['M6.5 6.5l11 11L12 23V1l5.5 5.5-11 11']
const CAST_PATHS = ['M2 16.1A5 5 0 015.9 20', 'M2 12.05A9 9 0 019.95 20', 'M2 8V6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2h-6', 'M2 20h.01']
const RSS_PATHS = ['M4 11a9 9 0 019 9', 'M4 4a16 16 0 0116 16', 'M5 19a1 1 0 11-2 0 1 1 0 012 0z']
// Files & Folders Pack
const FILE_OUTLINE = 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z'
const FILE_CORNER = 'M14 2v6h6'
const FILE_TEXT_PATHS = [FILE_OUTLINE, FILE_CORNER, 'M16 13H8', 'M16 17H8', 'M10 9H8']
const FILE_CODE_PATHS = [FILE_OUTLINE, FILE_CORNER, 'M10 13l-2 2 2 2', 'M14 13l2 2-2 2']
const FILE_IMAGE_PATHS = [FILE_OUTLINE, FILE_CORNER, 'M10 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3z', 'M16 17l-3-3-5 5']
const FILE_MUSIC_PATHS = [FILE_OUTLINE, FILE_CORNER, 'M9 17V12l5-1v5', 'M9 17a1.5 1.5 0 11-1.5-1.5c.5 0 1 .2 1.5.6z', 'M14 16a1.5 1.5 0 11-1.5-1.5c.5 0 1 .2 1.5.6z']
const FILE_VIDEO_PATHS = [FILE_OUTLINE, FILE_CORNER, 'M10 11l5 3-5 3v-6z']
const FILE_PLUS_PATHS = [FILE_OUTLINE, FILE_CORNER, 'M12 11v6', 'M9 14h6']
const FILE_MINUS_PATHS = [FILE_OUTLINE, FILE_CORNER, 'M9 14h6']
const FILE_CHECK_PATHS = [FILE_OUTLINE, FILE_CORNER, 'M9 15l2 2 4-4']
const FILE_X_PATHS = [FILE_OUTLINE, FILE_CORNER, 'M9 13l6 6', 'M15 13l-6 6']
const FILE_SEARCH_PATHS = [FILE_OUTLINE, FILE_CORNER, 'M11.5 17a3.5 3.5 0 100-7 3.5 3.5 0 000 7z', 'M14 19l2 2']
const FILES_PATHS = [
  'M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1V12c0 .9.7 1.6 1.6 1.6h7.5c.9 0 1.6-.7 1.6-1.6V5l-3-3z',
  'M3 7.6v12.8c0 .9.7 1.6 1.6 1.6h7.5',
]
const FOLDER_OPEN_PATHS = ['M6 14l1.45-2.9A2 2 0 019.24 10H20a2 2 0 011.94 2.5l-1.55 6a2 2 0 01-1.94 1.5H4a2 2 0 01-2-2V5a2 2 0 012-2h3.93a2 2 0 011.66.9l.82 1.2a2 2 0 001.66.9H18a2 2 0 012 2v2']
const FOLDER_BASE = 'M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z'
const FOLDER_PLUS_PATHS = [FOLDER_BASE, 'M12 11v6', 'M9 14h6']
const FOLDER_MINUS_PATHS = [FOLDER_BASE, 'M9 14h6']
const FOLDER_X_PATHS = [FOLDER_BASE, 'M9.5 11.5l5 5', 'M14.5 11.5l-5 5']
const FOLDER_CHECK_PATHS = [FOLDER_BASE, 'M9 15l2 2 4-4']
const FOLDER_LOCK_PATHS = [
  'M22 19a2 2 0 01-2 2h-7v-7a2 2 0 012-2h9v5a2 2 0 01-2 2z',
  'M2 19V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2v3',
  'M11 17v-2a2 2 0 014 0v2',
  'M10 17h6v3h-6z',
]
const FOLDER_SEARCH_PATHS = [FOLDER_BASE, 'M11.5 17a2.5 2.5 0 100-5 2.5 2.5 0 000 5z', 'M14 18l2 2']
const ARCHIVE_PATHS = ['M21 8v13H3V8', 'M1 3h22v5H1z', 'M10 12h4']
const INBOX_PATHS = [
  'M22 12h-6l-2 3h-4l-2-3H2',
  'M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z',
]
const LAYERS_PATHS = ['M12 2L2 7l10 5 10-5-10-5z', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5']
const CLIPBOARD_PATHS = [
  'M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2',
  'M9 2h6a1 1 0 011 1v2a1 1 0 01-1 1H9a1 1 0 01-1-1V3a1 1 0 011-1z',
]
const CLIPBOARD_LIST_PATHS = [
  'M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2',
  'M9 2h6a1 1 0 011 1v2a1 1 0 01-1 1H9a1 1 0 01-1-1V3a1 1 0 011-1z',
  'M12 11h4', 'M12 16h4', 'M8 11h.01', 'M8 16h.01',
]
const CLIPBOARD_CHECK_PATHS = [
  'M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2',
  'M9 2h6a1 1 0 011 1v2a1 1 0 01-1 1H9a1 1 0 01-1-1V3a1 1 0 011-1z',
  'M9 14l2 2 4-4',
]
const NOTEBOOK_PATHS = [
  'M2 6h4', 'M2 10h4', 'M2 14h4', 'M2 18h4',
  'M21 5H8a2 2 0 00-2 2v12a2 2 0 002 2h13a1 1 0 001-1V6a1 1 0 00-1-1z',
]
// Pack 2 — Communication & Social
const MESSAGE_CIRCLE_PATHS = ['M7.9 20A9 9 0 104 16.1L2 22z']
const MESSAGES_PATHS = [
  'M14 9a2 2 0 01-2 2H6l-4 4V4a2 2 0 012-2h8a2 2 0 012 2z',
  'M18 9h2a2 2 0 012 2v11l-4-4h-6a2 2 0 01-2-2v-1',
]
const REPLY_PATHS = ['M9 17l-5-5 5-5', 'M20 18v-2a4 4 0 00-4-4H4']
const FORWARD_PATHS = ['M15 17l5-5-5-5', 'M4 18v-2a4 4 0 014-4h12']
const MEGAPHONE_PATHS = ['M3 11l18-5v12L3 14v-3z', 'M11.6 16.8a3 3 0 11-5.8-1.6']
const RADIO_PATHS = [
  'M4.9 19.1c-1.6-1.6-2.4-3.7-2.4-5.8 0-2.1.8-4.2 2.4-5.8',
  'M19.1 19.1c1.6-1.6 2.4-3.7 2.4-5.8 0-2.1-.8-4.2-2.4-5.8',
  'M7.7 16.3c-1-1-1.5-2.3-1.5-3.6 0-1.3.5-2.6 1.5-3.6',
  'M16.3 7.7c1 1 1.5 2.3 1.5 3.6s-.5 2.6-1.5 3.6',
  'M12 13a1 1 0 100-2 1 1 0 000 2z',
]
const HEADSET_PATHS = [
  'M3 11a9 9 0 0118 0',
  'M3 11h3v6H4a1 1 0 01-1-1v-5z',
  'M21 11h-3v6h2a1 1 0 001-1v-5z',
  'M12 17v3a2 2 0 002 2h2',
]
const MAIL_OPEN_PATHS = [
  'M21.2 8.4c.5.4.8 1 .8 1.6V19a2 2 0 01-2 2H4a2 2 0 01-2-2V10a2 2 0 01.8-1.6L12 2l9.2 6.4z',
  'M22 10l-10 7L2 10',
]
const VOICEMAIL_PATHS = [
  'M5.5 16a4.5 4.5 0 110-9 4.5 4.5 0 010 9z',
  'M18.5 16a4.5 4.5 0 110-9 4.5 4.5 0 010 9z',
  'M5.5 16h13',
]
const GLOBE_PATHS = [
  'M12 22a10 10 0 100-20 10 10 0 000 20z',
  'M2 12h20',
  'M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z',
]
const USERS_PATHS = [
  'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2',
  'M9 11a4 4 0 100-8 4 4 0 000 8z',
  'M22 21v-2a4 4 0 00-3-3.87',
  'M16 3.13a4 4 0 010 7.75',
]
const USER_BASE = ['M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2', 'M9 11a4 4 0 100-8 4 4 0 000 8z']
const USER_PLUS_PATHS = [...USER_BASE, 'M19 8v6', 'M22 11h-6']
const USER_X_PATHS = [...USER_BASE, 'M17 8l5 5', 'M22 8l-5 5']
const USER_CHECK_PATHS = [...USER_BASE, 'M16 11l2 2 4-4']
const SIGNAL_PATHS = ['M2 20h.01', 'M7 20v-4', 'M12 20v-8', 'M17 20V8', 'M22 4v16']
const BROADCAST_PATHS = [
  'M22 12a10 10 0 01-3.5 7.6',
  'M2 12a10 10 0 003.5 7.6',
  'M19 12a7 7 0 01-2 4.95',
  'M7 16.95A7 7 0 015 12',
  'M16 12a4 4 0 11-8 0 4 4 0 018 0z',
]
// Social brands
const GITHUB_PATHS = ['M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22']
const TWITTER_X_PATHS = ['M4 4l7.4 9.5L4 22h2.2l6.4-7.5L18 22h4l-7.5-9.7L21 4h-2.2l-5.6 6.5L9 4H4z']
const FACEBOOK_PATHS = ['M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z']
const INSTAGRAM_PATHS = [
  'M2 6a4 4 0 014-4h12a4 4 0 014 4v12a4 4 0 01-4 4H6a4 4 0 01-4-4V6z',
  'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z',
  'M17.5 6.5h.01',
]
const LINKEDIN_PATHS = [
  'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z',
  'M2 9h4v12H2z',
  'M4 4a2 2 0 100 4 2 2 0 000-4z',
]
const YOUTUBE_PATHS = [
  'M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-2A29 29 0 0023 12a29 29 0 00-.46-5.58z',
  'M9.75 15.02l5.75-3.27-5.75-3.27v6.54z',
]
const DISCORD_PATHS = [
  'M7.5 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z',
  'M16.5 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z',
  'M5.5 4.5a16.55 16.55 0 0113 0',
  'M5.5 19.5a16.55 16.55 0 0013 0',
  'M5.5 4.5L3 6v12l2.5 1.5',
  'M18.5 4.5L21 6v12l-2.5 1.5',
]
const DRIBBBLE_PATHS = [
  'M12 22a10 10 0 100-20 10 10 0 000 20z',
  'M19 5A17 17 0 008.79 21.74',
  'M2.65 13.92A17 17 0 0119 17.61',
  'M16 3.62A17 17 0 005 16.41',
]
const PINTEREST_PATHS = [
  'M12 22a10 10 0 100-20 10 10 0 000 20z',
  'M9 21l3-13',
  'M9 11a3 3 0 116 0c0 2.5-2 4-3 4',
]
// Pack 3 — Tools & Editing
const BOLD_PATHS = ['M6 4h7a4 4 0 014 4 4 4 0 01-4 4H6V4z', 'M6 12h8a4 4 0 014 4 4 4 0 01-4 4H6v-8z']
const ITALIC_PATHS = ['M19 4h-9', 'M14 20H5', 'M15 4l-6 16']
const UNDERLINE_PATHS = ['M6 3v7a6 6 0 0012 0V3', 'M4 21h16']
const STRIKETHROUGH_PATHS = ['M16 4H9a3 3 0 00-2.83 4', 'M14 12a4 4 0 010 8H6', 'M4 12h16']
const ALIGN_LEFT_PATHS = ['M17 10H3', 'M21 6H3', 'M21 14H3', 'M17 18H3']
const ALIGN_CENTER_PATHS = ['M18 10H6', 'M21 6H3', 'M21 14H3', 'M18 18H6']
const ALIGN_RIGHT_PATHS = ['M21 10H7', 'M21 6H3', 'M21 14H3', 'M21 18H7']
const ALIGN_JUSTIFY_PATHS = ['M21 10H3', 'M21 6H3', 'M21 14H3', 'M21 18H3']
const LIST_PATHS = ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01']
const LIST_ORDERED_PATHS = ['M10 6h11', 'M10 12h11', 'M10 18h11', 'M4 6h1v4', 'M4 10h2', 'M6 18H4c0-1 2-2 2-3s-1-1.5-2-1']
const LIST_CHECKS_PATHS = ['M11 6h10', 'M11 12h10', 'M11 18h10', 'M3 6l1.5 1.5L7 4', 'M3 12l1.5 1.5L7 10', 'M3 18l1.5 1.5L7 16']
const TYPE_PATHS = ['M4 7V4h16v3', 'M9 20h6', 'M12 4v16']
const QUOTE_PATHS = [
  'M3 21c3 0 7-1 7-8V5a2 2 0 00-2-2H4a2 2 0 00-2 2v6a2 2 0 002 2h2',
  'M15 21c3 0 7-1 7-8V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v6a2 2 0 002 2h2',
]
const PEN_TOOL_PATHS = [
  'M12 19l7-7 3 3-7 7-3-3z',
  'M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z',
  'M2 2l7.586 7.586',
  'M11 11a2 2 0 100-4 2 2 0 000 4z',
]
const BRUSH_PATHS = [
  'M9.06 11.9l8.07-8.06a2.85 2.85 0 014.03 4.03l-8.06 8.08',
  'M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04 0-1.67-1.34-3.02-3-3.02z',
]
const PALETTE_PATHS = [
  'M12 22a10 10 0 010-20 10 10 0 010 20c-3 0-3-3.5-3-3.5s2-1.5-1-3.5c-2 0-3 1-3 1z',
  'M13.5 6.5a1 1 0 11-2 0 1 1 0 012 0z',
  'M17.5 10.5a1 1 0 11-2 0 1 1 0 012 0z',
  'M8.5 7.5a1 1 0 11-2 0 1 1 0 012 0z',
  'M6.5 12.5a1 1 0 11-2 0 1 1 0 012 0z',
]
const ERASER_PATHS = [
  'M20 20H7l-4-4 9.5-9.5a2.4 2.4 0 013.4 0l4.5 4.5a2.4 2.4 0 010 3.4z',
  'M22 22H7',
]
const RULER_PATHS = [
  'M21.3 8.7L8.7 21.3a2.4 2.4 0 01-3.4 0L2.7 18.7a2.4 2.4 0 010-3.4L15.3 2.7a2.4 2.4 0 013.4 0l2.6 2.6a2.4 2.4 0 010 3.4z',
  'M7.5 10.5l2 2', 'M10.5 7.5l2 2', 'M13.5 4.5l2 2', 'M4.5 13.5l2 2',
]
const SCISSORS_PATHS = [
  'M6 9.5a3 3 0 100-6 3 3 0 000 6z',
  'M6 20.5a3 3 0 100-6 3 3 0 000 6z',
  'M20 4L8.12 15.88',
  'M14.47 14.48L20 20',
  'M8.12 8.12L12 12',
]
const PAPERCLIP_PATHS = ['M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48']
const MAGNET_PATHS = [
  'M6 15a6 6 0 0012 0V3h-4v12a2 2 0 11-4 0V3H6v12z',
  'M6 8h4', 'M14 8h4',
]
const WRENCH_PATHS = ['M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z']
const HAMMER_PATHS = [
  'M15 12l-8.4 8.4a2.1 2.1 0 11-3-3l8.4-8.4',
  'M17.6 6.6L22 11l-3.5 3.5-7-7L15 4l2.6 2.6z',
]
const KEY_PATHS = [
  'M21 2l-9.6 9.6a5 5 0 11-3-3L18 1l3 1z',
  'M15.5 7.5l1 1',
]
const TARGET_PATHS = [
  'M12 22a10 10 0 100-20 10 10 0 000 20z',
  'M12 18a6 6 0 100-12 6 6 0 000 12z',
  'M12 14a2 2 0 100-4 2 2 0 000 4z',
]
// Pack 4 — Commerce, Weather, Lifestyle
const SHOPPING_CART_PATHS = [
  'M9 22a1 1 0 100-2 1 1 0 000 2z',
  'M20 22a1 1 0 100-2 1 1 0 000 2z',
  'M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6',
]
const SHOPPING_BAG_PATHS = [
  'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z',
  'M3 6h18',
  'M16 10a4 4 0 11-8 0',
]
const CREDIT_CARD_PATHS = [
  'M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2z',
  'M1 10h22',
]
const WALLET_PATHS = [
  'M20 12V8a2 2 0 00-2-2H4a2 2 0 100 4h17a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6',
  'M18 14a1 1 0 11-2 0 1 1 0 012 0z',
]
const RECEIPT_PATHS = [
  'M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2z',
  'M16 8H8', 'M16 12H8', 'M13 16H8',
]
const GIFT_PATHS = [
  'M20 12v10H4V12',
  'M2 7h20v5H2z',
  'M12 22V7',
  'M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z',
]
const TRUCK_PATHS = [
  'M1 3h15v13H1z',
  'M16 8h4l3 3v5h-7V8z',
  'M5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  'M18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
]
const PACKAGE_BOX_PATHS = [
  'M12.89 1.45l8 4A2 2 0 0122 7.24v9.53a2 2 0 01-1.11 1.79l-8 4a2 2 0 01-1.79 0l-8-4a2 2 0 01-1.1-1.8V7.24a2 2 0 011.11-1.79l8-4a2 2 0 011.78 0z',
  'M2.32 6.16L12 11l9.68-4.84',
  'M12 22.76V11',
]
const DOLLAR_SIGN_PATHS = ['M12 1v22', 'M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6']
const PERCENT_PATHS = ['M19 5L5 19', 'M6.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5z', 'M17.5 20a2.5 2.5 0 100-5 2.5 2.5 0 000 5z']
const CLOUD_RAIN_PATHS = [
  'M16 13a4 4 0 002.99-6.65A6 6 0 008 8a4 4 0 00-2 7.66',
  'M8 19v2', 'M8 13v2', 'M16 19v2', 'M16 13v2', 'M12 21v2', 'M12 15v2',
]
const CLOUD_SNOW_PATHS = [
  'M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25',
  'M8 16h.01', 'M8 20h.01', 'M12 18h.01', 'M12 22h.01', 'M16 16h.01', 'M16 20h.01',
]
const CLOUD_LIGHTNING_PATHS = [
  'M19 16.9A5 5 0 0018 7h-1.26a8 8 0 10-11.62 9',
  'M13 11l-4 6h6l-4 6',
]
const CLOUD_DRIZZLE_PATHS = [
  'M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25',
  'M8 19v1', 'M8 14v1', 'M16 19v1', 'M16 14v1', 'M12 21v1', 'M12 16v1',
]
const RAINBOW_PATHS = [
  'M22 17a10 10 0 00-20 0',
  'M19 17a7 7 0 00-14 0',
  'M16 17a4 4 0 00-8 0',
]
const WIND_PATHS = [
  'M9.59 4.59A2 2 0 1111 8H2',
  'M17.73 2.46A2 2 0 1119.07 6H2',
  'M12.5 18A2.5 2.5 0 119 16.5H2',
]
const THERMOMETER_PATHS = ['M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z']
const DROPLET_PATHS = ['M12 2.69l5.66 5.66a8 8 0 11-11.32 0z']
const SNOWFLAKE_PATHS = [
  'M2 12h20',
  'M12 2v20',
  'M5 5l14 14',
  'M19 5L5 19',
]
const UMBRELLA_PATHS = [
  'M23 12a11.05 11.05 0 00-22 0',
  'M5 12c0 1.66-2 3-2 5a3 3 0 006 0',
  'M12 12V2',
]
const COFFEE_PATHS = [
  'M18 8h1a4 4 0 010 8h-1',
  'M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z',
  'M6 1v3', 'M10 1v3', 'M14 1v3',
]
const PIZZA_PATHS = [
  'M12 2L3 13l9 9 9-9-9-11z',
  'M9 11h.01', 'M14 13h.01', 'M11 16h.01',
]
const GEM_PATHS = ['M6 3h12l4 6-10 13L2 9l4-6z', 'M11 3l4 6-3 13M2 9h20']
const BOOK_PATHS = [
  'M4 19.5A2.5 2.5 0 016.5 17H20',
  'M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z',
]
const LEAF_PATHS = [
  'M11 20A7 7 0 014 13c0-2.4 1.4-5.5 3.4-8.5A6.5 6.5 0 0120 11a7 7 0 01-9 9z',
  'M2 22c5-5 8-9 13-13',
]
// Misc (continued)
const ACTIVITY_PATHS = ['M22 12h-4l-3 9L9 3l-3 9H2']
const TRENDING_UP_PATHS = ['M23 6l-9.5 9.5-5-5L1 18', 'M17 6h6v6']
const BAR_CHART_PATHS = ['M12 20V10', 'M18 20V4', 'M6 20v-4']
const PIE_CHART_PATHS = ['M21.21 15.89A10 10 0 118 2.83', 'M22 12A10 10 0 0012 2v10z']
const COMPASS_PATHS = ['M12 22a10 10 0 100-20 10 10 0 000 20z', 'M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z']
const MAP_PATHS = ['M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z', 'M8 2v16', 'M16 6v16']
const BATTERY_PATHS = ['M5 18H3a2 2 0 01-2-2V8a2 2 0 012-2h16a2 2 0 012 2v8a2 2 0 01-2 2h-2', 'M23 13v-2']
const SEARCH_PATHS = [
  'M11 19a8 8 0 100-16 8 8 0 000 16z',
  'M17 17l5 5',
]
const PLUS_PATHS = ['M12 4v16', 'M4 12h16']
const CHEVRON_DOWN_PATHS = ['M6 9l6 6 6-6']

const VB = '0 0 24 24'

export const icons: Icon[] = [
  {
    id: 1,
    name: 'Arrow Right',
    slug: 'arrow-right',
    category: 'arrow',
    tags: ['arrow', 'direction', 'next'],
    difficulty: 'beginner',
    description: 'Single-path arrow that draws horizontally then sketches its head — clean directional cue.',
    viewBox: VB,
    paths: ARROW_RIGHT_PATHS,
    animateFn: drawAll,
    ...buildCode('arrow-right', VB, ARROW_RIGHT_PATHS),
  },
  {
    id: 2,
    name: 'Check',
    slug: 'check',
    category: 'ui',
    tags: ['check', 'success', 'tick', 'confirm'],
    difficulty: 'beginner',
    description: 'Single zig-zag stroke draws on like a confident pen mark — perfect for success states.',
    viewBox: VB,
    paths: CHECK_PATHS,
    animateFn: drawAll,
    ...buildCode('check', VB, CHECK_PATHS),
  },
  {
    id: 3,
    name: 'Cross',
    slug: 'cross',
    category: 'ui',
    tags: ['close', 'cross', 'x', 'cancel', 'stagger'],
    difficulty: 'beginner',
    description: 'Two diagonal strokes draw on with a small stagger — great as an error or close gesture.',
    viewBox: VB,
    paths: CROSS_PATHS,
    animateFn: drawAll,
    ...buildCode('cross', VB, CROSS_PATHS),
  },
  {
    id: 4,
    name: 'Heart',
    slug: 'heart',
    category: 'ui',
    tags: ['heart', 'love', 'favorite', 'wishlist'],
    difficulty: 'intermediate',
    description: 'Closed heart path traces around its silhouette like a continuous pen line.',
    viewBox: VB,
    paths: HEART_PATHS,
    animateFn: drawAll,
    ...buildCode('heart', VB, HEART_PATHS),
  },
  {
    id: 5,
    name: 'Star',
    slug: 'star',
    category: 'shape',
    tags: ['star', 'rating', 'shape', 'closed-path'],
    difficulty: 'intermediate',
    description: 'Five-point star draws around its perimeter as a single continuous stroke.',
    viewBox: VB,
    paths: STAR_PATHS,
    animateFn: drawAll,
    ...buildCode('star', VB, STAR_PATHS),
  },
  {
    id: 6,
    name: 'Play',
    slug: 'play',
    category: 'media',
    tags: ['play', 'media', 'video', 'triangle'],
    difficulty: 'beginner',
    description: 'Triangle play button traces around its three edges — punchy media cue.',
    viewBox: VB,
    paths: PLAY_PATHS,
    animateFn: drawAll,
    ...buildCode('play', VB, PLAY_PATHS),
  },
  {
    id: 7,
    name: 'Menu',
    slug: 'menu',
    category: 'ui',
    tags: ['menu', 'hamburger', 'lines', 'stagger'],
    difficulty: 'beginner',
    description: 'Three horizontal lines stagger in left-to-right — the classic hamburger menu reveal.',
    viewBox: VB,
    paths: MENU_PATHS,
    animateFn: drawAll,
    ...buildCode('menu', VB, MENU_PATHS),
  },
  {
    id: 8,
    name: 'Search',
    slug: 'search',
    category: 'ui',
    tags: ['search', 'magnifier', 'circle', 'stagger'],
    difficulty: 'intermediate',
    description: 'Magnifier circle draws around itself, then the handle dashes out — two-step stagger.',
    viewBox: VB,
    paths: SEARCH_PATHS,
    animateFn: drawAll,
    ...buildCode('search', VB, SEARCH_PATHS),
  },
  {
    id: 9,
    name: 'Plus',
    slug: 'plus',
    category: 'ui',
    tags: ['plus', 'add', 'create', 'stagger'],
    difficulty: 'beginner',
    description: 'Vertical and horizontal strokes draw in sequence — a satisfying add gesture.',
    viewBox: VB,
    paths: PLUS_PATHS,
    animateFn: drawAll,
    ...buildCode('plus', VB, PLUS_PATHS),
  },
  {
    id: 10,
    name: 'Chevron Down',
    slug: 'chevron-down',
    category: 'arrow',
    tags: ['chevron', 'down', 'arrow', 'expand'],
    difficulty: 'beginner',
    description: 'Single V stroke draws from one shoulder down to the point and back up — disclosure cue.',
    viewBox: VB,
    paths: CHEVRON_DOWN_PATHS,
    animateFn: drawAll,
    ...buildCode('chevron-down', VB, CHEVRON_DOWN_PATHS),
  },
  // ─── Arrows (continued) ────────────────────────────────────────────────
  { id: 11, name: 'Arrow Left', slug: 'arrow-left', category: 'arrow',
    tags: ['arrow', 'left', 'direction', 'back'], difficulty: 'beginner',
    description: 'Mirror of Arrow Right — line draws toward the left, head sketches in.',
    viewBox: VB, paths: ARROW_LEFT_PATHS, animateFn: drawAll,
    ...buildCode('arrow-left', VB, ARROW_LEFT_PATHS) },
  { id: 12, name: 'Arrow Up', slug: 'arrow-up', category: 'arrow',
    tags: ['arrow', 'up', 'direction'], difficulty: 'beginner',
    description: 'Vertical arrow stem strokes upward and the head wraps closed.',
    viewBox: VB, paths: ARROW_UP_PATHS, animateFn: drawAll,
    ...buildCode('arrow-up', VB, ARROW_UP_PATHS) },
  { id: 13, name: 'Arrow Down', slug: 'arrow-down', category: 'arrow',
    tags: ['arrow', 'down', 'direction'], difficulty: 'beginner',
    description: 'Vertical stem flows downward, the head closes beneath it.',
    viewBox: VB, paths: ARROW_DOWN_PATHS, animateFn: drawAll,
    ...buildCode('arrow-down', VB, ARROW_DOWN_PATHS) },
  { id: 14, name: 'Chevron Up', slug: 'chevron-up', category: 'arrow',
    tags: ['chevron', 'up', 'collapse'], difficulty: 'beginner',
    description: 'Single inverted V — collapses upward, ideal for a closed accordion cue.',
    viewBox: VB, paths: CHEVRON_UP_PATHS, animateFn: drawAll,
    ...buildCode('chevron-up', VB, CHEVRON_UP_PATHS) },
  { id: 15, name: 'Chevron Left', slug: 'chevron-left', category: 'arrow',
    tags: ['chevron', 'left', 'back'], difficulty: 'beginner',
    description: 'Pen draws a single sideways V — back-navigation cue.',
    viewBox: VB, paths: CHEVRON_LEFT_PATHS, animateFn: drawAll,
    ...buildCode('chevron-left', VB, CHEVRON_LEFT_PATHS) },
  { id: 16, name: 'Chevron Right', slug: 'chevron-right', category: 'arrow',
    tags: ['chevron', 'right', 'next'], difficulty: 'beginner',
    description: 'Mirror chevron — sideways V drawing forward to indicate next.',
    viewBox: VB, paths: CHEVRON_RIGHT_PATHS, animateFn: drawAll,
    ...buildCode('chevron-right', VB, CHEVRON_RIGHT_PATHS) },
  // ─── UI ───────────────────────────────────────────────────────────────
  { id: 17, name: 'Settings', slug: 'settings', category: 'ui',
    tags: ['settings', 'gear', 'cog', 'config'], difficulty: 'intermediate',
    description: 'Inner circle and the toothed outer ring stagger in for a satisfying mechanical reveal.',
    viewBox: VB, paths: SETTINGS_PATHS, animateFn: drawAll,
    ...buildCode('settings', VB, SETTINGS_PATHS) },
  { id: 18, name: 'User', slug: 'user', category: 'ui',
    tags: ['user', 'avatar', 'profile', 'account'], difficulty: 'beginner',
    description: 'Shoulders draw as one stroke, head circles in as the second — classic profile glyph.',
    viewBox: VB, paths: USER_PATHS, animateFn: drawAll,
    ...buildCode('user', VB, USER_PATHS) },
  { id: 19, name: 'Bell', slug: 'bell', category: 'ui',
    tags: ['bell', 'notification', 'alert'], difficulty: 'intermediate',
    description: 'Bell silhouette traces in, then the small clapper arc finishes — alert that feels alive.',
    viewBox: VB, paths: BELL_PATHS, animateFn: drawAll,
    ...buildCode('bell', VB, BELL_PATHS) },
  { id: 20, name: 'Mail', slug: 'mail', category: 'ui',
    tags: ['mail', 'envelope', 'email', 'message'], difficulty: 'beginner',
    description: 'Envelope rectangle draws first, then the diagonal flap settles on top.',
    viewBox: VB, paths: MAIL_PATHS, animateFn: drawAll,
    ...buildCode('mail', VB, MAIL_PATHS) },
  { id: 21, name: 'Lock', slug: 'lock', category: 'ui',
    tags: ['lock', 'secure', 'private'], difficulty: 'beginner',
    description: 'Body of the padlock draws first, then the shackle arcs over — locked-and-loaded cue.',
    viewBox: VB, paths: LOCK_PATHS, animateFn: drawAll,
    ...buildCode('lock', VB, LOCK_PATHS) },
  { id: 22, name: 'Unlock', slug: 'unlock', category: 'ui',
    tags: ['unlock', 'open', 'access'], difficulty: 'beginner',
    description: 'Mirror of the lock — the shackle stays open, suggesting freedom or access granted.',
    viewBox: VB, paths: UNLOCK_PATHS, animateFn: drawAll,
    ...buildCode('unlock', VB, UNLOCK_PATHS) },
  { id: 23, name: 'Eye', slug: 'eye', category: 'ui',
    tags: ['eye', 'view', 'visible', 'show'], difficulty: 'beginner',
    description: 'Outer almond stroke traces in, pupil dot completes the gaze — perfect for "show password" toggles.',
    viewBox: VB, paths: EYE_PATHS, animateFn: drawAll,
    ...buildCode('eye', VB, EYE_PATHS) },
  { id: 24, name: 'Eye Off', slug: 'eye-off', category: 'ui',
    tags: ['eye-off', 'hidden', 'invisible'], difficulty: 'intermediate',
    description: 'Eye traces in segments, then the slash strikes through last — hidden state in motion.',
    viewBox: VB, paths: EYE_OFF_PATHS, animateFn: drawAll,
    ...buildCode('eye-off', VB, EYE_OFF_PATHS) },
  { id: 25, name: 'Edit', slug: 'edit', category: 'ui',
    tags: ['edit', 'pencil', 'modify', 'compose'], difficulty: 'beginner',
    description: 'Document outline draws, then the pencil sketches over the corner — compose ready.',
    viewBox: VB, paths: EDIT_PATHS, animateFn: drawAll,
    ...buildCode('edit', VB, EDIT_PATHS) },
  { id: 26, name: 'Trash', slug: 'trash', category: 'ui',
    tags: ['trash', 'delete', 'remove'], difficulty: 'beginner',
    description: 'Lid line draws first, then the bin body and handle complete the silhouette.',
    viewBox: VB, paths: TRASH_PATHS, animateFn: drawAll,
    ...buildCode('trash', VB, TRASH_PATHS) },
  { id: 27, name: 'Download', slug: 'download', category: 'ui',
    tags: ['download', 'save', 'arrow-down'], difficulty: 'beginner',
    description: 'Tray, arrowhead, and shaft stagger in — a download in three pen strokes.',
    viewBox: VB, paths: DOWNLOAD_PATHS, animateFn: drawAll,
    ...buildCode('download', VB, DOWNLOAD_PATHS) },
  { id: 28, name: 'Upload', slug: 'upload', category: 'ui',
    tags: ['upload', 'send', 'arrow-up'], difficulty: 'beginner',
    description: 'Mirror of download — arrow points up, three-step stagger reveals it cleanly.',
    viewBox: VB, paths: UPLOAD_PATHS, animateFn: drawAll,
    ...buildCode('upload', VB, UPLOAD_PATHS) },
  { id: 29, name: 'Share', slug: 'share', category: 'ui',
    tags: ['share', 'export', 'send'], difficulty: 'beginner',
    description: 'iOS-style share — box, then the arrow cap, then the vertical shaft.',
    viewBox: VB, paths: SHARE_PATHS, animateFn: drawAll,
    ...buildCode('share', VB, SHARE_PATHS) },
  { id: 30, name: 'Link', slug: 'link', category: 'ui',
    tags: ['link', 'chain', 'url', 'connect'], difficulty: 'intermediate',
    description: 'Two interlocking arcs trace in sequence — a chain forming itself in real time.',
    viewBox: VB, paths: LINK_PATHS, animateFn: drawAll,
    ...buildCode('link', VB, LINK_PATHS) },
  { id: 31, name: 'Filter', slug: 'filter', category: 'ui',
    tags: ['filter', 'funnel', 'sort'], difficulty: 'beginner',
    description: 'Funnel silhouette draws around its single closed perimeter — clean filter cue.',
    viewBox: VB, paths: FILTER_PATHS, animateFn: drawAll,
    ...buildCode('filter', VB, FILTER_PATHS) },
  { id: 32, name: 'Info', slug: 'info', category: 'ui',
    tags: ['info', 'about', 'help'], difficulty: 'beginner',
    description: 'Circle traces, then the body of the i strokes in, dot finishes on top.',
    viewBox: VB, paths: INFO_PATHS, animateFn: drawAll,
    ...buildCode('info', VB, INFO_PATHS) },
  { id: 33, name: 'Warning', slug: 'warning', category: 'ui',
    tags: ['warning', 'alert', 'caution', 'triangle'], difficulty: 'intermediate',
    description: 'Triangle outline draws around itself, exclamation strokes in last — attention now.',
    viewBox: VB, paths: WARNING_PATHS, animateFn: drawAll,
    ...buildCode('warning', VB, WARNING_PATHS) },
  { id: 34, name: 'Question', slug: 'question', category: 'ui',
    tags: ['question', 'help', 'unknown'], difficulty: 'intermediate',
    description: 'Circle draws first, then the question hook curls in — open-ended energy.',
    viewBox: VB, paths: QUESTION_PATHS, animateFn: drawAll,
    ...buildCode('question', VB, QUESTION_PATHS) },
  { id: 35, name: 'Loader', slug: 'loader', category: 'ui',
    tags: ['loader', 'spinner', 'loading'], difficulty: 'intermediate',
    description: 'Eight short rays stagger out from center — a tasteful loading spoke.',
    viewBox: VB, paths: LOADER_PATHS, animateFn: drawAll,
    ...buildCode('loader', VB, LOADER_PATHS) },
  { id: 36, name: 'Bookmark', slug: 'bookmark', category: 'ui',
    tags: ['bookmark', 'save', 'pin'], difficulty: 'beginner',
    description: 'Bookmark pennant traces around itself in a single continuous stroke.',
    viewBox: VB, paths: BOOKMARK_PATHS, animateFn: drawAll,
    ...buildCode('bookmark', VB, BOOKMARK_PATHS) },
  { id: 37, name: 'Home', slug: 'home', category: 'ui',
    tags: ['home', 'house', 'main'], difficulty: 'beginner',
    description: 'Roof and walls draw first, doorway opens up beneath — homepage primitive.',
    viewBox: VB, paths: HOME_PATHS, animateFn: drawAll,
    ...buildCode('home', VB, HOME_PATHS) },
  { id: 38, name: 'Refresh', slug: 'refresh', category: 'ui',
    tags: ['refresh', 'reload', 'sync'], difficulty: 'intermediate',
    description: 'Top arrow head, bottom arrow head, then both arcs sweep around the loop.',
    viewBox: VB, paths: REFRESH_PATHS, animateFn: drawAll,
    ...buildCode('refresh', VB, REFRESH_PATHS) },
  { id: 39, name: 'External Link', slug: 'external-link', category: 'ui',
    tags: ['external', 'open', 'new-tab', 'link'], difficulty: 'intermediate',
    description: 'Outer frame traces, the arrow head clicks into place, then the diagonal shaft draws.',
    viewBox: VB, paths: EXTERNAL_LINK_PATHS, animateFn: drawAll,
    ...buildCode('external-link', VB, EXTERNAL_LINK_PATHS) },
  { id: 40, name: 'Folder', slug: 'folder', category: 'ui',
    tags: ['folder', 'directory', 'files'], difficulty: 'beginner',
    description: 'Folder tab and body trace as one continuous outline — file system staple.',
    viewBox: VB, paths: FOLDER_PATHS, animateFn: drawAll,
    ...buildCode('folder', VB, FOLDER_PATHS) },
  // ─── Shapes ────────────────────────────────────────────────────────────
  { id: 41, name: 'Circle', slug: 'circle', category: 'shape',
    tags: ['circle', 'shape', 'round'], difficulty: 'beginner',
    description: 'Pure circle traces around its perimeter — a perfect single closed stroke.',
    viewBox: VB, paths: CIRCLE_PATHS, animateFn: drawAll,
    ...buildCode('circle', VB, CIRCLE_PATHS) },
  { id: 42, name: 'Square', slug: 'square', category: 'shape',
    tags: ['square', 'shape', 'rectangle'], difficulty: 'beginner',
    description: 'Four-cornered frame draws around itself — geometric punctuation.',
    viewBox: VB, paths: SQUARE_PATHS, animateFn: drawAll,
    ...buildCode('square', VB, SQUARE_PATHS) },
  { id: 43, name: 'Triangle', slug: 'triangle', category: 'shape',
    tags: ['triangle', 'shape', 'three-sided'], difficulty: 'beginner',
    description: 'Three-edge stroke from peak down and around — sharp and decisive.',
    viewBox: VB, paths: TRIANGLE_PATHS, animateFn: drawAll,
    ...buildCode('triangle', VB, TRIANGLE_PATHS) },
  { id: 44, name: 'Diamond', slug: 'diamond', category: 'shape',
    tags: ['diamond', 'rhombus', 'shape'], difficulty: 'beginner',
    description: 'Four diagonal edges draw around the kite silhouette — minimal and symmetric.',
    viewBox: VB, paths: DIAMOND_PATHS, animateFn: drawAll,
    ...buildCode('diamond', VB, DIAMOND_PATHS) },
  { id: 45, name: 'Hexagon', slug: 'hexagon', category: 'shape',
    tags: ['hexagon', 'six-sided', 'shape', 'badge'], difficulty: 'intermediate',
    description: 'Six-sided badge traces around the closed perimeter — gives status-card energy.',
    viewBox: VB, paths: HEXAGON_PATHS, animateFn: drawAll,
    ...buildCode('hexagon', VB, HEXAGON_PATHS) },
  { id: 46, name: 'Pentagon', slug: 'pentagon', category: 'shape',
    tags: ['pentagon', 'five-sided', 'shape'], difficulty: 'beginner',
    description: 'Five-sided crest strokes around itself in a single continuous line.',
    viewBox: VB, paths: PENTAGON_PATHS, animateFn: drawAll,
    ...buildCode('pentagon', VB, PENTAGON_PATHS) },
  // ─── Media ────────────────────────────────────────────────────────────
  { id: 47, name: 'Pause', slug: 'pause', category: 'media',
    tags: ['pause', 'media', 'control', 'stagger'], difficulty: 'beginner',
    description: 'Two parallel bars stroke in — left first, right second — pause caught mid-press.',
    viewBox: VB, paths: PAUSE_PATHS, animateFn: drawAll,
    ...buildCode('pause', VB, PAUSE_PATHS) },
  { id: 48, name: 'Stop', slug: 'stop', category: 'media',
    tags: ['stop', 'media', 'control', 'square'], difficulty: 'beginner',
    description: 'Single closed square traces around itself — simple and final.',
    viewBox: VB, paths: STOP_PATHS, animateFn: drawAll,
    ...buildCode('stop', VB, STOP_PATHS) },
  { id: 49, name: 'Skip Forward', slug: 'skip-forward', category: 'media',
    tags: ['skip', 'forward', 'media', 'next'], difficulty: 'beginner',
    description: 'Triangle plays in first, then the leading bar snaps into place — track-skip cue.',
    viewBox: VB, paths: SKIP_FORWARD_PATHS, animateFn: drawAll,
    ...buildCode('skip-forward', VB, SKIP_FORWARD_PATHS) },
  { id: 50, name: 'Volume', slug: 'volume', category: 'media',
    tags: ['volume', 'audio', 'sound', 'speaker'], difficulty: 'intermediate',
    description: 'Speaker silhouette draws first, then the sound wave arcs out — audible reveal.',
    viewBox: VB, paths: VOLUME_PATHS, animateFn: drawAll,
    ...buildCode('volume', VB, VOLUME_PATHS) },
  // ─── Communication ─────────────────────────────────────────────────────
  { id: 51, name: 'Chat', slug: 'chat', category: 'comm',
    tags: ['chat', 'message', 'speech', 'bubble'], difficulty: 'beginner',
    description: 'Speech bubble traces around its outline including the tail — conversation primed.',
    viewBox: VB, paths: CHAT_PATHS, animateFn: drawAll,
    ...buildCode('chat', VB, CHAT_PATHS) },
  { id: 52, name: 'Phone', slug: 'phone', category: 'comm',
    tags: ['phone', 'call', 'contact'], difficulty: 'intermediate',
    description: 'Handset silhouette traces from earpiece around to mouthpiece — call coming in.',
    viewBox: VB, paths: PHONE_PATHS, animateFn: drawAll,
    ...buildCode('phone', VB, PHONE_PATHS) },
  { id: 53, name: 'Send', slug: 'send', category: 'comm',
    tags: ['send', 'plane', 'submit', 'message'], difficulty: 'beginner',
    description: 'Flight line draws from origin, then the paper plane folds itself into being.',
    viewBox: VB, paths: SEND_PATHS, animateFn: drawAll,
    ...buildCode('send', VB, SEND_PATHS) },
  { id: 54, name: 'At Sign', slug: 'at-sign', category: 'comm',
    tags: ['at', 'email', 'mention', 'address'], difficulty: 'intermediate',
    description: 'Inner circle draws first, then the spiral arm wraps around — handle complete.',
    viewBox: VB, paths: AT_SIGN_PATHS, animateFn: drawAll,
    ...buildCode('at-sign', VB, AT_SIGN_PATHS) },
  { id: 55, name: 'Hash', slug: 'hash', category: 'comm',
    tags: ['hash', 'pound', 'tag', 'channel'], difficulty: 'intermediate',
    description: 'Four crossed strokes stagger in — horizontal pair first, slanted pair second.',
    viewBox: VB, paths: HASH_PATHS, animateFn: drawAll,
    ...buildCode('hash', VB, HASH_PATHS) },
  // ─── Misc ─────────────────────────────────────────────────────────────
  { id: 56, name: 'Calendar', slug: 'calendar', category: 'misc',
    tags: ['calendar', 'date', 'schedule'], difficulty: 'beginner',
    description: 'Frame draws, two binder pegs pop in, divider line settles last — month-at-a-glance.',
    viewBox: VB, paths: CALENDAR_PATHS, animateFn: drawAll,
    ...buildCode('calendar', VB, CALENDAR_PATHS) },
  { id: 57, name: 'Clock', slug: 'clock', category: 'misc',
    tags: ['clock', 'time', 'wait'], difficulty: 'beginner',
    description: 'Face circles in first, then the hour and minute hand sketch from center outward.',
    viewBox: VB, paths: CLOCK_PATHS, animateFn: drawAll,
    ...buildCode('clock', VB, CLOCK_PATHS) },
  { id: 58, name: 'Location', slug: 'location', category: 'misc',
    tags: ['location', 'pin', 'map', 'place'], difficulty: 'beginner',
    description: 'Pin teardrop strokes around its silhouette, dot finishes inside — drop-on-map.',
    viewBox: VB, paths: LOCATION_PATHS, animateFn: drawAll,
    ...buildCode('location', VB, LOCATION_PATHS) },
  { id: 59, name: 'Tag', slug: 'tag', category: 'misc',
    tags: ['tag', 'label', 'price'], difficulty: 'intermediate',
    description: 'Tag pennant outlines itself, eyelet dot snaps in — labelled and ready.',
    viewBox: VB, paths: TAG_PATHS, animateFn: drawAll,
    ...buildCode('tag', VB, TAG_PATHS) },
  { id: 60, name: 'Camera', slug: 'camera', category: 'misc',
    tags: ['camera', 'photo', 'capture'], difficulty: 'intermediate',
    description: 'Camera body silhouette draws first, then the lens iris circles into focus.',
    viewBox: VB, paths: CAMERA_PATHS, animateFn: drawAll,
    ...buildCode('camera', VB, CAMERA_PATHS) },
  // ─── Direction (continued) ─────────────────────────────────────────────
  { id: 61, name: 'Move', slug: 'move', category: 'arrow',
    tags: ['move', 'four-way', 'pan', 'drag'], difficulty: 'intermediate',
    description: 'Six staggered strokes form a four-way arrow cross — perfect for pan/move handles.',
    viewBox: VB, paths: MOVE_PATHS, animateFn: drawAll,
    ...buildCode('move', VB, MOVE_PATHS) },
  { id: 62, name: 'Maximize', slug: 'maximize', category: 'arrow',
    tags: ['maximize', 'expand', 'fullscreen'], difficulty: 'intermediate',
    description: 'Two opposite L-shapes pull outward as their diagonals shoot to the corners.',
    viewBox: VB, paths: MAXIMIZE_PATHS, animateFn: drawAll,
    ...buildCode('maximize', VB, MAXIMIZE_PATHS) },
  { id: 63, name: 'Minimize', slug: 'minimize', category: 'arrow',
    tags: ['minimize', 'collapse', 'shrink'], difficulty: 'intermediate',
    description: 'Mirror of maximize — corners draw inward suggesting the window is collapsing.',
    viewBox: VB, paths: MINIMIZE_PATHS, animateFn: drawAll,
    ...buildCode('minimize', VB, MINIMIZE_PATHS) },
  { id: 64, name: 'Swap', slug: 'swap', category: 'arrow',
    tags: ['swap', 'exchange', 'switch'], difficulty: 'intermediate',
    description: 'Up-arrow and down-arrow stagger in side by side — exchange/swap motion at a glance.',
    viewBox: VB, paths: SWAP_PATHS, animateFn: drawAll,
    ...buildCode('swap', VB, SWAP_PATHS) },
  { id: 65, name: 'Repeat', slug: 'repeat', category: 'arrow',
    tags: ['repeat', 'loop', 'cycle'], difficulty: 'intermediate',
    description: 'Two arrowheads and two arcs draw in turn, completing the cyclic loop.',
    viewBox: VB, paths: REPEAT_PATHS, animateFn: drawAll,
    ...buildCode('repeat', VB, REPEAT_PATHS) },
  // ─── UI (continued) ────────────────────────────────────────────────────
  { id: 66, name: 'Save', slug: 'save', category: 'ui',
    tags: ['save', 'floppy', 'disk'], difficulty: 'intermediate',
    description: 'Floppy outline draws first, label tab and write-protect notch follow — saved!',
    viewBox: VB, paths: SAVE_PATHS, animateFn: drawAll,
    ...buildCode('save', VB, SAVE_PATHS) },
  { id: 67, name: 'Copy', slug: 'copy', category: 'ui',
    tags: ['copy', 'duplicate', 'clipboard'], difficulty: 'beginner',
    description: 'Front sheet draws, back sheet hooks behind it — duplicate-and-stack vibes.',
    viewBox: VB, paths: COPY_PATHS, animateFn: drawAll,
    ...buildCode('copy', VB, COPY_PATHS) },
  { id: 68, name: 'Print', slug: 'print', category: 'ui',
    tags: ['print', 'printer', 'output'], difficulty: 'beginner',
    description: 'Paper feed, body, and tray stagger in — printer warming up to spool a page.',
    viewBox: VB, paths: PRINT_PATHS, animateFn: drawAll,
    ...buildCode('print', VB, PRINT_PATHS) },
  { id: 69, name: 'Undo', slug: 'undo', category: 'ui',
    tags: ['undo', 'rotate-ccw', 'back'], difficulty: 'beginner',
    description: 'Arrow head sketches, then the curved arc loops back — undo in motion.',
    viewBox: VB, paths: UNDO_PATHS, animateFn: drawAll,
    ...buildCode('undo', VB, UNDO_PATHS) },
  { id: 70, name: 'Redo', slug: 'redo', category: 'ui',
    tags: ['redo', 'rotate-cw', 'forward'], difficulty: 'beginner',
    description: 'Mirror of undo — the curved sweep moves the other way to reapply the change.',
    viewBox: VB, paths: REDO_PATHS, animateFn: drawAll,
    ...buildCode('redo', VB, REDO_PATHS) },
  { id: 71, name: 'Power', slug: 'power', category: 'ui',
    tags: ['power', 'on', 'off', 'standby'], difficulty: 'beginner',
    description: 'Open arc traces around the perimeter, then the vertical line strikes through it.',
    viewBox: VB, paths: POWER_PATHS, animateFn: drawAll,
    ...buildCode('power', VB, POWER_PATHS) },
  { id: 72, name: 'Flag', slug: 'flag', category: 'ui',
    tags: ['flag', 'mark', 'report'], difficulty: 'beginner',
    description: 'Pennant draws first, then the staff finishes underneath — planted and visible.',
    viewBox: VB, paths: FLAG_PATHS, animateFn: drawAll,
    ...buildCode('flag', VB, FLAG_PATHS) },
  { id: 73, name: 'Sun', slug: 'sun', category: 'ui',
    tags: ['sun', 'light', 'day', 'theme'], difficulty: 'intermediate',
    description: 'Center disc draws first, then eight rays radiate out with stagger — sunrise.',
    viewBox: VB, paths: SUN_PATHS, animateFn: drawAll,
    ...buildCode('sun', VB, SUN_PATHS) },
  { id: 74, name: 'Moon', slug: 'moon', category: 'ui',
    tags: ['moon', 'dark', 'night', 'theme'], difficulty: 'beginner',
    description: 'Crescent traces around its silhouette in a single uninterrupted stroke.',
    viewBox: VB, paths: MOON_PATHS, animateFn: drawAll,
    ...buildCode('moon', VB, MOON_PATHS) },
  { id: 75, name: 'Cloud', slug: 'cloud', category: 'ui',
    tags: ['cloud', 'weather', 'storage', 'sync'], difficulty: 'beginner',
    description: 'Cloud silhouette traces around its bumpy outline — cumulus forming itself.',
    viewBox: VB, paths: CLOUD_PATHS, animateFn: drawAll,
    ...buildCode('cloud', VB, CLOUD_PATHS) },
  { id: 76, name: 'Code', slug: 'code', category: 'ui',
    tags: ['code', 'brackets', 'developer'], difficulty: 'beginner',
    description: 'Right bracket and left bracket draw in stagger — markup at a glance.',
    viewBox: VB, paths: CODE_PATHS, animateFn: drawAll,
    ...buildCode('code', VB, CODE_PATHS) },
  { id: 77, name: 'Terminal', slug: 'terminal', category: 'ui',
    tags: ['terminal', 'console', 'cli'], difficulty: 'beginner',
    description: 'Caret prompt draws first, then the cursor underline appears — ready for input.',
    viewBox: VB, paths: TERMINAL_PATHS, animateFn: drawAll,
    ...buildCode('terminal', VB, TERMINAL_PATHS) },
  { id: 78, name: 'File', slug: 'file', category: 'ui',
    tags: ['file', 'document', 'page'], difficulty: 'beginner',
    description: 'Outer page strokes first, then the dog-ear corner folds itself in.',
    viewBox: VB, paths: FILE_PATHS, animateFn: drawAll,
    ...buildCode('file', VB, FILE_PATHS) },
  { id: 79, name: 'Image', slug: 'image', category: 'ui',
    tags: ['image', 'picture', 'photo', 'gallery'], difficulty: 'beginner',
    description: 'Frame, sun-circle in the corner, and mountain horizon draw as a sequenced trio.',
    viewBox: VB, paths: IMAGE_PATHS, animateFn: drawAll,
    ...buildCode('image', VB, IMAGE_PATHS) },
  { id: 80, name: 'Music', slug: 'music', category: 'ui',
    tags: ['music', 'note', 'audio', 'beam'], difficulty: 'intermediate',
    description: 'Beam draws first, then the two note heads bloom in — sheet music meets icon.',
    viewBox: VB, paths: MUSIC_PATHS, animateFn: drawAll,
    ...buildCode('music', VB, MUSIC_PATHS) },
  { id: 81, name: 'Award', slug: 'award', category: 'ui',
    tags: ['award', 'medal', 'trophy', 'achievement'], difficulty: 'intermediate',
    description: 'Medallion circles in first, then the ribbon tails dangle from underneath.',
    viewBox: VB, paths: AWARD_PATHS, animateFn: drawAll,
    ...buildCode('award', VB, AWARD_PATHS) },
  // ─── Shapes (continued) ────────────────────────────────────────────────
  { id: 82, name: 'Octagon', slug: 'octagon', category: 'shape',
    tags: ['octagon', 'eight-sided', 'stop'], difficulty: 'beginner',
    description: 'Eight-sided perimeter strokes around itself — stop-sign silhouette.',
    viewBox: VB, paths: OCTAGON_PATHS, animateFn: drawAll,
    ...buildCode('octagon', VB, OCTAGON_PATHS) },
  { id: 83, name: 'Crescent', slug: 'crescent', category: 'shape',
    tags: ['crescent', 'moon', 'phase'], difficulty: 'beginner',
    description: 'Crescent traces around its curved silhouette in one sweeping stroke.',
    viewBox: VB, paths: CRESCENT_PATHS, animateFn: drawAll,
    ...buildCode('crescent', VB, CRESCENT_PATHS) },
  { id: 84, name: 'Half Circle', slug: 'half-circle', category: 'shape',
    tags: ['half-circle', 'dome', 'arc'], difficulty: 'beginner',
    description: 'Single semi-circle arc traces from one edge across the top and back down.',
    viewBox: VB, paths: HALF_CIRCLE_PATHS, animateFn: drawAll,
    ...buildCode('half-circle', VB, HALF_CIRCLE_PATHS) },
  { id: 85, name: 'Cross Shape', slug: 'cross-shape', category: 'shape',
    tags: ['cross', 'plus-shape', 'medical'], difficulty: 'beginner',
    description: 'Twelve-sided plus polygon traces around its outline — medical or grid emblem.',
    viewBox: VB, paths: CROSS_SHAPE_PATHS, animateFn: drawAll,
    ...buildCode('cross-shape', VB, CROSS_SHAPE_PATHS) },
  { id: 86, name: 'Pill', slug: 'pill', category: 'shape',
    tags: ['pill', 'capsule', 'tablet'], difficulty: 'beginner',
    description: 'Capsule outlines itself with two semi-circular ends and parallel sides.',
    viewBox: VB, paths: PILL_PATHS, animateFn: drawAll,
    ...buildCode('pill', VB, PILL_PATHS) },
  // ─── Media (continued) ─────────────────────────────────────────────────
  { id: 87, name: 'Video', slug: 'video', category: 'media',
    tags: ['video', 'camera', 'recording'], difficulty: 'intermediate',
    description: 'Triangle viewfinder draws first, then the rectangular body locks in beside it.',
    viewBox: VB, paths: VIDEO_PATHS, animateFn: drawAll,
    ...buildCode('video', VB, VIDEO_PATHS) },
  { id: 88, name: 'Mic', slug: 'mic', category: 'media',
    tags: ['mic', 'microphone', 'record'], difficulty: 'intermediate',
    description: 'Capsule body, U-shaped cradle, stand, then base — four-stage hardware reveal.',
    viewBox: VB, paths: MIC_PATHS, animateFn: drawAll,
    ...buildCode('mic', VB, MIC_PATHS) },
  { id: 89, name: 'Headphones', slug: 'headphones', category: 'media',
    tags: ['headphones', 'audio', 'listen'], difficulty: 'intermediate',
    description: 'Headband arcs over first, then the two earcups stagger into place.',
    viewBox: VB, paths: HEADPHONES_PATHS, animateFn: drawAll,
    ...buildCode('headphones', VB, HEADPHONES_PATHS) },
  // ─── Communication (continued) ─────────────────────────────────────────
  { id: 90, name: 'Wifi', slug: 'wifi', category: 'comm',
    tags: ['wifi', 'wireless', 'signal'], difficulty: 'intermediate',
    description: 'Concentric arcs draw outward from a single dot — signal getting stronger.',
    viewBox: VB, paths: WIFI_PATHS, animateFn: drawAll,
    ...buildCode('wifi', VB, WIFI_PATHS) },
  { id: 91, name: 'Bluetooth', slug: 'bluetooth', category: 'comm',
    tags: ['bluetooth', 'wireless', 'pair'], difficulty: 'beginner',
    description: 'Stylized B traces in one continuous bow-tie stroke — pairing ready.',
    viewBox: VB, paths: BLUETOOTH_PATHS, animateFn: drawAll,
    ...buildCode('bluetooth', VB, BLUETOOTH_PATHS) },
  { id: 92, name: 'Cast', slug: 'cast', category: 'comm',
    tags: ['cast', 'screen-share', 'airplay'], difficulty: 'intermediate',
    description: 'Outer screen draws, signal arcs ripple from the corner — wireless casting cue.',
    viewBox: VB, paths: CAST_PATHS, animateFn: drawAll,
    ...buildCode('cast', VB, CAST_PATHS) },
  { id: 93, name: 'RSS', slug: 'rss', category: 'comm',
    tags: ['rss', 'feed', 'subscribe'], difficulty: 'intermediate',
    description: 'Two arcs and a dot stagger out from origin — broadcast ripple, classic RSS.',
    viewBox: VB, paths: RSS_PATHS, animateFn: drawAll,
    ...buildCode('rss', VB, RSS_PATHS) },
  // ─── Misc (continued) ──────────────────────────────────────────────────
  { id: 94, name: 'Activity', slug: 'activity', category: 'misc',
    tags: ['activity', 'pulse', 'heartbeat', 'monitor'], difficulty: 'beginner',
    description: 'Single zig-zag pulse line draws across the canvas — heartbeat captured live.',
    viewBox: VB, paths: ACTIVITY_PATHS, animateFn: drawAll,
    ...buildCode('activity', VB, ACTIVITY_PATHS) },
  { id: 95, name: 'Trending Up', slug: 'trending-up', category: 'misc',
    tags: ['trending', 'growth', 'chart', 'up'], difficulty: 'beginner',
    description: 'Diagonal trend line strokes upward, then the corner arrowhead snaps in.',
    viewBox: VB, paths: TRENDING_UP_PATHS, animateFn: drawAll,
    ...buildCode('trending-up', VB, TRENDING_UP_PATHS) },
  { id: 96, name: 'Bar Chart', slug: 'bar-chart', category: 'misc',
    tags: ['chart', 'bar', 'data', 'analytics'], difficulty: 'beginner',
    description: 'Three vertical bars stagger upward in sequence — short, medium, tall.',
    viewBox: VB, paths: BAR_CHART_PATHS, animateFn: drawAll,
    ...buildCode('bar-chart', VB, BAR_CHART_PATHS) },
  { id: 97, name: 'Pie Chart', slug: 'pie-chart', category: 'misc',
    tags: ['chart', 'pie', 'data'], difficulty: 'intermediate',
    description: 'Outer arc traces around the disc, then the wedge slices itself in.',
    viewBox: VB, paths: PIE_CHART_PATHS, animateFn: drawAll,
    ...buildCode('pie-chart', VB, PIE_CHART_PATHS) },
  { id: 98, name: 'Compass', slug: 'compass', category: 'misc',
    tags: ['compass', 'direction', 'navigation'], difficulty: 'intermediate',
    description: 'Outer ring circles in, then the diamond needle pivots into place at center.',
    viewBox: VB, paths: COMPASS_PATHS, animateFn: drawAll,
    ...buildCode('compass', VB, COMPASS_PATHS) },
  { id: 99, name: 'Map', slug: 'map', category: 'misc',
    tags: ['map', 'navigation', 'travel'], difficulty: 'intermediate',
    description: 'Folded map silhouette and two creases stagger in — paper unfolding mid-air.',
    viewBox: VB, paths: MAP_PATHS, animateFn: drawAll,
    ...buildCode('map', VB, MAP_PATHS) },
  { id: 100, name: 'Battery', slug: 'battery', category: 'misc',
    tags: ['battery', 'power', 'charge'], difficulty: 'beginner',
    description: 'Cell housing draws first, then the small terminal nub pops out on the right.',
    viewBox: VB, paths: BATTERY_PATHS, animateFn: drawAll,
    ...buildCode('battery', VB, BATTERY_PATHS) },
  // ─── Pack 1: Files & Folders ───────────────────────────────────────────
  { id: 101, name: 'File Text', slug: 'file-text', category: 'files',
    tags: ['file', 'text', 'document'], difficulty: 'intermediate',
    description: 'Page outline draws, dog-ear corner folds in, then three text lines settle.',
    viewBox: VB, paths: FILE_TEXT_PATHS, animateFn: drawAll,
    ...buildCode('file-text', VB, FILE_TEXT_PATHS) },
  { id: 102, name: 'File Code', slug: 'file-code', category: 'files',
    tags: ['file', 'code', 'developer'], difficulty: 'intermediate',
    description: 'Document silhouette traces, then code brackets stagger in side by side.',
    viewBox: VB, paths: FILE_CODE_PATHS, animateFn: drawAll,
    ...buildCode('file-code', VB, FILE_CODE_PATHS) },
  { id: 103, name: 'File Image', slug: 'file-image', category: 'files',
    tags: ['file', 'image', 'photo', 'picture'], difficulty: 'intermediate',
    description: 'Page draws first, sun circle settles in the corner, mountain horizon strokes last.',
    viewBox: VB, paths: FILE_IMAGE_PATHS, animateFn: drawAll,
    ...buildCode('file-image', VB, FILE_IMAGE_PATHS) },
  { id: 104, name: 'File Music', slug: 'file-music', category: 'files',
    tags: ['file', 'music', 'audio'], difficulty: 'intermediate',
    description: 'Document outlines, beam draws, two note heads bloom in — audio file ready.',
    viewBox: VB, paths: FILE_MUSIC_PATHS, animateFn: drawAll,
    ...buildCode('file-music', VB, FILE_MUSIC_PATHS) },
  { id: 105, name: 'File Video', slug: 'file-video', category: 'files',
    tags: ['file', 'video', 'play'], difficulty: 'beginner',
    description: 'Document outline, then a play triangle traces inside — video file cue.',
    viewBox: VB, paths: FILE_VIDEO_PATHS, animateFn: drawAll,
    ...buildCode('file-video', VB, FILE_VIDEO_PATHS) },
  { id: 106, name: 'File Plus', slug: 'file-plus', category: 'files',
    tags: ['file', 'add', 'new', 'create'], difficulty: 'beginner',
    description: 'Document strokes in, plus sign builds inside — create new file.',
    viewBox: VB, paths: FILE_PLUS_PATHS, animateFn: drawAll,
    ...buildCode('file-plus', VB, FILE_PLUS_PATHS) },
  { id: 107, name: 'File Minus', slug: 'file-minus', category: 'files',
    tags: ['file', 'remove', 'subtract'], difficulty: 'beginner',
    description: 'Page silhouette draws, single horizontal stroke completes — minus interaction.',
    viewBox: VB, paths: FILE_MINUS_PATHS, animateFn: drawAll,
    ...buildCode('file-minus', VB, FILE_MINUS_PATHS) },
  { id: 108, name: 'File Check', slug: 'file-check', category: 'files',
    tags: ['file', 'check', 'verified', 'approved'], difficulty: 'beginner',
    description: 'Document outlines, dog-ear folds, checkmark strokes through center — file approved.',
    viewBox: VB, paths: FILE_CHECK_PATHS, animateFn: drawAll,
    ...buildCode('file-check', VB, FILE_CHECK_PATHS) },
  { id: 109, name: 'File X', slug: 'file-x', category: 'files',
    tags: ['file', 'remove', 'delete', 'reject'], difficulty: 'beginner',
    description: 'Document forms, then two diagonal strokes cross through — reject or delete.',
    viewBox: VB, paths: FILE_X_PATHS, animateFn: drawAll,
    ...buildCode('file-x', VB, FILE_X_PATHS) },
  { id: 110, name: 'File Search', slug: 'file-search', category: 'files',
    tags: ['file', 'search', 'find'], difficulty: 'intermediate',
    description: 'Document silhouette, magnifier circle bubbles inside, handle dashes out last.',
    viewBox: VB, paths: FILE_SEARCH_PATHS, animateFn: drawAll,
    ...buildCode('file-search', VB, FILE_SEARCH_PATHS) },
  { id: 111, name: 'Files', slug: 'files', category: 'files',
    tags: ['files', 'multiple', 'stack', 'duplicate'], difficulty: 'intermediate',
    description: 'Front document strokes, back document hooks behind it — stacked files motif.',
    viewBox: VB, paths: FILES_PATHS, animateFn: drawAll,
    ...buildCode('files', VB, FILES_PATHS) },
  { id: 112, name: 'Folder Open', slug: 'folder-open', category: 'files',
    tags: ['folder', 'open', 'expand'], difficulty: 'intermediate',
    description: 'Folder mouth opens with one continuous stroke — directory ready to browse.',
    viewBox: VB, paths: FOLDER_OPEN_PATHS, animateFn: drawAll,
    ...buildCode('folder-open', VB, FOLDER_OPEN_PATHS) },
  { id: 113, name: 'Folder Plus', slug: 'folder-plus', category: 'files',
    tags: ['folder', 'add', 'new'], difficulty: 'beginner',
    description: 'Folder outline traces, plus sign builds inside — create new folder.',
    viewBox: VB, paths: FOLDER_PLUS_PATHS, animateFn: drawAll,
    ...buildCode('folder-plus', VB, FOLDER_PLUS_PATHS) },
  { id: 114, name: 'Folder Minus', slug: 'folder-minus', category: 'files',
    tags: ['folder', 'remove'], difficulty: 'beginner',
    description: 'Folder silhouette traces, then a single horizontal line settles inside.',
    viewBox: VB, paths: FOLDER_MINUS_PATHS, animateFn: drawAll,
    ...buildCode('folder-minus', VB, FOLDER_MINUS_PATHS) },
  { id: 115, name: 'Folder X', slug: 'folder-x', category: 'files',
    tags: ['folder', 'delete', 'remove'], difficulty: 'beginner',
    description: 'Folder forms, two diagonal strokes cross through — delete folder.',
    viewBox: VB, paths: FOLDER_X_PATHS, animateFn: drawAll,
    ...buildCode('folder-x', VB, FOLDER_X_PATHS) },
  { id: 116, name: 'Folder Check', slug: 'folder-check', category: 'files',
    tags: ['folder', 'verified', 'sync'], difficulty: 'beginner',
    description: 'Folder draws first, checkmark strokes inside — synced or verified directory.',
    viewBox: VB, paths: FOLDER_CHECK_PATHS, animateFn: drawAll,
    ...buildCode('folder-check', VB, FOLDER_CHECK_PATHS) },
  { id: 117, name: 'Folder Lock', slug: 'folder-lock', category: 'files',
    tags: ['folder', 'lock', 'private', 'secure'], difficulty: 'intermediate',
    description: 'Folder outline draws, padlock body and shackle complete the secured directory.',
    viewBox: VB, paths: FOLDER_LOCK_PATHS, animateFn: drawAll,
    ...buildCode('folder-lock', VB, FOLDER_LOCK_PATHS) },
  { id: 118, name: 'Folder Search', slug: 'folder-search', category: 'files',
    tags: ['folder', 'search', 'find'], difficulty: 'intermediate',
    description: 'Folder silhouette traces, magnifier circle and handle finish on top.',
    viewBox: VB, paths: FOLDER_SEARCH_PATHS, animateFn: drawAll,
    ...buildCode('folder-search', VB, FOLDER_SEARCH_PATHS) },
  { id: 119, name: 'Archive', slug: 'archive', category: 'files',
    tags: ['archive', 'box', 'storage'], difficulty: 'intermediate',
    description: 'Box body draws, lid settles on top, central handle slot completes the archive.',
    viewBox: VB, paths: ARCHIVE_PATHS, animateFn: drawAll,
    ...buildCode('archive', VB, ARCHIVE_PATHS) },
  { id: 120, name: 'Inbox', slug: 'inbox', category: 'files',
    tags: ['inbox', 'tray', 'incoming'], difficulty: 'intermediate',
    description: 'Tray opening forms first, then the bin body strokes around itself.',
    viewBox: VB, paths: INBOX_PATHS, animateFn: drawAll,
    ...buildCode('inbox', VB, INBOX_PATHS) },
  { id: 121, name: 'Layers', slug: 'layers', category: 'files',
    tags: ['layers', 'stack', 'design'], difficulty: 'intermediate',
    description: 'Top diamond draws, two parallel layers stagger beneath — stacked sheets reveal.',
    viewBox: VB, paths: LAYERS_PATHS, animateFn: drawAll,
    ...buildCode('layers', VB, LAYERS_PATHS) },
  { id: 122, name: 'Clipboard', slug: 'clipboard', category: 'files',
    tags: ['clipboard', 'paste', 'note'], difficulty: 'beginner',
    description: 'Board outline traces, then the clip pinches at the top — clipboard ready.',
    viewBox: VB, paths: CLIPBOARD_PATHS, animateFn: drawAll,
    ...buildCode('clipboard', VB, CLIPBOARD_PATHS) },
  { id: 123, name: 'Clipboard List', slug: 'clipboard-list', category: 'files',
    tags: ['clipboard', 'list', 'task'], difficulty: 'intermediate',
    description: 'Board, clip, and rows of bullet-and-line items stagger in — task list primed.',
    viewBox: VB, paths: CLIPBOARD_LIST_PATHS, animateFn: drawAll,
    ...buildCode('clipboard-list', VB, CLIPBOARD_LIST_PATHS) },
  { id: 124, name: 'Clipboard Check', slug: 'clipboard-check', category: 'files',
    tags: ['clipboard', 'check', 'task', 'done'], difficulty: 'beginner',
    description: 'Board and clip draw, then a confident checkmark strokes through the center.',
    viewBox: VB, paths: CLIPBOARD_CHECK_PATHS, animateFn: drawAll,
    ...buildCode('clipboard-check', VB, CLIPBOARD_CHECK_PATHS) },
  { id: 125, name: 'Notebook', slug: 'notebook', category: 'files',
    tags: ['notebook', 'journal', 'pages'], difficulty: 'intermediate',
    description: 'Four spiral binding rings stagger first, then the notebook body strokes around.',
    viewBox: VB, paths: NOTEBOOK_PATHS, animateFn: drawAll,
    ...buildCode('notebook', VB, NOTEBOOK_PATHS) },
  // ─── Pack 2: Communication ─────────────────────────────────────────────
  { id: 126, name: 'Message Circle', slug: 'message-circle', category: 'comm',
    tags: ['message', 'chat', 'circle'], difficulty: 'beginner',
    description: 'Round chat bubble traces around its silhouette in one continuous stroke.',
    viewBox: VB, paths: MESSAGE_CIRCLE_PATHS, animateFn: drawAll,
    ...buildCode('message-circle', VB, MESSAGE_CIRCLE_PATHS) },
  { id: 127, name: 'Messages', slug: 'messages', category: 'comm',
    tags: ['messages', 'thread', 'multiple'], difficulty: 'intermediate',
    description: 'Front bubble draws first, then the second bubble layers behind it — group thread.',
    viewBox: VB, paths: MESSAGES_PATHS, animateFn: drawAll,
    ...buildCode('messages', VB, MESSAGES_PATHS) },
  { id: 128, name: 'Reply', slug: 'reply', category: 'comm',
    tags: ['reply', 'respond', 'back'], difficulty: 'beginner',
    description: 'Curved hook draws first, then the long arrow shaft completes the back-arrow.',
    viewBox: VB, paths: REPLY_PATHS, animateFn: drawAll,
    ...buildCode('reply', VB, REPLY_PATHS) },
  { id: 129, name: 'Forward', slug: 'forward', category: 'comm',
    tags: ['forward', 'send-on'], difficulty: 'beginner',
    description: 'Mirror of reply — chevron forward and the shaft finish the forward arrow.',
    viewBox: VB, paths: FORWARD_PATHS, animateFn: drawAll,
    ...buildCode('forward', VB, FORWARD_PATHS) },
  { id: 130, name: 'Megaphone', slug: 'megaphone', category: 'comm',
    tags: ['megaphone', 'announce', 'broadcast'], difficulty: 'intermediate',
    description: 'Cone body draws first, then the small handle curves out beneath it.',
    viewBox: VB, paths: MEGAPHONE_PATHS, animateFn: drawAll,
    ...buildCode('megaphone', VB, MEGAPHONE_PATHS) },
  { id: 131, name: 'Radio', slug: 'radio', category: 'comm',
    tags: ['radio', 'wave', 'broadcast'], difficulty: 'intermediate',
    description: 'Five concentric arcs and a center dot stagger out — radio waves rippling away.',
    viewBox: VB, paths: RADIO_PATHS, animateFn: drawAll,
    ...buildCode('radio', VB, RADIO_PATHS) },
  { id: 132, name: 'Headset', slug: 'headset', category: 'comm',
    tags: ['headset', 'gaming', 'support'], difficulty: 'intermediate',
    description: 'Headband arcs first, two earcups stagger, then the boom mic completes the rig.',
    viewBox: VB, paths: HEADSET_PATHS, animateFn: drawAll,
    ...buildCode('headset', VB, HEADSET_PATHS) },
  { id: 133, name: 'Mail Open', slug: 'mail-open', category: 'comm',
    tags: ['mail', 'open', 'envelope', 'read'], difficulty: 'beginner',
    description: 'Envelope outlines first, then the diagonal flap settles open — message read.',
    viewBox: VB, paths: MAIL_OPEN_PATHS, animateFn: drawAll,
    ...buildCode('mail-open', VB, MAIL_OPEN_PATHS) },
  { id: 134, name: 'Voicemail', slug: 'voicemail', category: 'comm',
    tags: ['voicemail', 'voice', 'recording'], difficulty: 'beginner',
    description: 'Two circles stagger in, then the connecting bar bridges them.',
    viewBox: VB, paths: VOICEMAIL_PATHS, animateFn: drawAll,
    ...buildCode('voicemail', VB, VOICEMAIL_PATHS) },
  { id: 135, name: 'Globe', slug: 'globe', category: 'comm',
    tags: ['globe', 'world', 'web', 'international'], difficulty: 'intermediate',
    description: 'Outer ring circles first, equator draws across, longitude curve completes.',
    viewBox: VB, paths: GLOBE_PATHS, animateFn: drawAll,
    ...buildCode('globe', VB, GLOBE_PATHS) },
  { id: 136, name: 'Users', slug: 'users', category: 'comm',
    tags: ['users', 'group', 'team'], difficulty: 'intermediate',
    description: 'Front user shoulders + head draw first, then the second user appears behind.',
    viewBox: VB, paths: USERS_PATHS, animateFn: drawAll,
    ...buildCode('users', VB, USERS_PATHS) },
  { id: 137, name: 'User Plus', slug: 'user-plus', category: 'comm',
    tags: ['user', 'add', 'invite'], difficulty: 'beginner',
    description: 'User figure draws first, then a plus sign builds beside the head.',
    viewBox: VB, paths: USER_PLUS_PATHS, animateFn: drawAll,
    ...buildCode('user-plus', VB, USER_PLUS_PATHS) },
  { id: 138, name: 'User X', slug: 'user-x', category: 'comm',
    tags: ['user', 'remove', 'block'], difficulty: 'beginner',
    description: 'User outlines, then two crossed strokes form an X next to the head — user removed.',
    viewBox: VB, paths: USER_X_PATHS, animateFn: drawAll,
    ...buildCode('user-x', VB, USER_X_PATHS) },
  { id: 139, name: 'User Check', slug: 'user-check', category: 'comm',
    tags: ['user', 'verified', 'approved'], difficulty: 'beginner',
    description: 'User figure draws first, then a confident checkmark settles beside the head.',
    viewBox: VB, paths: USER_CHECK_PATHS, animateFn: drawAll,
    ...buildCode('user-check', VB, USER_CHECK_PATHS) },
  { id: 140, name: 'Signal', slug: 'signal', category: 'comm',
    tags: ['signal', 'bars', 'strength'], difficulty: 'beginner',
    description: 'Five vertical bars stagger upward in increasing height — signal climbing strong.',
    viewBox: VB, paths: SIGNAL_PATHS, animateFn: drawAll,
    ...buildCode('signal', VB, SIGNAL_PATHS) },
  { id: 141, name: 'Broadcast', slug: 'broadcast', category: 'comm',
    tags: ['broadcast', 'antenna', 'transmit'], difficulty: 'intermediate',
    description: 'Center dot draws first, four concentric waves ripple outward — live broadcast.',
    viewBox: VB, paths: BROADCAST_PATHS, animateFn: drawAll,
    ...buildCode('broadcast', VB, BROADCAST_PATHS) },
  // ─── Pack 2: Social Brands ─────────────────────────────────────────────
  { id: 142, name: 'GitHub', slug: 'github', category: 'social',
    tags: ['github', 'git', 'developer'], difficulty: 'advanced',
    description: 'Octocat silhouette traces around its iconic outline in one complex stroke.',
    viewBox: VB, paths: GITHUB_PATHS, animateFn: drawAll,
    ...buildCode('github', VB, GITHUB_PATHS) },
  { id: 143, name: 'Twitter / X', slug: 'twitter-x', category: 'social',
    tags: ['twitter', 'x', 'social'], difficulty: 'beginner',
    description: 'Two crossed strokes form the X mark of modern Twitter.',
    viewBox: VB, paths: TWITTER_X_PATHS, animateFn: drawAll,
    ...buildCode('twitter-x', VB, TWITTER_X_PATHS) },
  { id: 144, name: 'Facebook', slug: 'facebook', category: 'social',
    tags: ['facebook', 'meta', 'social'], difficulty: 'beginner',
    description: 'The lowercase f traces around its iconic Facebook silhouette.',
    viewBox: VB, paths: FACEBOOK_PATHS, animateFn: drawAll,
    ...buildCode('facebook', VB, FACEBOOK_PATHS) },
  { id: 145, name: 'Instagram', slug: 'instagram', category: 'social',
    tags: ['instagram', 'photo', 'social'], difficulty: 'intermediate',
    description: 'Camera frame draws, lens circles in, then the indicator dot pops in the corner.',
    viewBox: VB, paths: INSTAGRAM_PATHS, animateFn: drawAll,
    ...buildCode('instagram', VB, INSTAGRAM_PATHS) },
  { id: 146, name: 'LinkedIn', slug: 'linkedin', category: 'social',
    tags: ['linkedin', 'professional', 'social'], difficulty: 'intermediate',
    description: 'Curved n shape draws, then the small square and dot complete the In glyph.',
    viewBox: VB, paths: LINKEDIN_PATHS, animateFn: drawAll,
    ...buildCode('linkedin', VB, LINKEDIN_PATHS) },
  { id: 147, name: 'YouTube', slug: 'youtube', category: 'social',
    tags: ['youtube', 'video', 'social'], difficulty: 'intermediate',
    description: 'Rounded rectangle traces, then the play triangle locks in at center.',
    viewBox: VB, paths: YOUTUBE_PATHS, animateFn: drawAll,
    ...buildCode('youtube', VB, YOUTUBE_PATHS) },
  { id: 148, name: 'Discord', slug: 'discord', category: 'social',
    tags: ['discord', 'gaming', 'social'], difficulty: 'intermediate',
    description: 'Two eye circles, top and bottom mouth lines, then the side handles complete it.',
    viewBox: VB, paths: DISCORD_PATHS, animateFn: drawAll,
    ...buildCode('discord', VB, DISCORD_PATHS) },
  { id: 149, name: 'Dribbble', slug: 'dribbble', category: 'social',
    tags: ['dribbble', 'design', 'social'], difficulty: 'intermediate',
    description: 'Outer circle draws first, then three internal arcs trace the basketball lines.',
    viewBox: VB, paths: DRIBBBLE_PATHS, animateFn: drawAll,
    ...buildCode('dribbble', VB, DRIBBBLE_PATHS) },
  { id: 150, name: 'Pinterest', slug: 'pinterest', category: 'social',
    tags: ['pinterest', 'pin', 'social'], difficulty: 'intermediate',
    description: 'Outer ring circles, P stem strokes through, then the loop finishes the mark.',
    viewBox: VB, paths: PINTEREST_PATHS, animateFn: drawAll,
    ...buildCode('pinterest', VB, PINTEREST_PATHS) },
  // ─── Pack 3: Tools & Editing ───────────────────────────────────────────
  { id: 151, name: 'Bold', slug: 'bold', category: 'edit',
    tags: ['bold', 'text', 'format'], difficulty: 'beginner',
    description: 'Two bumped lobes stack as the B traces around its closed silhouette.',
    viewBox: VB, paths: BOLD_PATHS, animateFn: drawAll,
    ...buildCode('bold', VB, BOLD_PATHS) },
  { id: 152, name: 'Italic', slug: 'italic', category: 'edit',
    tags: ['italic', 'text', 'format'], difficulty: 'beginner',
    description: 'Three slanted strokes draw in sequence — top edge, bottom edge, then the slash.',
    viewBox: VB, paths: ITALIC_PATHS, animateFn: drawAll,
    ...buildCode('italic', VB, ITALIC_PATHS) },
  { id: 153, name: 'Underline', slug: 'underline', category: 'edit',
    tags: ['underline', 'text', 'format'], difficulty: 'beginner',
    description: 'U-shape draws first, then the underscore line settles below — formatted text cue.',
    viewBox: VB, paths: UNDERLINE_PATHS, animateFn: drawAll,
    ...buildCode('underline', VB, UNDERLINE_PATHS) },
  { id: 154, name: 'Strikethrough', slug: 'strikethrough', category: 'edit',
    tags: ['strikethrough', 'text', 'format'], difficulty: 'intermediate',
    description: 'Two letterform halves stagger in, then the horizontal strike crosses through.',
    viewBox: VB, paths: STRIKETHROUGH_PATHS, animateFn: drawAll,
    ...buildCode('strikethrough', VB, STRIKETHROUGH_PATHS) },
  { id: 155, name: 'Align Left', slug: 'align-left', category: 'edit',
    tags: ['align', 'left', 'paragraph'], difficulty: 'beginner',
    description: 'Four lines stagger left-anchored — short, full, full, short.',
    viewBox: VB, paths: ALIGN_LEFT_PATHS, animateFn: drawAll,
    ...buildCode('align-left', VB, ALIGN_LEFT_PATHS) },
  { id: 156, name: 'Align Center', slug: 'align-center', category: 'edit',
    tags: ['align', 'center', 'paragraph'], difficulty: 'beginner',
    description: 'Four lines stagger center-aligned — symmetrical text-block silhouette.',
    viewBox: VB, paths: ALIGN_CENTER_PATHS, animateFn: drawAll,
    ...buildCode('align-center', VB, ALIGN_CENTER_PATHS) },
  { id: 157, name: 'Align Right', slug: 'align-right', category: 'edit',
    tags: ['align', 'right', 'paragraph'], difficulty: 'beginner',
    description: 'Four lines stagger right-anchored — RTL or right-aligned paragraph.',
    viewBox: VB, paths: ALIGN_RIGHT_PATHS, animateFn: drawAll,
    ...buildCode('align-right', VB, ALIGN_RIGHT_PATHS) },
  { id: 158, name: 'Align Justify', slug: 'align-justify', category: 'edit',
    tags: ['align', 'justify', 'paragraph'], difficulty: 'beginner',
    description: 'Four equal-width lines stagger — fully justified paragraph block.',
    viewBox: VB, paths: ALIGN_JUSTIFY_PATHS, animateFn: drawAll,
    ...buildCode('align-justify', VB, ALIGN_JUSTIFY_PATHS) },
  { id: 159, name: 'List', slug: 'list', category: 'edit',
    tags: ['list', 'bullets', 'unordered'], difficulty: 'beginner',
    description: 'Three bullet dots stagger, then three lines fill in beside them.',
    viewBox: VB, paths: LIST_PATHS, animateFn: drawAll,
    ...buildCode('list', VB, LIST_PATHS) },
  { id: 160, name: 'List Ordered', slug: 'list-ordered', category: 'edit',
    tags: ['list', 'numbered', 'ordered'], difficulty: 'intermediate',
    description: 'Numbers 1, 2, 3 stagger on the left as their corresponding lines draw beside.',
    viewBox: VB, paths: LIST_ORDERED_PATHS, animateFn: drawAll,
    ...buildCode('list-ordered', VB, LIST_ORDERED_PATHS) },
  { id: 161, name: 'List Checks', slug: 'list-checks', category: 'edit',
    tags: ['list', 'checkbox', 'todo'], difficulty: 'intermediate',
    description: 'Three checkmarks stagger on the left as their text lines draw beside them.',
    viewBox: VB, paths: LIST_CHECKS_PATHS, animateFn: drawAll,
    ...buildCode('list-checks', VB, LIST_CHECKS_PATHS) },
  { id: 162, name: 'Type', slug: 'type', category: 'edit',
    tags: ['type', 'text', 'serif'], difficulty: 'beginner',
    description: 'Top serif strokes first, baseline finishes, the vertical T stem draws last.',
    viewBox: VB, paths: TYPE_PATHS, animateFn: drawAll,
    ...buildCode('type', VB, TYPE_PATHS) },
  { id: 163, name: 'Quote', slug: 'quote', category: 'edit',
    tags: ['quote', 'blockquote', 'citation'], difficulty: 'intermediate',
    description: 'Two curved comma marks draw side by side — opening and closing quote pair.',
    viewBox: VB, paths: QUOTE_PATHS, animateFn: drawAll,
    ...buildCode('quote', VB, QUOTE_PATHS) },
  { id: 164, name: 'Pen Tool', slug: 'pen-tool', category: 'edit',
    tags: ['pen', 'vector', 'design'], difficulty: 'advanced',
    description: 'Diamond nib, anchor crosshair, leader line, and the inset square stagger in.',
    viewBox: VB, paths: PEN_TOOL_PATHS, animateFn: drawAll,
    ...buildCode('pen-tool', VB, PEN_TOOL_PATHS) },
  { id: 165, name: 'Brush', slug: 'brush', category: 'edit',
    tags: ['brush', 'paint', 'tool'], difficulty: 'intermediate',
    description: 'Brush handle strokes diagonally first, then the bristly tip blooms below.',
    viewBox: VB, paths: BRUSH_PATHS, animateFn: drawAll,
    ...buildCode('brush', VB, BRUSH_PATHS) },
  { id: 166, name: 'Palette', slug: 'palette', category: 'edit',
    tags: ['palette', 'color', 'paint'], difficulty: 'intermediate',
    description: 'Palette outline draws, then four paint dots stagger in across its surface.',
    viewBox: VB, paths: PALETTE_PATHS, animateFn: drawAll,
    ...buildCode('palette', VB, PALETTE_PATHS) },
  { id: 167, name: 'Eraser', slug: 'eraser', category: 'edit',
    tags: ['eraser', 'clear', 'undo'], difficulty: 'beginner',
    description: 'Slanted eraser body silhouettes first, then the workspace baseline draws below.',
    viewBox: VB, paths: ERASER_PATHS, animateFn: drawAll,
    ...buildCode('eraser', VB, ERASER_PATHS) },
  { id: 168, name: 'Ruler', slug: 'ruler', category: 'edit',
    tags: ['ruler', 'measure', 'design'], difficulty: 'intermediate',
    description: 'Ruler outline traces first, then four tick marks stagger along its edge.',
    viewBox: VB, paths: RULER_PATHS, animateFn: drawAll,
    ...buildCode('ruler', VB, RULER_PATHS) },
  { id: 169, name: 'Scissors', slug: 'scissors', category: 'edit',
    tags: ['scissors', 'cut', 'tool'], difficulty: 'intermediate',
    description: 'Two thumb circles stagger, then the cutting blades cross through them.',
    viewBox: VB, paths: SCISSORS_PATHS, animateFn: drawAll,
    ...buildCode('scissors', VB, SCISSORS_PATHS) },
  { id: 170, name: 'Paperclip', slug: 'paperclip', category: 'edit',
    tags: ['paperclip', 'attach', 'clip'], difficulty: 'intermediate',
    description: 'Single curling stroke traces around the paperclip silhouette in one continuous line.',
    viewBox: VB, paths: PAPERCLIP_PATHS, animateFn: drawAll,
    ...buildCode('paperclip', VB, PAPERCLIP_PATHS) },
  { id: 171, name: 'Magnet', slug: 'magnet', category: 'edit',
    tags: ['magnet', 'snap', 'tool'], difficulty: 'intermediate',
    description: 'U-shaped magnet body draws first, then the two pole bars stripe across the tips.',
    viewBox: VB, paths: MAGNET_PATHS, animateFn: drawAll,
    ...buildCode('magnet', VB, MAGNET_PATHS) },
  { id: 172, name: 'Wrench', slug: 'wrench', category: 'edit',
    tags: ['wrench', 'tool', 'settings'], difficulty: 'intermediate',
    description: 'Wrench traces around its open jaw and angled handle in a single closed stroke.',
    viewBox: VB, paths: WRENCH_PATHS, animateFn: drawAll,
    ...buildCode('wrench', VB, WRENCH_PATHS) },
  { id: 173, name: 'Hammer', slug: 'hammer', category: 'edit',
    tags: ['hammer', 'tool', 'build'], difficulty: 'intermediate',
    description: 'Handle strokes diagonally, then the head locks in at the top.',
    viewBox: VB, paths: HAMMER_PATHS, animateFn: drawAll,
    ...buildCode('hammer', VB, HAMMER_PATHS) },
  { id: 174, name: 'Key', slug: 'key', category: 'edit',
    tags: ['key', 'access', 'unlock'], difficulty: 'intermediate',
    description: 'Long shaft draws diagonally, eye loops at the end, then the small notch tooth.',
    viewBox: VB, paths: KEY_PATHS, animateFn: drawAll,
    ...buildCode('key', VB, KEY_PATHS) },
  { id: 175, name: 'Target', slug: 'target', category: 'edit',
    tags: ['target', 'crosshair', 'aim'], difficulty: 'intermediate',
    description: 'Outer ring, middle ring, and bullseye stagger inward — concentric target reveal.',
    viewBox: VB, paths: TARGET_PATHS, animateFn: drawAll,
    ...buildCode('target', VB, TARGET_PATHS) },
  // ─── Pack 4: Commerce ───────────────────────────────────────────────────
  { id: 176, name: 'Shopping Cart', slug: 'shopping-cart', category: 'shop',
    tags: ['cart', 'shop', 'buy'], difficulty: 'intermediate',
    description: 'Wheels stagger first, then the cart body strokes around — checkout primed.',
    viewBox: VB, paths: SHOPPING_CART_PATHS, animateFn: drawAll,
    ...buildCode('shopping-cart', VB, SHOPPING_CART_PATHS) },
  { id: 177, name: 'Shopping Bag', slug: 'shopping-bag', category: 'shop',
    tags: ['bag', 'shop', 'purchase'], difficulty: 'intermediate',
    description: 'Bag silhouette traces, top crease line settles, then the U handle curls inside.',
    viewBox: VB, paths: SHOPPING_BAG_PATHS, animateFn: drawAll,
    ...buildCode('shopping-bag', VB, SHOPPING_BAG_PATHS) },
  { id: 178, name: 'Credit Card', slug: 'credit-card', category: 'shop',
    tags: ['credit-card', 'payment', 'pay'], difficulty: 'beginner',
    description: 'Card outline strokes first, then the magnetic stripe finishes across the top.',
    viewBox: VB, paths: CREDIT_CARD_PATHS, animateFn: drawAll,
    ...buildCode('credit-card', VB, CREDIT_CARD_PATHS) },
  { id: 179, name: 'Wallet', slug: 'wallet', category: 'shop',
    tags: ['wallet', 'money', 'pay'], difficulty: 'intermediate',
    description: 'Wallet body silhouette draws, then the small clasp dot pops on the right.',
    viewBox: VB, paths: WALLET_PATHS, animateFn: drawAll,
    ...buildCode('wallet', VB, WALLET_PATHS) },
  { id: 180, name: 'Receipt', slug: 'receipt', category: 'shop',
    tags: ['receipt', 'invoice', 'bill'], difficulty: 'intermediate',
    description: 'Zig-zag receipt outline strokes first, then three text lines stagger inside.',
    viewBox: VB, paths: RECEIPT_PATHS, animateFn: drawAll,
    ...buildCode('receipt', VB, RECEIPT_PATHS) },
  { id: 181, name: 'Gift', slug: 'gift', category: 'shop',
    tags: ['gift', 'present', 'box'], difficulty: 'intermediate',
    description: 'Box bottom, lid, vertical ribbon, and decorative bow stagger together.',
    viewBox: VB, paths: GIFT_PATHS, animateFn: drawAll,
    ...buildCode('gift', VB, GIFT_PATHS) },
  { id: 182, name: 'Truck', slug: 'truck', category: 'shop',
    tags: ['truck', 'delivery', 'shipping'], difficulty: 'intermediate',
    description: 'Cargo box draws first, cabin attaches on the side, then two wheels roll into place.',
    viewBox: VB, paths: TRUCK_PATHS, animateFn: drawAll,
    ...buildCode('truck', VB, TRUCK_PATHS) },
  { id: 183, name: 'Package', slug: 'package', category: 'shop',
    tags: ['package', 'box', 'shipping'], difficulty: 'intermediate',
    description: 'Box outline traces first, then the diagonal seam and central spine appear.',
    viewBox: VB, paths: PACKAGE_BOX_PATHS, animateFn: drawAll,
    ...buildCode('package', VB, PACKAGE_BOX_PATHS) },
  { id: 184, name: 'Dollar Sign', slug: 'dollar-sign', category: 'shop',
    tags: ['dollar', 'money', 'currency'], difficulty: 'beginner',
    description: 'Vertical bar strokes first, then the S-curve loops around it — currency mark.',
    viewBox: VB, paths: DOLLAR_SIGN_PATHS, animateFn: drawAll,
    ...buildCode('dollar-sign', VB, DOLLAR_SIGN_PATHS) },
  { id: 185, name: 'Percent', slug: 'percent', category: 'shop',
    tags: ['percent', 'discount', 'sale'], difficulty: 'beginner',
    description: 'Diagonal slash strokes first, then two dots cap each end — discount cue.',
    viewBox: VB, paths: PERCENT_PATHS, animateFn: drawAll,
    ...buildCode('percent', VB, PERCENT_PATHS) },
  // ─── Pack 4: Weather ────────────────────────────────────────────────────
  { id: 186, name: 'Cloud Rain', slug: 'cloud-rain', category: 'weather',
    tags: ['cloud', 'rain', 'weather'], difficulty: 'intermediate',
    description: 'Cloud silhouette traces first, then six rain streaks stagger down — drizzle on demand.',
    viewBox: VB, paths: CLOUD_RAIN_PATHS, animateFn: drawAll,
    ...buildCode('cloud-rain', VB, CLOUD_RAIN_PATHS) },
  { id: 187, name: 'Cloud Snow', slug: 'cloud-snow', category: 'weather',
    tags: ['cloud', 'snow', 'weather'], difficulty: 'intermediate',
    description: 'Cloud strokes first, six snowflake dots stagger downward — winter forecast.',
    viewBox: VB, paths: CLOUD_SNOW_PATHS, animateFn: drawAll,
    ...buildCode('cloud-snow', VB, CLOUD_SNOW_PATHS) },
  { id: 188, name: 'Cloud Lightning', slug: 'cloud-lightning', category: 'weather',
    tags: ['cloud', 'lightning', 'storm'], difficulty: 'intermediate',
    description: 'Cloud silhouette traces, then a sharp lightning bolt zig-zags down through it.',
    viewBox: VB, paths: CLOUD_LIGHTNING_PATHS, animateFn: drawAll,
    ...buildCode('cloud-lightning', VB, CLOUD_LIGHTNING_PATHS) },
  { id: 189, name: 'Cloud Drizzle', slug: 'cloud-drizzle', category: 'weather',
    tags: ['cloud', 'drizzle', 'weather'], difficulty: 'intermediate',
    description: 'Cloud strokes first, then six tiny drizzle marks dot down — light rain.',
    viewBox: VB, paths: CLOUD_DRIZZLE_PATHS, animateFn: drawAll,
    ...buildCode('cloud-drizzle', VB, CLOUD_DRIZZLE_PATHS) },
  { id: 190, name: 'Rainbow', slug: 'rainbow', category: 'weather',
    tags: ['rainbow', 'weather', 'arc'], difficulty: 'intermediate',
    description: 'Three nested arcs stagger from outermost in — rainbow forming after rain.',
    viewBox: VB, paths: RAINBOW_PATHS, animateFn: drawAll,
    ...buildCode('rainbow', VB, RAINBOW_PATHS) },
  { id: 191, name: 'Wind', slug: 'wind', category: 'weather',
    tags: ['wind', 'breeze', 'air'], difficulty: 'intermediate',
    description: 'Three swooping curves draw across the canvas — gusts in motion.',
    viewBox: VB, paths: WIND_PATHS, animateFn: drawAll,
    ...buildCode('wind', VB, WIND_PATHS) },
  { id: 192, name: 'Thermometer', slug: 'thermometer', category: 'weather',
    tags: ['thermometer', 'temperature', 'heat'], difficulty: 'beginner',
    description: 'Single closed silhouette traces around the bulb and stem in one continuous line.',
    viewBox: VB, paths: THERMOMETER_PATHS, animateFn: drawAll,
    ...buildCode('thermometer', VB, THERMOMETER_PATHS) },
  { id: 193, name: 'Droplet', slug: 'droplet', category: 'weather',
    tags: ['droplet', 'water', 'rain'], difficulty: 'beginner',
    description: 'Single teardrop silhouette traces around the water droplet form.',
    viewBox: VB, paths: DROPLET_PATHS, animateFn: drawAll,
    ...buildCode('droplet', VB, DROPLET_PATHS) },
  { id: 194, name: 'Snowflake', slug: 'snowflake', category: 'weather',
    tags: ['snowflake', 'snow', 'winter'], difficulty: 'beginner',
    description: 'Two perpendicular lines and two diagonal lines stagger out from center — symmetrical flake.',
    viewBox: VB, paths: SNOWFLAKE_PATHS, animateFn: drawAll,
    ...buildCode('snowflake', VB, SNOWFLAKE_PATHS) },
  { id: 195, name: 'Umbrella', slug: 'umbrella', category: 'weather',
    tags: ['umbrella', 'rain', 'protect'], difficulty: 'intermediate',
    description: 'Canopy arc strokes first, then the curved handle hooks underneath.',
    viewBox: VB, paths: UMBRELLA_PATHS, animateFn: drawAll,
    ...buildCode('umbrella', VB, UMBRELLA_PATHS) },
  // ─── Pack 4: Lifestyle (misc) ──────────────────────────────────────────
  { id: 196, name: 'Coffee', slug: 'coffee', category: 'misc',
    tags: ['coffee', 'cup', 'cafe'], difficulty: 'intermediate',
    description: 'Three steam wisps stagger up first, then the cup and handle silhouette traces.',
    viewBox: VB, paths: COFFEE_PATHS, animateFn: drawAll,
    ...buildCode('coffee', VB, COFFEE_PATHS) },
  { id: 197, name: 'Pizza', slug: 'pizza', category: 'misc',
    tags: ['pizza', 'food', 'slice'], difficulty: 'intermediate',
    description: 'Triangle slice silhouette draws first, then three pepperoni dots stagger in.',
    viewBox: VB, paths: PIZZA_PATHS, animateFn: drawAll,
    ...buildCode('pizza', VB, PIZZA_PATHS) },
  { id: 198, name: 'Gem', slug: 'gem', category: 'misc',
    tags: ['gem', 'jewel', 'diamond'], difficulty: 'intermediate',
    description: 'Faceted gem silhouette traces, then the inner facet line splits the crystal.',
    viewBox: VB, paths: GEM_PATHS, animateFn: drawAll,
    ...buildCode('gem', VB, GEM_PATHS) },
  { id: 199, name: 'Book', slug: 'book', category: 'misc',
    tags: ['book', 'read', 'library'], difficulty: 'intermediate',
    description: 'Bookmark spine draws first, then the pages and cover wrap around it.',
    viewBox: VB, paths: BOOK_PATHS, animateFn: drawAll,
    ...buildCode('book', VB, BOOK_PATHS) },
  { id: 200, name: 'Leaf', slug: 'leaf', category: 'misc',
    tags: ['leaf', 'nature', 'eco'], difficulty: 'intermediate',
    description: 'Leaf silhouette traces around its blade, then the central stem-vein draws through.',
    viewBox: VB, paths: LEAF_PATHS, animateFn: drawAll,
    ...buildCode('leaf', VB, LEAF_PATHS) },
]
