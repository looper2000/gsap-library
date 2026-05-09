import { animations } from '@/data/animations'
import { notFound } from 'next/navigation'
import { AnimationDetailView } from '@/components/AnimationDetailView'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return animations.map(a => ({ slug: a.slug }))
}

export default function AnimationPage({ params }: Props) {
  const exists = animations.some(a => a.slug === params.slug)
  if (!exists) notFound()
  // Pass only the slug — AnimationDetailView imports animation data client-side
  return <AnimationDetailView slug={params.slug} />
}
