import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const supabase = createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      username,
      full_name,
      player_rating,
      team_members (
        teams (
          name,
          shield_url
        )
      )
    `)
    .eq('username', params.username)
    .single()

  if (error || !profile) {
    notFound()
  }

  const teamInfo = profile.team_members[0]?.teams;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm p-8 space-y-4 bg-card rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
        <div className="text-center">
          <p className="text-4xl font-bold">{profile.player_rating.toFixed(0)}</p>
          <p className="text-sm font-medium text-muted-foreground">Player Rating</p>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold">{profile.full_name}</h1>
          <p className="text-lg text-muted-foreground">@{profile.username}</p>
        </div>
        {teamInfo && (
          <div className="pt-4 mt-4 text-center border-t border-border">
            <h2 className="text-sm font-semibold text-muted-foreground">Current Team</h2>
            <p className="text-lg font-medium">{teamInfo.name}</p>
          </div>
        )}
      </div>
    </div>
  )
}
