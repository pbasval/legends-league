import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TeamManagement from '@/components/dashboard/TeamManagement'

export default async function LeagueDashboardPage({ params }: { params: { leagueId: string } }) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
    
  const { data: league } = await supabase
    .from('leagues')
    .select('name')
    .eq('id', params.leagueId)
    .single()

  return (
    <div className="container p-4 mx-auto sm:p-6 md:p-8">
      <h1 className="mb-4 text-2xl font-bold">{league?.name}</h1>
      
      {profile?.role === 'dt' ? (
        <TeamManagement leagueId={params.leagueId} />
      ) : (
        <div>
          <h2 className="text-lg font-semibold">Player Dashboard</h2>
          <p className="mt-2 text-muted-foreground">Team invitations and upcoming matches for this league will appear here.</p>
        </div>
      )}
    </div>
  )
}
