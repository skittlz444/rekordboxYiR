import { useState } from 'react'
import './index.css'
import './App.css'
import { StatsResponse, TrackStat, ArtistStat, GenreStat, BPMStat } from '@/shared/types'

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [year, setYear] = useState<string>(new Date().getFullYear().toString())
  const [excludeUnknown, setExcludeUnknown] = useState<boolean>(false)
  const [status, setStatus] = useState<string>('')
  const [results, setResults] = useState<StatsResponse | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setStatus('Please select a file first')
      return
    }

    setStatus('Uploading and processing...')
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('year', year)
    formData.append('excludeUnknown', excludeUnknown.toString())

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      const data = await response.json()
      setResults(data)
      setStatus('Success!')
    } catch (error) {
      console.error('Upload failed:', error)
      setStatus('Upload failed. See console for details.')
    }
  }

  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString())

  return (
    <div className="container">
      <h1>Rekordbox Year in Review</h1>
      
      <div className="upload-section">
        <p>Upload your <code>master.db</code> file to see your stats.</p>
        <div className="controls">
          <label>
            Select Year: 
            <select value={year} onChange={(e) => setYear(e.target.value)} style={{ marginLeft: '10px', marginRight: '20px' }}>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </label>
          <label style={{ marginRight: '20px' }}>
            <input 
              type="checkbox" 
              checked={excludeUnknown} 
              onChange={(e) => setExcludeUnknown(e.target.checked)} 
              style={{ marginRight: '5px' }}
            />
            Exclude Unknown/Empty
          </label>
          <input type="file" accept=".db" onChange={handleFileChange} />
          <button onClick={handleUpload} disabled={!file}>
            Get My Stats
          </button>
        </div>
      </div>

      {status && <p className="status">{status}</p>}

      {results && (
        <div className="results">
          <h2>Stats for {results.year}</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Top Tracks</h3>
              <ol>
                {results.topTracks?.map((t: TrackStat, i: number) => (
                  <li key={i}>
                    <strong>{t.Title || 'Unknown Track'}</strong> by {t.Artist || 'Unknown Artist'}
                    <br/>
                    <small>{t.count} plays</small>
                  </li>
                ))}
              </ol>
            </div>

            <div className="stat-card">
              <h3>Top Artists</h3>
              <ol>
                {results.topArtists?.map((a: ArtistStat, i: number) => (
                  <li key={i}>
                    <strong>{a.Name || 'Unknown Artist'}</strong>
                    <br/>
                    <small>{a.count} plays</small>
                  </li>
                ))}
              </ol>
            </div>

            <div className="stat-card">
              <h3>Top Genres</h3>
              <ol>
                {results.topGenres?.map((g: GenreStat, i: number) => (
                  <li key={i}>
                    <strong>{g.Name || 'Unknown Genre'}</strong>
                    <br/>
                    <small>{g.count} plays</small>
                  </li>
                ))}
              </ol>
            </div>

            <div className="stat-card">
              <h3>Top BPMs</h3>
              <ol>
                {results.topBPMs?.map((b: BPMStat, i: number) => (
                  <li key={i}>
                    <strong>{Math.round(b.BPM / 100)} BPM</strong>
                    <br/>
                    <small>{b.count} plays</small>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="summary-stats">
            <h3>Session Highlights</h3>
            <div className="highlights-grid">
              <div className="highlight-item">
                <h4>Most Songs in a Session</h4>
                <p>{results.mostSongsSession?.song_count || 0} songs</p>
                <small>{results.mostSongsSession?.DateCreated}</small>
              </div>
              <div className="highlight-item">
                <h4>Most Active Month (Songs)</h4>
                <p>{results.mostActiveMonthSongs?.song_count || 0} songs</p>
                <small>{results.mostActiveMonthSongs?.month}</small>
              </div>
              <div className="highlight-item">
                <h4>Most Active Month (Sessions)</h4>
                <p>{results.mostActiveMonthSessions?.session_count || 0} sessions</p>
                <small>{results.mostActiveMonthSessions?.month}</small>
              </div>
              <div className="highlight-item">
                <h4>Avg Session Length</h4>
                <p>{Math.round(results.avgSessionLength || 0)} songs</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
