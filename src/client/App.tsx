import { useState } from 'react'
import './index.css'
import './App.css'
import { StatsResponse } from '@/shared/types'
import { UploadContainer } from './features/upload/UploadContainer'
import { StoryDemo } from './features/story/StoryDemo'
import { StoryContainer } from './features/story/StoryContainer'
import { Dashboard } from './features/dashboard'
import { StoryModeOverlay } from './features/story/StoryModeOverlay'
import { Toaster } from './components/ui/toaster'

function App() {
  const [results, setResults] = useState<StatsResponse | null>(null)
  const [showStoryDemo, setShowStoryDemo] = useState<boolean>(false)
  const [showStoryMode, setShowStoryMode] = useState<boolean>(false)
  const [hasSeenStory, setHasSeenStory] = useState<boolean>(false)
  const [showAllSlides, setShowAllSlides] = useState<boolean>(false)

  // Handler for when upload succeeds - automatically show story
  const handleUploadSuccess = (data: StatsResponse) => {
    setResults(data)
    setShowStoryMode(true)
    setHasSeenStory(false)
  }

  // Handler for when story mode closes - mark as seen
  const handleStoryModeClose = () => {
    setShowStoryMode(false)
    setHasSeenStory(true)
  }

  return (
    <>
      <div className="container mx-auto min-h-screen bg-background text-foreground">
        <h1 className="text-4xl font-bold text-center py-8">Rekordbox Year in Review</h1>
      
      {/* Story Demo Link - Only visible in upload view */}
      {!results && (
        <div className="text-center mb-4">
          <button
            onClick={() => setShowStoryDemo(!showStoryDemo)}
            className="text-primary hover:underline text-sm"
          >
            {showStoryDemo ? 'Back to Upload' : 'View Story Slide Demo →'}
          </button>
        </div>
      )}

      {showStoryDemo ? (
        <StoryDemo />
      ) : !results ? (
        <UploadContainer onUploadSuccess={handleUploadSuccess} />
      ) : (
        <>
          {/* Show dashboard only after story has been seen */}
          {hasSeenStory && !showAllSlides && (
            <Dashboard 
              data={results} 
              onPlayStory={() => setShowStoryMode(true)}
              onViewAllSlides={() => setShowAllSlides(true)}
            />
          )}
          
          {/* Show all slides view */}
          {showAllSlides && (
            <div className="relative">
              <div className="sticky top-4 z-50 text-center mb-4">
                <button
                  onClick={() => setShowAllSlides(false)}
                  className="bg-white/90 backdrop-blur px-6 py-2 rounded-lg shadow-lg font-bold hover:bg-white transition"
                >
                  ← Back to Dashboard
                </button>
              </div>
              <StoryContainer data={results} />
            </div>
          )}
          
          {/* Story Mode Overlay */}
          {showStoryMode && (
            <StoryModeOverlay 
              data={results} 
              onClose={handleStoryModeClose} 
            />
          )}
        </>
      )}
      </div>
      <Toaster />
    </>
  )
}

export default App
