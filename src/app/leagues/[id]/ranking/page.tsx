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
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {league.name}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">League Ranking</p>
      </div>
      <div className="max-w-2xl mx-auto border rounded-lg shadow-lg">
        <div className="relative w-full overflow-auto">
          <table className="w-full text-sm caption-bottom">
            <thead className="[&>tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[50px]">
                  Rank
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Team
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  ELO Rating
                </th>
              </tr>
            </thead>
            <tbody className="[&>tr:last-child]:border-0">
              {teams.map((team, index) => (
                <tr key={team.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 text-center align-middle font-medium">{index + 1}</td>
                  <td className="p-4 font-medium align-middle">{team.name}</td>
                  <td className="p-4 text-right align-middle font-semibold">{team.elo_rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
