import { PetRegistrationForm } from '@/components/shared'
import { createClient } from '@/lib/supabase/server'
import { UTCDate } from '@date-fns/utc'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ code: string }>
}

async function UpdatePetPage({ params }: Props) {
  const { code } = await params
  if (!code) return notFound()
  const supabase = await createClient()
  const { data: pet } = await supabase.from('pets').select('*').eq('code', decodeURIComponent(code)).limit(1).single()
  if (!pet) return notFound()
  return (
    <PetRegistrationForm
      action="update"
      viewAs="authenticated"
      pet={{
        ...pet,
        gender: '' + pet.gender,
        dateOfIssue: new UTCDate(pet.dateOfIssue),
        dateOfBirth: new UTCDate(pet.dateOfBirth),
      }}
    />
  )
}

export default UpdatePetPage
