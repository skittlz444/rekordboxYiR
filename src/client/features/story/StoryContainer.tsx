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
import { StatsResponse } from '@/shared/types'
import { transformStatsToStoryData } from './utils/storyDataTransform'

interface StoryContainerProps {
  data: StatsResponse
}

export function StoryContainer({ data }: StoryContainerProps) {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16')
  const [theme, setTheme] = useState<string>('theme-pastel')

  const { stats, year, comparison } = data

  // Use shared utility to transform data
  const { summaryData, comparisonMetrics, trends } = transformStatsToStoryData(data)

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
