import { useState } from 'react'
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
} from './components'
import { ComparisonMetric } from './components/YearComparisonSlide'
import { TrendData } from './components/YearComparisonTrendsSlide'
import { StatsResponse } from '@/shared/types'

interface StoryContainerProps {
  data: StatsResponse
}

export function StoryContainer({ data }: StoryContainerProps) {
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
    let maxIncrease = MIN_OBSESSION_INCREASE - 1
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

  return (
    <div className={`min-h-screen bg-gray-100 p-8 ${theme}`} data-ratio={aspectRatio}>
      <div className="flex flex-col items-center gap-4 mb-8 sticky top-4 z-50">
        {/* Aspect Ratio Switcher */}
        <div className="bg-white/80 backdrop-blur p-2 rounded-xl shadow-lg flex gap-2">
          <button
            onClick={() => setAspectRatio('9:16')}
            className={`px-4 py-2 rounded-lg font-bold transition text-sm ${
              aspectRatio === '9:16'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
            }`}
          >
            9:16 (Story)
          </button>
          <button
            onClick={() => setAspectRatio('4:5')}
            className={`px-4 py-2 rounded-lg font-bold transition text-sm ${
              aspectRatio === '4:5'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
            }`}
          >
            4:5 (Portrait)
          </button>
          <button
            onClick={() => setAspectRatio('1:1')}
            className={`px-4 py-2 rounded-lg font-bold transition text-sm ${
              aspectRatio === '1:1'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
            }`}
          >
            1:1 (Square)
          </button>
        </div>

        {/* Theme Switcher */}
        <div className="bg-white/80 backdrop-blur p-2 rounded-xl shadow-lg flex gap-2">
          <button
            onClick={() => setTheme('theme-pastel')}
            className={`px-4 py-2 rounded-lg font-bold transition text-sm ${
              theme === 'theme-pastel'
                ? 'bg-gradient-to-r from-[#F0F9FF] to-[#ECFCCB] text-slate-800 border-2 border-slate-400'
                : 'bg-gradient-to-r from-[#F0F9FF] to-[#ECFCCB] text-slate-800 border border-slate-200 hover:border-slate-400'
            }`}
          >
            Pastel
          </button>
          <button
            onClick={() => setTheme('theme-club')}
            className={`px-4 py-2 rounded-lg font-bold transition text-sm ${
              theme === 'theme-club'
                ? 'bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white border-2 border-slate-400'
                : 'bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white border border-slate-200 hover:border-slate-400'
            }`}
          >
            Club
          </button>
          <button
            onClick={() => setTheme('theme-clean')}
            className={`px-4 py-2 rounded-lg font-bold transition text-sm ${
              theme === 'theme-clean'
                ? 'bg-gray-100 text-gray-800 border-2 border-slate-400'
                : 'bg-gray-100 text-gray-800 border border-slate-200 hover:border-slate-400'
            }`}
          >
            Clean
          </button>
          <button
            onClick={() => setTheme('theme-dark')}
            className={`px-4 py-2 rounded-lg font-bold transition text-sm ${
              theme === 'theme-dark'
                ? 'bg-slate-900 text-white border-2 border-slate-400'
                : 'bg-slate-900 text-white border border-slate-200 hover:border-slate-400'
            }`}
          >
            Dark
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-8 pb-20">
        <OpenerSlide year={year} aspectRatio={aspectRatio} />
        
        <ArtistSlide artists={stats.topArtists} aspectRatio={aspectRatio} />
        
        <TrackSlide tracks={stats.topTracks} aspectRatio={aspectRatio} />
        
        <GenreSlide genres={stats.topGenres} aspectRatio={aspectRatio} />
        
        <BusiestDaySlide 
          busiestMonth={stats.busiestMonth} 
          longestSession={stats.longestSession} 
          aspectRatio={aspectRatio} 
        />
        
        <LibraryGrowthSlide 
          newTracks={stats.libraryGrowth?.added || 0} 
          totalLibrarySize={stats.libraryGrowth?.total || 0} 
          aspectRatio={aspectRatio} 
        />

        {comparison && (
          <>
            {comparisonMetrics.length > 0 && (
              <YearComparisonSlide 
                comparisonYear={comparison.year}
                metrics={comparisonMetrics}
                aspectRatio={aspectRatio}
              />
            )}
            {(trends.biggestObsession || trends.rankClimber || trends.newFavorite) && (
              <YearComparisonTrendsSlide 
                trends={trends}
                aspectRatio={aspectRatio}
              />
            )}
          </>
        )}

        <SummarySlide data={summaryData} aspectRatio={aspectRatio} />
      </div>
    </div>
  )
}
