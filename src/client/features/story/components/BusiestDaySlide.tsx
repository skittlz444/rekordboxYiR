import { StorySlide, AspectRatio } from './StorySlide'

export interface BusiestDaySlideProps {
  busiestMonth: {
    month: string
    count: number
  }
  longestSession: {
    date: string
    durationSeconds?: number
  }
  aspectRatio?: AspectRatio
}

function formatDuration(seconds?: number): string {
  if (!seconds) return 'N/A'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}

export function BusiestDaySlide({
  busiestMonth,
  longestSession,
  aspectRatio = '9:16',
}: BusiestDaySlideProps) {
  // Format YYYY-MM to month name (e.g., "2025-07" -> "July")
  const monthName = busiestMonth.month
    ? new Date(`${busiestMonth.month}-01`).toLocaleString('default', { month: 'long' })
    : 'N/A'

  // Format date to readable format (e.g., "2023-10-14" -> "Oct 14, 2023")
  const sessionDate = longestSession.date
    ? new Date(longestSession.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A'

  return (
    <StorySlide aspectRatio={aspectRatio}>
      <div className="bg-gradient-to-br from-theme-bgStart to-theme-bgEnd flex flex-col p-8 text-theme-text relative slide-p-square h-full">
        <div className="absolute top-8 left-8 text-sm font-bold opacity-50 slide-mt-square-sm slide-tag">
          #BUSIEST
        </div>
        <h2 className="text-4xl font-black mt-12 mb-8 leading-none slide-text-square-sm slide-mt-square-sm">
          WHEN YOU
          <br />
          WENT
          <br />
          HARD
        </h2>

        <div className="flex-1 flex flex-col justify-center gap-8 slide-gap-square">
          <div className="glass-panel p-6 rounded-2xl card-p-square">
            <div className="text-sm font-bold uppercase tracking-wider opacity-60 mb-2">
              Busiest Month
            </div>
            <div className="text-5xl font-black text-theme-accent2 text-huge-square">
              {monthName.toUpperCase()}
            </div>
            <div className="mt-2 font-mono text-sm">{busiestMonth.count} Tracks Played</div>
          </div>

          <div className="glass-panel p-6 rounded-2xl card-p-square">
            <div className="text-sm font-bold uppercase tracking-wider opacity-60 mb-2">
              Longest Session
            </div>
            <div className="text-5xl font-black text-theme-accent1 text-huge-square">
              {formatDuration(longestSession.durationSeconds)}
            </div>
            <div className="mt-2 font-mono text-sm">{sessionDate}</div>
          </div>
        </div>
      </div>
    </StorySlide>
  )
}
