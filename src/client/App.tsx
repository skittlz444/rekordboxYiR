import { useState } from 'react'
import './index.css'
import './App.css'
import { StatsResponse, TrackStat, ArtistStat, GenreStat, BPMStat } from '@/shared/types'
import { UploadContainer } from './features/upload/UploadContainer'

function App() {
  const [results, setResults] = useState<StatsResponse | null>(null)

  const getRankChange = <T,>(item: T, currentRank: number, comparisonList: T[], key: keyof T) => {
    if (!comparisonList) return null;
    const prevIndex = comparisonList.findIndex((prevItem) => prevItem[key] === item[key]);
    if (prevIndex === -1) return null;
    
    const prevRank = prevIndex + 1;
    const diff = prevRank - currentRank;
    
    if (diff === 0) return <span className="text-gray-500 ml-2 text-xs">(=)</span>;
    if (diff > 0) return <span className="text-green-500 ml-2 text-xs">▲{diff}</span>;
    return <span className="text-red-500 ml-2 text-xs">▼{Math.abs(diff)}</span>;
  };

  const getDiffDisplay = (diff: number | undefined) => {
    if (diff === undefined) return null;
    const colorClass = diff > 0 ? 'text-green-500' : diff < 0 ? 'text-red-500' : 'text-gray-500';
    const sign = diff > 0 ? '+' : '';
    return <span className={`${colorClass} text-sm ml-2`}>({sign}{diff}%)</span>;
  };

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
                {results.stats.topTracks?.map((t: TrackStat, i: number) => (
                  <li key={i} className="text-sm">
                    <span className="font-medium">{t.Title || 'Unknown Track'}</span>
                    <span className="text-muted-foreground"> by {t.Artist || 'Unknown Artist'}</span>
                    {getRankChange(t, i + 1, results.comparison?.stats.topTracks || [], 'Title')}
                    <div className="text-xs text-muted-foreground ml-4">{t.count} plays</div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="stat-card bg-card text-card-foreground rounded-lg border shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">Top Artists</h3>
              <ol className="list-decimal list-inside space-y-2">
                {results.stats.topArtists?.map((a: ArtistStat, i: number) => (
                  <li key={i} className="text-sm">
                    <span className="font-medium">{a.Name || 'Unknown Artist'}</span>
                    {getRankChange(a, i + 1, results.comparison?.stats.topArtists || [], 'Name')}
                    <div className="text-xs text-muted-foreground ml-4">{a.count} plays</div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="stat-card bg-card text-card-foreground rounded-lg border shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">Top Genres</h3>
              <ol className="list-decimal list-inside space-y-2">
                {results.stats.topGenres?.map((g: GenreStat, i: number) => (
                  <li key={i} className="text-sm">
                    <span className="font-medium">{g.Name || 'Unknown Genre'}</span>
                    {getRankChange(g, i + 1, results.comparison?.stats.topGenres || [], 'Name')}
                    <div className="text-xs text-muted-foreground ml-4">{g.count} plays</div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="stat-card bg-card text-card-foreground rounded-lg border shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">Top BPMs</h3>
              <ol className="list-decimal list-inside space-y-2">
                {results.stats.topBPMs?.map((b: BPMStat, i: number) => (
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
                <h4 className="text-sm font-medium text-muted-foreground">Total Tracks Played</h4>
                <p className="text-2xl font-bold">
                  {results.stats.totalTracks}
                  {getDiffDisplay(results.comparison?.diffs.tracksPercentage)}
                </p>
              </div>
              <div className="highlight-item p-4 bg-muted rounded-md">
                <h4 className="text-sm font-medium text-muted-foreground">Total Playtime</h4>
                <p className="text-2xl font-bold">
                  {Math.round(results.stats.totalPlaytimeSeconds / 3600)} hrs
                  {getDiffDisplay(results.comparison?.diffs.playtimePercentage)}
                </p>
              </div>
              <div className="highlight-item p-4 bg-muted rounded-md">
                <h4 className="text-sm font-medium text-muted-foreground">Longest Session (Songs)</h4>
                <p className="text-2xl font-bold">
                  {results.stats.longestSession.count} songs
                  {getDiffDisplay(results.comparison?.diffs.sessionPercentage)}
                </p>
                <small className="text-xs text-muted-foreground">{results.stats.longestSession.date}</small>
              </div>
              <div className="highlight-item p-4 bg-muted rounded-md">
                <h4 className="text-sm font-medium text-muted-foreground">Busiest Month</h4>
                <p className="text-2xl font-bold">{results.stats.busiestMonth.count} songs</p>
                <small className="text-xs text-muted-foreground">{results.stats.busiestMonth.month}</small>
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
