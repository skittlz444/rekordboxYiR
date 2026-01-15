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
  Theme,
  DownloadableSlideWrapper,
} from './components'
import { ArtistStat, TrackStat, GenreStat } from '@/shared/types'


// Mock data
const mockArtists: ArtistStat[] = [
  { Name: 'Fred again..', count: 142 },
  { Name: 'Skrillex', count: 98 },
  { Name: 'Four Tet', count: 85 },
  { Name: 'Overmono', count: 72 },
  { Name: 'Bicep', count: 64 },
]

const mockTracks: TrackStat[] = [
  { Title: 'Rumble', Artist: 'Skrillex, Fred again..', count: 84 },
  { Title: 'Baby again..', Artist: 'Fred again.., Skrillex, Four Tet', count: 62 },
  { Title: 'Leavemealone', Artist: 'Fred again.., Baby Keem', count: 58 },
  { Title: 'Strong', Artist: 'Romy, Fred again..', count: 45 },
  { Title: 'Miracle Maker', Artist: 'Dom Dolla', count: 42 },
]

const mockGenres: GenreStat[] = [
  { Name: 'House', count: 350 },
  { Name: 'Techno', count: 250 },
  { Name: 'Garage', count: 200 },
  { Name: 'Drum & Bass', count: 100 },
  { Name: 'Other', count: 100 },
]

import { useConfigStore } from '@/client/lib/store'

export function StoryDemo() {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16')
  const [theme, setTheme] = useState<Theme>('theme-pastel')

  const djName = useConfigStore((state) => state.djName)
  const logo = useConfigStore((state) => state.logo)

  return (
    <div className={`min-h-screen bg-gray-100 p-8 ${theme}`} data-ratio={aspectRatio}>
      <h1 className="text-3xl font-bold mb-8 text-center text-slate-800">
        Story Slide Components Demo
      </h1>

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
              ? 'bg-gradient-to-r from-[#2E0249] to-[#000000] text-white border-2 border-pink-500'
              : 'bg-gradient-to-r from-[#2E0249] to-[#000000] text-white hover:border-pink-500 border border-transparent'
              }`}
          >
            Club
          </button>
          <button
            onClick={() => setTheme('theme-clean')}
            className={`px-4 py-2 rounded-lg font-bold transition text-sm ${theme === 'theme-clean'
              ? 'bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6] text-slate-800 border-2 border-slate-800'
              : 'bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6] text-slate-800 border border-slate-200 hover:border-slate-800'
              }`}
          >
            Clean
          </button>
          <button
            onClick={() => setTheme('theme-dark')}
            className={`px-4 py-2 rounded-lg font-bold transition text-sm ${theme === 'theme-dark'
              ? 'bg-gradient-to-r from-[#000000] to-[#1a1a1a] text-white border-2 border-red-500'
              : 'bg-gradient-to-r from-[#000000] to-[#1a1a1a] text-white hover:border-red-500 border border-transparent'
              }`}
          >
            Dark
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        <DownloadableSlideWrapper filename="opener.png">
          <OpenerSlide year="2025" djName={djName || 'DJ SKITTLZ'} logo={logo || undefined} aspectRatio={aspectRatio} theme={theme} />
        </DownloadableSlideWrapper>

        <DownloadableSlideWrapper filename="artists.png">
          <ArtistSlide artists={mockArtists} aspectRatio={aspectRatio} theme={theme} />
        </DownloadableSlideWrapper>

        <DownloadableSlideWrapper filename="tracks.png">
          <TrackSlide tracks={mockTracks} aspectRatio={aspectRatio} theme={theme} />
        </DownloadableSlideWrapper>

        <DownloadableSlideWrapper filename="genres.png">
          <GenreSlide genres={mockGenres} aspectRatio={aspectRatio} theme={theme} />
        </DownloadableSlideWrapper>

        <DownloadableSlideWrapper filename="busiest.png">
          <BusiestDaySlide
            busiestMonth={{ month: '2023-07', count: 342 }}
            longestSession={{ date: '2023-10-14', durationSeconds: 22320 }}
            aspectRatio={aspectRatio}
            theme={theme}
          />
        </DownloadableSlideWrapper>

        <DownloadableSlideWrapper filename="library.png">
          <LibraryGrowthSlide
            newTracks={420}
            totalLibrarySize={12450}
            aspectRatio={aspectRatio}
            theme={theme}
          />
        </DownloadableSlideWrapper>

        <DownloadableSlideWrapper filename="comparison.png">
          <YearComparisonSlide
            comparisonYear="2024"
            metrics={[
              {
                label: 'TOTAL PLAYS',
                current: '2,451',
                previous: '2,180',
                change: '+12%',
                changePercentage: 12,
              },
              {
                label: 'PLAYTIME',
                current: '172h',
                previous: '150h',
                change: '+15%',
                changePercentage: 15,
              },
              {
                label: 'LONGEST SET',
                current: '6h 12m',
                previous: '4h 05m',
                change: '+2h',
                changePercentage: 50,
              },
            ]}
            aspectRatio={aspectRatio}
            theme={theme}
          />
        </DownloadableSlideWrapper>

        <DownloadableSlideWrapper filename="trends.png">
          <YearComparisonTrendsSlide
            trends={{
              biggestObsession: {
                name: 'Peggy Gou',
                percentageIncrease: 450,
              },
              rankClimber: {
                name: 'Disclosure',
                previousRank: 12,
                currentRank: 3,
              },
              newFavorite: {
                name: 'Sammy Virji',
                currentRank: 10,
                type: 'Artist',
              },
            }}
            aspectRatio={aspectRatio}
            theme={theme}
          />
        </DownloadableSlideWrapper>

        <DownloadableSlideWrapper filename="summary.png">
          <SummarySlide
            data={{
              year: '2025',
              topArtist: 'Fred again..',
              topGenre: 'House',
              topTrack: {
                title: 'Rumble',
                artist: 'Skrillex, Fred again..',
              },
              totalPlays: 2451,
              setsPlayed: 42,
              busiestMonth: '2025-07',
              djName: djName || 'DJ SKITTLZ',
              logo: logo || undefined,
            }}
            aspectRatio={aspectRatio}
            theme={theme}
          />
        </DownloadableSlideWrapper>
      </div>
    </div>
  )
}
