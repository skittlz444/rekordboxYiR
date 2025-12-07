import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  OpenerSlide,
  ArtistSlide,
  TrackSlide,
  GenreSlide,
  BusiestDaySlide,
  LibraryGrowthSlide,
  YearComparisonSlide,
  YearComparisonTrendsSlide,
  SummarySlide,
  AspectRatio,
} from '../story/components'
import { StatsResponse } from '@/shared/types'
import { Button } from '@/client/components/ui/button'
import { transformStatsToStoryData } from './utils/storyDataTransform'

interface StoryModeOverlayProps {
  data: StatsResponse
  onClose: () => void
}

export function StoryModeOverlay({ data, onClose }: StoryModeOverlayProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16')
  const [theme, setTheme] = useState<string>('theme-pastel')

  const { stats, year, comparison } = data

  // Use shared utility to transform data
  const { summaryData, comparisonMetrics, trends } = transformStatsToStoryData(data)

  // Build slides array
  const slides = [
    <OpenerSlide key="opener" year={year} aspectRatio={aspectRatio} />,
    <ArtistSlide key="artist" artists={stats.topArtists} aspectRatio={aspectRatio} />,
    <TrackSlide key="track" tracks={stats.topTracks} aspectRatio={aspectRatio} />,
    <GenreSlide key="genre" genres={stats.topGenres} aspectRatio={aspectRatio} />,
    <BusiestDaySlide 
      key="busiest" 
      busiestMonth={stats.busiestMonth} 
      longestSession={stats.longestSession} 
      aspectRatio={aspectRatio} 
    />,
    <LibraryGrowthSlide 
      key="library" 
      newTracks={stats.libraryGrowth?.added || 0} 
      totalLibrarySize={stats.libraryGrowth?.total || 0} 
      aspectRatio={aspectRatio} 
    />,
  ]

  // Add comparison slides if available
  if (comparison && comparisonMetrics.length > 0) {
    slides.push(
      <YearComparisonSlide 
        key="comparison"
        comparisonYear={comparison.year}
        metrics={comparisonMetrics}
        aspectRatio={aspectRatio}
      />
    )
  }

  if (comparison && (trends.biggestObsession || trends.rankClimber || trends.newFavorite)) {
    slides.push(
      <YearComparisonTrendsSlide 
        key="trends"
        trends={trends}
        aspectRatio={aspectRatio}
      />
    )
  }

  slides.push(
    <SummarySlide key="summary" data={summaryData} aspectRatio={aspectRatio} />
  )

  const goToNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      onClose()
    }
  }

  const goToPrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      goToNextSlide()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goToPrevSlide()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div 
      className={`fixed inset-0 bg-black z-50 flex flex-col ${theme}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="dialog"
      aria-label="Story Mode"
      aria-modal="true"
      data-ratio={aspectRatio}
    >
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex gap-2">
          {/* Aspect Ratio Switcher */}
          <div className="bg-white/10 backdrop-blur p-1 rounded-lg flex gap-1">
            <button
              onClick={() => setAspectRatio('9:16')}
              aria-label="Set aspect ratio to 9:16"
              className={`px-3 py-1 rounded text-xs font-bold transition ${
                aspectRatio === '9:16'
                  ? 'bg-white text-black'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              9:16
            </button>
            <button
              onClick={() => setAspectRatio('4:5')}
              aria-label="Set aspect ratio to 4:5"
              className={`px-3 py-1 rounded text-xs font-bold transition ${
                aspectRatio === '4:5'
                  ? 'bg-white text-black'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              4:5
            </button>
            <button
              onClick={() => setAspectRatio('1:1')}
              aria-label="Set aspect ratio to 1:1"
              className={`px-3 py-1 rounded text-xs font-bold transition ${
                aspectRatio === '1:1'
                  ? 'bg-white text-black'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              1:1
            </button>
          </div>

          {/* Theme Switcher */}
          <div className="bg-white/10 backdrop-blur p-1 rounded-lg flex gap-1">
            <button
              onClick={() => setTheme('theme-pastel')}
              aria-label="Set theme to Pastel"
              className={`px-3 py-1 rounded text-xs font-bold transition ${
                theme === 'theme-pastel'
                  ? 'bg-gradient-to-r from-[#F0F9FF] to-[#ECFCCB] text-slate-800'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Pastel
            </button>
            <button
              onClick={() => setTheme('theme-club')}
              aria-label="Set theme to Club"
              className={`px-3 py-1 rounded text-xs font-bold transition ${
                theme === 'theme-club'
                  ? 'bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Club
            </button>
            <button
              onClick={() => setTheme('theme-clean')}
              aria-label="Set theme to Clean"
              className={`px-3 py-1 rounded text-xs font-bold transition ${
                theme === 'theme-clean'
                  ? 'bg-gray-100 text-gray-800'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Clean
            </button>
            <button
              onClick={() => setTheme('theme-dark')}
              aria-label="Set theme to Dark"
              className={`px-3 py-1 rounded text-xs font-bold transition ${
                theme === 'theme-dark'
                  ? 'bg-slate-900 text-white'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/20"
          aria-label="Close story mode"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center overflow-hidden p-4">
        {slides[currentSlide]}
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-gradient-to-t from-black/50 to-transparent">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevSlide}
          disabled={currentSlide === 0}
          className="text-white hover:bg-white/20 disabled:opacity-30"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>

        <div className="text-white text-sm font-medium">
          {currentSlide + 1} / {slides.length}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextSlide}
          className="text-white hover:bg-white/20"
          aria-label="Next slide"
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      </div>

      {/* Click areas for mobile navigation */}
      <div className="absolute inset-0 flex pointer-events-none">
        <div 
          className={`flex-1 pointer-events-auto ${currentSlide === 0 ? 'cursor-default' : 'cursor-pointer'}`}
          onClick={currentSlide > 0 ? goToPrevSlide : undefined}
          style={{ opacity: 0 }}
        />
        <div 
          className="flex-1 pointer-events-auto cursor-pointer"
          onClick={goToNextSlide}
          style={{ opacity: 0 }}
        />
      </div>
    </div>
  )
}
