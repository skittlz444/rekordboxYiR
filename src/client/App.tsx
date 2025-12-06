import { useState } from 'react'
import './index.css'
import './App.css'
import { StatsResponse, TrackStat, ArtistStat, GenreStat, BPMStat } from '@/shared/types'
import { UploadContainer } from './features/upload/UploadContainer'

function App() {
  const [results, setResults] = useState<StatsResponse | null>(null)

  return (
    <div className="container mx-auto min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold text-center py-8">Rekordbox Year in Review</h1>
      
      {!results ? (
        <UploadContainer onUploadSuccess={setResults} />
      ) : (
        <div className="results p-4 space-y-8">
          <h2 className="text-3xl font-bold text-center">Stats for {results.year}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="stat-card bg-card text-card-foreground rounded-lg border shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">Top Tracks</h3>
              <ol className="list-decimal list-inside space-y-2">
                {results.topTracks?.map((t: TrackStat, i: number) => (
                  <li key={i} className="text-sm">
                    <span className="font-medium">{t.Title || 'Unknown Track'}</span>
                    <span className="text-muted-foreground"> by {t.Artist || 'Unknown Artist'}</span>
                    <div className="text-xs text-muted-foreground ml-4">{t.count} plays</div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="stat-card bg-card text-card-foreground rounded-lg border shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">Top Artists</h3>
              <ol className="list-decimal list-inside space-y-2">
                {results.topArtists?.map((a: ArtistStat, i: number) => (
                  <li key={i} className="text-sm">
                    <span className="font-medium">{a.Name || 'Unknown Artist'}</span>
                    <div className="text-xs text-muted-foreground ml-4">{a.count} plays</div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="stat-card bg-card text-card-foreground rounded-lg border shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">Top Genres</h3>
              <ol className="list-decimal list-inside space-y-2">
                {results.topGenres?.map((g: GenreStat, i: number) => (
                  <li key={i} className="text-sm">
                    <span className="font-medium">{g.Name || 'Unknown Genre'}</span>
                    <div className="text-xs text-muted-foreground ml-4">{g.count} plays</div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="stat-card bg-card text-card-foreground rounded-lg border shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">Top BPMs</h3>
              <ol className="list-decimal list-inside space-y-2">
                {results.topBPMs?.map((b: BPMStat, i: number) => (
                  <li key={i} className="text-sm">
                    <span className="font-medium">{Math.round(b.BPM / 100)} BPM</span>
                    <div className="text-xs text-muted-foreground ml-4">{b.count} plays</div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="summary-stats bg-card text-card-foreground rounded-lg border shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">Session Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="highlight-item p-4 bg-muted rounded-md">
                <h4 className="text-sm font-medium text-muted-foreground">Most Songs in a Session</h4>
                <p className="text-2xl font-bold">{results.mostSongsSession?.song_count || 0} songs</p>
                <small className="text-xs text-muted-foreground">{results.mostSongsSession?.DateCreated}</small>
              </div>
              <div className="highlight-item p-4 bg-muted rounded-md">
                <h4 className="text-sm font-medium text-muted-foreground">Most Active Month (Songs)</h4>
                <p className="text-2xl font-bold">{results.mostActiveMonthSongs?.song_count || 0} songs</p>
                <small className="text-xs text-muted-foreground">{results.mostActiveMonthSongs?.month}</small>
              </div>
              <div className="highlight-item p-4 bg-muted rounded-md">
                <h4 className="text-sm font-medium text-muted-foreground">Most Active Month (Sessions)</h4>
                <p className="text-2xl font-bold">{results.mostActiveMonthSessions?.session_count || 0} sessions</p>
                <small className="text-xs text-muted-foreground">{results.mostActiveMonthSessions?.month}</small>
              </div>
              <div className="highlight-item p-4 bg-muted rounded-md">
                <h4 className="text-sm font-medium text-muted-foreground">Avg Session Length</h4>
                <p className="text-2xl font-bold">{Math.round(results.avgSessionLength || 0)} songs</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button 
              onClick={() => setResults(null)}
              className="text-primary hover:underline"
            >
              Upload another file
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
