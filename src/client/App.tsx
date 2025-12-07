import { useState } from 'react'
import './index.css'
import './App.css'
import { StatsResponse } from '@/shared/types'
import { UploadContainer } from './features/upload/UploadContainer'
import { StoryDemo } from './features/story/StoryDemo'
import { Dashboard } from './features/dashboard'
import { StoryModeOverlay } from './features/story/StoryModeOverlay'

function App() {
  const [results, setResults] = useState<StatsResponse | null>(null)
  const [showStoryDemo, setShowStoryDemo] = useState<boolean>(false)
  const [showStoryMode, setShowStoryMode] = useState<boolean>(false)

  return (
    <div className="container mx-auto min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold text-center py-8">Rekordbox Year in Review</h1>
      
      {/* Story Demo Link */}
      <div className="text-center mb-4">
        <button
          onClick={() => setShowStoryDemo(!showStoryDemo)}
          className="text-primary hover:underline text-sm"
        >
          {showStoryDemo ? 'Back to Upload' : 'View Story Slide Demo →'}
        </button>
      </div>

      {showStoryDemo ? (
        <StoryDemo />
      ) : !results ? (
        <UploadContainer onUploadSuccess={setResults} />
      ) : (
        <>
          <Dashboard data={results} onPlayStory={() => setShowStoryMode(true)} />
          {showStoryMode && (
            <StoryModeOverlay 
              data={results} 
              onClose={() => setShowStoryMode(false)} 
            />
          )}
        </>
      )}
    </div>
  )
}

export default App
