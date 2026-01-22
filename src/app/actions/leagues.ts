'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createLeague(name: string) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return 'You must be logged in.'
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'super_admin') {
    return 'You are not authorized to create leagues.'
  }

  const { error } = await supabase.from('leagues').insert({
    name,
    owner_id: user.id,
  })

  if (error) {
    console.error('Error creating league:', error)
    return 'Error creating league.'
  }

  revalidatePath('/admin')
}
