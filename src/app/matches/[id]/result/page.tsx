import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

const createSupabaseServerClient = () => {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
};

export default async function MatchResultPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();

  const { data: match, error } = await supabase
    .from('matches')
    .select(
      `
      id,
      team1_score,
      team2_score,
      elo_change_team1,
      elo_change_team2,
      team1:teams!matches_team1_id_fkey (name, elo_rating),
      team2:teams!matches_team2_id_fkey (name, elo_rating),
      mvp:profiles (full_name, player_rating)
    `
    )
    .eq('id', params.id)
    .single();

  if (error || !match) {
    console.error('Error fetching match:', error);
    notFound();
  }

  // Ensure nested objects are not null before accessing properties
  const team1_name = match.team1?.name ?? 'Team 1';
  const team1_elo_rating = match.team1?.elo_rating ?? 1000;
  const team2_name = match.team2?.name ?? 'Team 2';
  const team2_elo_rating = match.team2?.elo_rating ?? 1000;
  const mvp_name = match.mvp?.full_name ?? 'N/A';
  const mvp_rating = match.mvp?.player_rating ?? 800;

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">Match Result</h1>
        
        <div className="grid grid-cols-3 items-center text-center mb-6">
          <div className="font-semibold text-lg">{team1_name}</div>
          <div className="text-4xl font-bold">{`${match.team1_score} - ${match.team2_score}`}</div>
          <div className="font-semibold text-lg">{team2_name}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-muted-foreground text-sm">ELO Change</p>
            <p className={`text-lg font-bold ${match.elo_change_team1 && match.elo_change_team1 >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {match.elo_change_team1 && match.elo_change_team1 > 0 ? `+${match.elo_change_team1}` : match.elo_change_team1 || 'N/A'}
            </p>
            <p className="text-xs text-muted-foreground">New ELO: {team1_elo_rating}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">ELO Change</p>
            <p className={`text-lg font-bold ${match.elo_change_team2 && match.elo_change_team2 >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {match.elo_change_team2 && match.elo_change_team2 > 0 ? `+${match.elo_change_team2}` : match.elo_change_team2 || 'N/A'}
            </p>
            <p className="text-xs text-muted-foreground">New ELO: {team2_elo_rating}</p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border">
          <h2 className="text-xl font-semibold text-center mb-4">Most Valuable Player</h2>
          <div className="bg-primary/10 p-4 rounded-lg max-w-xs mx-auto text-center">
            <h3 className="text-lg font-bold text-primary">{mvp_name}</h3>
            <p className="text-muted-foreground">Player Rating: {mvp_rating.toFixed(0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
