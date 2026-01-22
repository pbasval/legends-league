'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTeam(name: string, leagueId: string) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return 'You must be logged in to create a team.'
  }

  const { error } = await supabase.from('teams').insert({
    name,
    dt_id: user.id,
    league_id: leagueId,
  })

  if (error) {
    console.error('Error creating team:', error)
    return 'Error creating team.'
  }

  revalidatePath(`/dashboard/leagues/${leagueId}`)
}
