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
import { ComparisonMetric } from '../story/components/YearComparisonSlide'
import { TrendData } from '../story/components/YearComparisonTrendsSlide'
import { StatsResponse } from '@/shared/types'
import { Button } from '@/client/components/ui/button'

interface StoryModeOverlayProps {
  data: StatsResponse
  onClose: () => void
}

export function StoryModeOverlay({ data, onClose }: StoryModeOverlayProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16')
  const [theme, setTheme] = useState<string>('theme-pastel')

  const { stats, year, comparison } = data

  // Construct summary data
  const summaryData = {
    year,
    topArtist: stats.topArtists[0]?.Name || 'Unknown',
    topGenre: stats.topGenres[0]?.Name || 'Unknown',
    topTrack: {
      title: stats.topTracks[0]?.Title || 'Unknown',
      artist: stats.topTracks[0]?.Artist || 'Unknown',
    },
    totalPlays: stats.totalTracks || 0,
    setsPlayed: stats.totalSessions || 0,
    busiestMonth: stats.busiestMonth.month,
    djName: 'DJ', // We don't have this in the upload yet
  }

  // Construct comparison metrics
  const comparisonMetrics: ComparisonMetric[] = []
  if (comparison) {
    if (comparison.diffs.tracksPercentage > 0) {
      comparisonMetrics.push({
        label: 'TOTAL PLAYS',
        current: stats.totalTracks,
        previous: comparison.stats.totalTracks,
        change: `+${comparison.diffs.tracksPercentage}%`,
        changePercentage: comparison.diffs.tracksPercentage
      })
    }
    if (comparison.diffs.playtimePercentage > 0) {
      comparisonMetrics.push({
        label: 'PLAYTIME',
        current: `${Math.round(stats.totalPlaytimeSeconds / 3600)}h`,
        previous: `${Math.round(comparison.stats.totalPlaytimeSeconds / 3600)}h`,
        change: `+${comparison.diffs.playtimePercentage}%`,
        changePercentage: comparison.diffs.playtimePercentage
      })
    }
    if (comparison.diffs.sessionPercentage > 0) {
      comparisonMetrics.push({
        label: 'LONGEST SESSION',
        current: stats.longestSession.count,
        previous: comparison.stats.longestSession.count,
        change: `+${comparison.diffs.sessionPercentage}%`,
        changePercentage: comparison.diffs.sessionPercentage
      })
    }
    if (comparison.diffs.totalSessionsPercentage > 0) {
      comparisonMetrics.push({
        label: 'SETS PLAYED',
        current: stats.totalSessions,
        previous: comparison.stats.totalSessions,
        change: `+${comparison.diffs.totalSessionsPercentage}%`,
        changePercentage: comparison.diffs.totalSessionsPercentage
      })
    }
  }

  // Calculate Trends
  const trends: TrendData = {}
  
  if (comparison) {
    // Helper to find item in list
    const findItem = <T, K extends keyof T>(list: T[], value: T[K], key: K) => list.find(i => i[key] === value)
    
    // 1. New Favorite (Highest ranked item in current that didn't exist or had 0 plays in previous)
    // Check Artists
    let newFavoriteArtist = null
    for (let i = 0; i < stats.topArtists.length; i++) {
      const artist = stats.topArtists[i]
      const prevArtist = findItem(comparison.stats.topArtists, artist.Name, 'Name')
      if (!prevArtist || prevArtist.count === 0) {
        newFavoriteArtist = { name: artist.Name, currentRank: i + 1, type: 'Artist' as const }
        break // Found the highest ranked one
      }
    }
    
    // Check Genres
    let newFavoriteGenre = null
    for (let i = 0; i < stats.topGenres.length; i++) {
      const genre = stats.topGenres[i]
      const prevGenre = findItem(comparison.stats.topGenres, genre.Name, 'Name')
      if (!prevGenre || prevGenre.count === 0) {
        newFavoriteGenre = { name: genre.Name, currentRank: i + 1, type: 'Genre' as const }
        break 
      }
    }
    
    if (newFavoriteArtist) {
        trends.newFavorite = newFavoriteArtist
    } else if (newFavoriteGenre) {
        trends.newFavorite = newFavoriteGenre
    }

    // 2. Biggest Obsession (Highest % increase)
    // Only consider increases above 1% to avoid noise from rounding or small changes
    const MIN_OBSESSION_INCREASE = 1
    let maxIncrease = 0 // Start at 0; will only set if increase >= MIN_OBSESSION_INCREASE
    let obsession = null
    
    // Check Artists
    stats.topArtists.forEach(artist => {
        const prev = findItem(comparison.stats.topArtists, artist.Name, 'Name')
        if (prev && prev.count > 0) {
            const increase = ((artist.count - prev.count) / prev.count) * 100
            if (increase >= MIN_OBSESSION_INCREASE && increase > maxIncrease) {
                maxIncrease = increase
                obsession = { name: artist.Name, percentageIncrease: Math.round(increase) }
            }
        }
    })

    // Check Genres
    stats.topGenres.forEach(genre => {
        const prev = findItem(comparison.stats.topGenres, genre.Name, 'Name')
        if (prev && prev.count > 0) {
            const increase = ((genre.count - prev.count) / prev.count) * 100
            if (increase >= MIN_OBSESSION_INCREASE && increase > maxIncrease) {
                maxIncrease = increase
                obsession = { name: genre.Name, percentageIncrease: Math.round(increase) }
            }
        }
    })
    
    if (obsession) trends.biggestObsession = obsession

    // 3. Rank Climber (Biggest rank jump)
    let maxClimb = 0
    let climber = null
    
    stats.topArtists.forEach((artist, index) => {
        const currentRank = index + 1
        const prevIndex = comparison.stats.topArtists.findIndex(a => a.Name === artist.Name)
        if (prevIndex !== -1) {
            const prevRank = prevIndex + 1
            const climb = prevRank - currentRank
            if (climb > maxClimb) {
                maxClimb = climb
                climber = { name: artist.Name, previousRank: prevRank, currentRank: currentRank }
            }
        }
    })

    // Check Genres for Rank Climber
    stats.topGenres.forEach((genre, index) => {
        const currentRank = index + 1
        const prevIndex = comparison.stats.topGenres.findIndex(g => g.Name === genre.Name)
        if (prevIndex !== -1) {
            const prevRank = prevIndex + 1
            const climb = prevRank - currentRank
            if (climb > maxClimb) {
                maxClimb = climb
                climber = { name: genre.Name, previousRank: prevRank, currentRank: currentRank }
            }
        }
    })
    
    if (climber) trends.rankClimber = climber
  }

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
      goToNextSlide()
    } else if (e.key === 'ArrowLeft') {
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
      data-ratio={aspectRatio}
    >
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex gap-2">
          {/* Aspect Ratio Switcher */}
          <div className="bg-white/10 backdrop-blur p-1 rounded-lg flex gap-1">
            <button
              onClick={() => setAspectRatio('9:16')}
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
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      </div>

      {/* Click areas for mobile navigation */}
      <div className="absolute inset-0 flex pointer-events-none">
        <div 
          className="flex-1 pointer-events-auto cursor-pointer"
          onClick={goToPrevSlide}
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
