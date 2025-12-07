import { StorySlide, AspectRatio } from './StorySlide'
import { GenreStat } from '@/shared/types'

export interface GenreSlideProps {
  genres: GenreStat[]
  aspectRatio?: AspectRatio
}

export function GenreSlide({ genres, aspectRatio = '9:16' }: GenreSlideProps) {
  // Calculate percentages
  const total = genres.reduce((sum, genre) => sum + Number(genre.count), 0)
  const genresWithPercentages = genres.map((genre) => ({
    ...genre,
    percentage: total > 0 ? (Number(genre.count) / total) * 100 : 0,
  }))

  // Take top 5 genres
  const displayGenres = genresWithPercentages.slice(0, 5)
  const legendGenres = aspectRatio === '1:1' || aspectRatio === '4:5' ? displayGenres.slice(0, 3) : displayGenres

  // Build conic gradient for pie chart
  const chartColors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']
  const gradientStops = displayGenres.reduce<{ stops: string[]; accumulated: number }>(
    (acc, genre, index) => {
      const start = acc.accumulated
      const end = acc.accumulated + genre.percentage
      acc.stops.push(`${chartColors[index]} ${start}% ${end}%`)
      acc.accumulated = end
      return acc
    },
    { stops: [], accumulated: 0 }
  ).stops
  const conicGradient = `conic-gradient(${gradientStops.join(', ')})`

  return (
    <StorySlide aspectRatio={aspectRatio}>
      <div className="bg-gradient-to-br from-theme-bgStart to-theme-bgEnd flex flex-col p-8 text-theme-text relative slide-p-square h-full">
        <div className="absolute top-8 left-8 text-sm font-bold opacity-50 slide-mt-square-sm slide-tag">
          #TOPGENRES
        </div>
        <h2 className="text-4xl font-black mt-12 mb-4 leading-none slide-text-square-sm slide-mt-square-sm">
          THE
          <br />
          VIBE
          <br />
          CHECK
        </h2>

        <div className="flex-1 flex flex-col items-center justify-center flex-row-square">
          {/* CSS Pie Chart */}
          <div
            className="w-48 h-48 rounded-full relative mb-8 slide-mt-square-sm slide-chart-square shrink-0"
            style={{ background: conicGradient }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full slide-chart-inner" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(4px)' }}></div>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full space-y-2 slide-gap-square">
            {legendGenres.map((genre, index) => (
              <div
                key={index}
                className={`flex items-center justify-between ${index >= 3 ? 'hide-on-square' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: chartColors[index] }}
                  ></div>
                  <span className="font-bold">{genre.Name || 'Unknown'}</span>
                </div>
                <span className="font-mono font-bold">{Math.round(genre.percentage)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StorySlide>
  )
}
