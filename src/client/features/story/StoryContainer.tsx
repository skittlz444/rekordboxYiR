import { useState, useRef } from 'react'
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
  DownloadableSlideWrapper,
} from './components'
import { BulkDownloadButton } from './components/BulkDownloadButton'
import { StatsResponse } from '@/shared/types'
import { transformStatsToStoryData } from './utils/storyDataTransform'
import { Button } from '@/client/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/client/components/ui/dialog'
import { SettingsPanel } from '@/client/components/SettingsPanel'
import { Settings } from 'lucide-react'
import { useConfigStore } from '@/client/lib/store'
import { applyPlaytimePercentage } from '@/client/lib/playtimeUtils'
import { useBulkDownload, type Theme } from './hooks/useBulkDownload'

interface StoryContainerProps {
  data: StatsResponse
}

export function StoryContainer({ data }: StoryContainerProps) {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16')
  const [theme, setTheme] = useState<Theme>('theme-pastel')

  const { stats, year, comparison } = data

  // Get configuration from store
  const djName = useConfigStore((state) => state.djName)
  const logo = useConfigStore((state) => state.logo)
  const disableGenresInTrends = useConfigStore((state) => state.disableGenresInTrends)
  const averageTrackPlayedPercent = useConfigStore((state) => state.averageTrackPlayedPercent)

  // Use shared utility to transform data
  const { summaryData, comparisonMetrics, trends } = transformStatsToStoryData(data, djName, disableGenresInTrends, averageTrackPlayedPercent, logo)

  // Adjust playtime for longest session
  const adjustedLongestSession = {
    ...stats.longestSession,
    durationSeconds: stats.longestSession.durationSeconds
      ? applyPlaytimePercentage(stats.longestSession.durationSeconds, averageTrackPlayedPercent)
      : undefined
  }

  // Refs for all slides
  const openerRef = useRef<HTMLDivElement>(null)
  const artistsRef = useRef<HTMLDivElement>(null)
  const tracksRef = useRef<HTMLDivElement>(null)
  const genresRef = useRef<HTMLDivElement>(null)
  const busiestRef = useRef<HTMLDivElement>(null)
  const libraryRef = useRef<HTMLDivElement>(null)
  const comparisonRef = useRef<HTMLDivElement>(null)
  const trendsRef = useRef<HTMLDivElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)

  // Bulk download hook
  const { bulkDownload } = useBulkDownload()

  const handleBulkDownload = (options: { allSizes: boolean; allThemes: boolean }) => {
    const slideRefs = [
      { name: `opener-${year}`, ref: openerRef.current?.firstElementChild as HTMLElement | null },
      { name: `top-artists-${year}`, ref: artistsRef.current?.firstElementChild as HTMLElement | null },
      { name: `top-tracks-${year}`, ref: tracksRef.current?.firstElementChild as HTMLElement | null },
      { name: `top-genres-${year}`, ref: genresRef.current?.firstElementChild as HTMLElement | null },
      { name: `busiest-day-${year}`, ref: busiestRef.current?.firstElementChild as HTMLElement | null },
      { name: `library-growth-${year}`, ref: libraryRef.current?.firstElementChild as HTMLElement | null },
    ]

    // Add comparison slides if they exist
    if (comparison && comparisonMetrics.length > 0 && comparisonRef.current) {
      slideRefs.push({ name: `comparison-${year}`, ref: comparisonRef.current.firstElementChild as HTMLElement | null })
    }
    if (comparison && (trends.biggestObsession || trends.rankClimber || trends.newFavorite) && trendsRef.current) {
      slideRefs.push({ name: `trends-${year}`, ref: trendsRef.current.firstElementChild as HTMLElement | null })
    }

    // Always add summary
    slideRefs.push({ name: `summary-${year}`, ref: summaryRef.current?.firstElementChild as HTMLElement | null })

    bulkDownload(slideRefs, {
      allSizes: options.allSizes,
      allThemes: options.allThemes,
      currentSize: aspectRatio,
      currentTheme: theme,
    })
  }

  return (
    <div className={`min-h-screen bg-gray-100 p-8 ${theme}`} data-ratio={aspectRatio}>
      <div className="flex flex-col items-center gap-4 mb-8 sticky top-4 z-50">
        {/* Aspect Ratio Switcher */}
        <div className="bg-white/80 backdrop-blur p-2 rounded-xl shadow-lg flex gap-2">
          <button
            onClick={() => setAspectRatio('9:16')}
            className={`px-4 py-2 rounded-lg font-bold transition text-sm ${aspectRatio === '9:16'
              ? 'bg-slate-800 text-white'
              : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
              }`}
          >
            9:16 (Story)
          </button>
          <button
            onClick={() => setAspectRatio('4:5')}
            className={`px-4 py-2 rounded-lg font-bold transition text-sm ${aspectRatio === '4:5'
              ? 'bg-slate-800 text-white'
              : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
              }`}
          >
            4:5 (Portrait)
          </button>
          <button
            onClick={() => setAspectRatio('1:1')}
            className={`px-4 py-2 rounded-lg font-bold transition text-sm ${aspectRatio === '1:1'
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
            className={`px-4 py-2 rounded-lg font-bold transition text-sm ${theme === 'theme-pastel'
              ? 'bg-gradient-to-r from-[#F0F9FF] to-[#ECFCCB] text-slate-800 border-2 border-slate-400'
              : 'bg-gradient-to-r from-[#F0F9FF] to-[#ECFCCB] text-slate-800 border border-slate-200 hover:border-slate-400'
              }`}
          >
            Pastel
          </button>
          <button
            onClick={() => setTheme('theme-club')}
            className={`px-4 py-2 rounded-lg font-bold transition text-sm ${theme === 'theme-club'
              ? 'bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white border-2 border-slate-400'
              : 'bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white border border-slate-200 hover:border-slate-400'
              }`}
          >
            Club
          </button>
          <button
            onClick={() => setTheme('theme-clean')}
            className={`px-4 py-2 rounded-lg font-bold transition text-sm ${theme === 'theme-clean'
              ? 'bg-gray-100 text-gray-800 border-2 border-slate-400'
              : 'bg-gray-100 text-gray-800 border border-slate-200 hover:border-slate-400'
              }`}
          >
            Clean
          </button>
          <button
            onClick={() => setTheme('theme-dark')}
            className={`px-4 py-2 rounded-lg font-bold transition text-sm ${theme === 'theme-dark'
              ? 'bg-slate-900 text-white border-2 border-slate-400'
              : 'bg-slate-900 text-white border border-slate-200 hover:border-slate-400'
              }`}
          >
            Dark
          </button>
        </div>

        {/* Bulk Download Button */}
        <BulkDownloadButton onDownload={handleBulkDownload} />

        {/* Settings Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-white/80 backdrop-blur shadow-lg"
            >
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Configuration Settings</DialogTitle>
            </DialogHeader>
            <SettingsPanel />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap justify-center gap-8 pb-20">
        <DownloadableSlideWrapper ref={openerRef} filename={`opener-${year}.png`}>
          <OpenerSlide year={year} djName={djName || 'DJ'} logo={logo || undefined} aspectRatio={aspectRatio} />
        </DownloadableSlideWrapper>

        <DownloadableSlideWrapper ref={artistsRef} filename={`top-artists-${year}.png`}>
          <ArtistSlide artists={stats.topArtists} aspectRatio={aspectRatio} />
        </DownloadableSlideWrapper>

        <DownloadableSlideWrapper ref={tracksRef} filename={`top-tracks-${year}.png`}>
          <TrackSlide tracks={stats.topTracks} aspectRatio={aspectRatio} />
        </DownloadableSlideWrapper>

        <DownloadableSlideWrapper ref={genresRef} filename={`top-genres-${year}.png`}>
          <GenreSlide genres={stats.topGenres} aspectRatio={aspectRatio} />
        </DownloadableSlideWrapper>

        <DownloadableSlideWrapper ref={busiestRef} filename={`busiest-day-${year}.png`}>
          <BusiestDaySlide
            busiestMonth={stats.busiestMonth}
            longestSession={adjustedLongestSession}
            aspectRatio={aspectRatio}
          />
        </DownloadableSlideWrapper>

        <DownloadableSlideWrapper ref={libraryRef} filename={`library-growth-${year}.png`}>
          <LibraryGrowthSlide
            newTracks={stats.libraryGrowth?.added || 0}
            totalLibrarySize={stats.libraryGrowth?.total || 0}
            aspectRatio={aspectRatio}
          />
        </DownloadableSlideWrapper>

        {comparison && (
          <>
            {comparisonMetrics.length > 0 && (
              <DownloadableSlideWrapper ref={comparisonRef} filename={`comparison-${year}.png`}>
                <YearComparisonSlide
                  comparisonYear={comparison.year}
                  metrics={comparisonMetrics}
                  aspectRatio={aspectRatio}
                />
              </DownloadableSlideWrapper>
            )}
            {(trends.biggestObsession || trends.rankClimber || trends.newFavorite) && (
              <DownloadableSlideWrapper ref={trendsRef} filename={`trends-${year}.png`}>
                <YearComparisonTrendsSlide
                  trends={trends}
                  aspectRatio={aspectRatio}
                />
              </DownloadableSlideWrapper>
            )}
          </>
        )}

        <DownloadableSlideWrapper ref={summaryRef} filename={`summary-${year}.png`}>
          <SummarySlide data={summaryData} aspectRatio={aspectRatio} />
        </DownloadableSlideWrapper>
      </div>
    </div>
  )
}
