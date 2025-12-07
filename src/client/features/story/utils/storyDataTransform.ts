import { StatsResponse } from '@/shared/types'
import { ComparisonMetric } from '../components/YearComparisonSlide'
import { TrendData } from '../components/YearComparisonTrendsSlide'

export interface SummaryData {
  year: string
  topArtist: string
  topGenre: string
  topTrack: {
    title: string
    artist: string
  }
  totalPlays: number
  setsPlayed: number
  busiestMonth: string
  djName: string
}

export interface StoryData {
  summaryData: SummaryData
  comparisonMetrics: ComparisonMetric[]
  trends: TrendData
}

/**
 * Transforms StatsResponse into StoryData format for slide components
 * @param data - The stats response from the API
 * @returns Object containing summary data, comparison metrics, and trends
 */
export function transformStatsToStoryData(data: StatsResponse): StoryData {
  const { stats, year, comparison } = data

  // Construct summary data
  const summaryData: SummaryData = {
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

  return {
    summaryData,
    comparisonMetrics,
    trends
  }
}
