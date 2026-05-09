export type Category =
  | 'fade'
  | 'slide'
  | 'split'
  | 'scramble'
  | 'typewriter'
  | 'clip'
  | 'blur'
  | 'scale'
  | 'wave'
  | 'rotate'
  | 'glitch'
  | 'stagger'
  | 'bounce'
  | 'advanced'

export type IconCategory =
  | 'arrow' | 'ui' | 'shape' | 'media' | 'comm' | 'misc'
  | 'files' | 'social' | 'edit' | 'shop' | 'weather'

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface Animation {
  id: number
  name: string
  slug: string
  category: Category
  tags: string[]
  difficulty: Difficulty
  description: string
  previewText: string
  animateFn: (el: HTMLElement, gsap: any) => unknown
  reactCode: string
  vanillaCode: string
  webflowCode: string
}

export interface Icon {
  id: number
  name: string
  slug: string
  category: IconCategory
  tags: string[]
  difficulty: Difficulty
  description: string
  viewBox: string
  paths: string[]
  animateFn: (svg: SVGSVGElement, gsap: any) => unknown
  reactCode: string
  vanillaCode: string
  webflowCode: string
}

export type WishlistId = `text-${number}` | `icon-${number}`
