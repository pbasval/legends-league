import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function RankingPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: league, error: leagueError } = await supabase
    .from('leagues')
    .select('name')
    .eq('id', params.id)
    .single()

  if (leagueError || !league) {
    notFound()
  }

  const { data: teams, error: teamsError } = await supabase
    .from('teams')
    .select('id, name, elo_rating')
    .eq('league_id', params.id)
    .order('elo_rating', { ascending: false })

  if (teamsError) {
    // You could show an error message here
    return <p>Could not fetch teams.</p>
  }

  return (
    <div className="container p-4 mx-auto sm:p-6 md:p-8">
      <h1 className="mb-4 text-2xl font-bold text-center sm:text-3xl">
        {league.name} - Ranking
      </h1>
      <div className="max-w-xl mx-auto overflow-hidden bg-card rounded-lg shadow-lg">
        <ul className="divide-y divide-border">
          {teams.map((team, index) => (
            <li key={team.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-muted-foreground">{index + 1}</span>
                <span className="font-semibold">{team.name}</span>
              </div>
              <span className="font-bold text-primary">{team.elo_rating}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
