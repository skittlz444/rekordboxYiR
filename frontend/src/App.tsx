import { useState } from 'react'
import './App.css'

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    setStats(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Upload failed')
      }

      const data = await response.json()
      setStats(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Rekordbox Year in Review</h1>
      <p>Upload your <code>master.db</code> file to see your stats.</p>
      
      <div className="upload-section">
        <input type="file" accept=".db" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!file || loading}>
          {loading ? 'Analyzing...' : 'Get Stats'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {stats && (
        <div className="stats-results">
          <div className="stat-card">
            <h2>Total Tracks</h2>
            <p className="big-number">{stats.totalTracks}</p>
          </div>

          <div className="stat-row">
            <div className="stat-list">
              <h3>Top Artists</h3>
              <ul>
                {stats.topArtists.map((artist: any, i: number) => (
                  <li key={i}>
                    <span className="name">{artist.Name}</span>
                    <span className="count">{artist.count}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="stat-list">
              <h3>Top Genres</h3>
              <ul>
                {stats.topGenres.map((genre: any, i: number) => (
                  <li key={i}>
                    <span className="name">{genre.Name}</span>
                    <span className="count">{genre.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
