import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <div className="w-full max-w-md p-8 space-y-4 text-center bg-card rounded-2xl shadow-lg">
        <h1 className="text-4xl font-bold">Legends League</h1>
        <p className="text-lg text-muted-foreground">The future of amateur sports management.</p>
        <div className="pt-4">
          <Link 
            href="/leagues/1a2b3c4d-5e6f-7890-1234-567890abcdef/ranking" 
            className="inline-block px-6 py-3 font-bold text-white transition-colors bg-primary rounded-lg hover:bg-primary/90"
          >
            View Demo League Ranking
          </Link>
        </div>
      </div>
    </div>
  );
}
