import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function TeamList({ leagueId }: { leagueId: string }) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: teams } = await supabase
    .from('teams')
    .select('id, name')
    .eq('dt_id', user.id)
    .eq('league_id', leagueId)

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold">Your Teams</h2>
      {teams && teams.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {teams.map((team) => (
            <li key={team.id} className="p-4 bg-card rounded-md shadow">
              {team.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-muted-foreground">You haven't created any teams in this league yet.</p>
      )}
    </div>
  )
}
