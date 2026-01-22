import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/auth/LogoutButton'

type League = {
  id: string;
  name: string;
}

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

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
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold">Welcome back,</h1>
          <p className="text-muted-foreground">{profile?.full_name || user.email}!</p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Your Leagues</h2>
          {/* You can add a 'Create League' button here if you want */}
        </div>
        
        {leagues && leagues.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
            {leagues.map((league: League) => (
              <Link key={league.id} href={`/dashboard/leagues/${league.id}`} className="block">
                <div className="p-6 transition-all duration-300 bg-card rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1">
                  <h3 className="text-lg font-bold text-primary">{league.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 mt-6 text-center bg-card rounded-xl">
            <p className="text-lg font-medium">You are not part of any leagues yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">Join a league or create a new one to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}
