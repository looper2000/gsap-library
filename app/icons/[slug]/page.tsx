import { icons } from '@/data/icons'
import { notFound } from 'next/navigation'
import { IconDetailView } from '@/components/IconDetailView'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return icons.map(i => ({ slug: i.slug }))
}

export default function IconPage({ params }: Props) {
  const exists = icons.some(i => i.slug === params.slug)
  if (!exists) notFound()
  return <IconDetailView slug={params.slug} />
}
