import { PetCard } from '@/components/shared'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{
    code: string
  }>
}

async function SharePage({ params }: Props) {
  const { code } = await params
  const supabase = await createClient()
  const { data: pet, error } = await supabase.from('pets').select('*').eq('code', decodeURIComponent(code)).limit(1).single()
  if (error || !pet) return notFound()
  return (
    <div className="flex justify-center items-center h-svh w-svw bg-zinc-200">
      <PetCard petId={pet.code} pet={pet} viewAs="share" action="view" />
    </div>
  )
}

export default SharePage
