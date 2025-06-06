'use server'

import { PetSelector } from '@/features/pets/components'
import { createClient } from '@/lib/supabase/server'

async function PetDashboard() {
  const supabase = await createClient()
  const { data: pets } = await supabase.from('pets').select('*').limit(10)

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <PetSelector pets={pets || []} />
      </div>
    </div>
  )
}

export default PetDashboard
