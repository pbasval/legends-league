import Link from 'next/link'
import CreateTeamForm from '@/components/teams/CreateTeamForm'
import TeamList from '@/components/teams/TeamList'
import FreeAgentsList from './FreeAgentsList'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function TeamManagement({ leagueId }: { leagueId: string }) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Team Management</h2>
        {profile?.username && (
          <Link href={`/profiles/${profile.username}`} className="text-sm font-medium text-primary hover:underline">
            View My Public Profile
          </Link>
        )}
      </div>
      <CreateTeamForm leagueId={leagueId} />
      <TeamList leagueId={leagueId} />
      <FreeAgentsList leagueId={leagueId} />
    </div>
  )
}
