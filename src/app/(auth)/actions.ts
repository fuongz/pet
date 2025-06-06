'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export const signInWithGoogleAction = async () => {
  const supabase = await createClient()
  const origin = (await headers()).get('origin')
  const previousPathname = (await headers()).get('x-current-path')
  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback?redirect_to=${previousPathname || '/pets'}`,
    },
  })

  console.log(data)

  if (error) {
    console.error(error.code + ' ' + error.message)
    return redirect(`/?error=${error.message}`)
  } else {
    return redirect(data.url)
  }
}

export const signOutAction = async () => {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error(error.code + ' ' + error.message)
    return redirect(`/?error=${error.message}`)
  } else {
    return redirect('/')
  }
}
