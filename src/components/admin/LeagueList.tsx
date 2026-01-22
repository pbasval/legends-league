import { createClient } from '@/lib/supabase/server'

export default async function LeagueList() {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: leagues } = await supabase
    .from('leagues')
    .select('id, name')
    .eq('owner_id', user!.id)

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold">Your Leagues</h2>
      {leagues && leagues.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {leagues.map((league) => (
            <li key={league.id} className="p-4 bg-card rounded-md shadow">
              {league.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-muted-foreground">You haven't created any leagues yet.</p>
      )}
    </div>
  )
}
