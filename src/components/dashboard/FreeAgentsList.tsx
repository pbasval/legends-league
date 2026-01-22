import { createClient } from '@/lib/supabase/server'

export default async function FreeAgentsList({ leagueId }: { leagueId: string }) {
  const supabase = createClient()

  // Find all user IDs that are already in a team within the current league
  const { data: teamMembersInLeague, error: membersError } = await supabase
    .from('teams')
    .select('team_members ( player_id )')
    .eq('league_id', leagueId)

  if (membersError) {
    return <p>Could not fetch team members.</p>
  }

  const playerIdsInTeams = teamMembersInLeague
    .flatMap(t => t.team_members)
    .map(tm => tm.player_id)

  // Fetch all players who are NOT in the list of players already in a team
  const { data: freeAgents, error: agentsError } = await supabase
    .from('profiles')
    .select('id, full_name, player_rating')
    .eq('role', 'player')
    .not('id', 'in', `(${playerIdsInTeams.join(',')})`)

  if (agentsError) {
    return <p>Could not fetch free agents.</p>
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold">Free Agents</h2>
      {freeAgents && freeAgents.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {freeAgents.map((agent) => (
            <li key={agent.id} className="flex items-center justify-between p-4 bg-card rounded-md shadow">
              <div>
                <p className="font-semibold">{agent.full_name}</p>
                <p className="text-sm text-muted-foreground">Rating: {agent.player_rating.toFixed(0)}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-muted-foreground">No free agents available in this league.</p>
      )}
    </div>
  )
}
