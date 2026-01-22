import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Legends League</h1>
        <p className="mt-2 text-lg text-muted-foreground">The future of amateur sports management.</p>
      </div>
      <div className="mt-8">
        <Link 
          href="/leagues/1a2b3c4d-5e6f-7890-1234-567890abcdef/ranking" 
          className="px-6 py-3 font-bold text-white bg-primary rounded-lg hover:bg-primary/90"
        >
          View Demo League Ranking
        </Link>
      </div>
    </main>
  );
}
