import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/auth/LogoutButton'

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch leagues where the user is a DT or a player in one of the teams.
  // This query is complex and could be optimized with a database view or function.
  const { data: leagues, error } = await supabase.rpc('get_user_leagues', { p_user_id: user.id })

  if (error) {
    console.error('Error fetching leagues:', error)
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  return (
    <div className="container p-4 mx-auto sm:p-6 md:p-8">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <h1 className="text-xl font-bold text-center sm:text-2xl sm:text-left">
          Welcome back, {profile?.full_name || user.email}!
        </h1>
        <LogoutButton />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Your Leagues</h2>
        {leagues && leagues.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-3">
            {leagues.map((league) => (
              <Link key={league.id} href={`/dashboard/leagues/${league.id}`}>
                <div className="p-4 transition-transform transform bg-card rounded-lg shadow hover:scale-105">
                  <h3 className="font-bold text-primary">{league.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-muted-foreground">You are not part of any leagues yet.</p>
        )}
      </div>
    </div>
  )
}
