import { StorySlide, AspectRatio } from './StorySlide'

export interface TrendData {
  biggestObsession?: {
    name: string
    percentageIncrease: number
  }
  rankClimber?: {
    name: string
    previousRank: number
    currentRank: number
  }
  newFavorite?: {
    name: string
    currentRank: number
    type: 'Artist' | 'Genre'
  }
}

export interface YearComparisonTrendsSlideProps {
  trends: TrendData
  aspectRatio?: AspectRatio
}

export function YearComparisonTrendsSlide({
  trends,
  aspectRatio = '9:16',
}: YearComparisonTrendsSlideProps) {
  const hasNewFavorite = !!trends.newFavorite
  const showNewFavorite = hasNewFavorite && (aspectRatio === '9:16')

  return (
    <StorySlide aspectRatio={aspectRatio}>
      <div className="bg-gradient-to-br from-theme-bgStart to-theme-bgEnd flex flex-col p-8 text-theme-text relative slide-p-square h-full">
        <div className="absolute top-8 left-8 text-sm font-bold opacity-50 slide-mt-square-sm slide-tag">
          #TRENDS
        </div>
        <h2 className="text-4xl font-black mt-12 mb-8 leading-none slide-text-square-sm slide-mt-square-sm">
          MOVING
          <br />
          ON UP
        </h2>

        <div className="flex-1 flex flex-col justify-center gap-6 slide-gap-square">
          {/* Biggest Obsession */}
          {trends.biggestObsession && (
            <div className="glass-panel p-5 rounded-xl border-l-4 border-green-400 card-p-square">
              <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">
                Biggest Obsession
              </div>
              <div className="text-2xl font-black mb-1">{trends.biggestObsession.name}</div>
              <div className="flex items-center gap-2 text-sm font-mono">
                <span className="text-green-600 font-bold">
                  ▲ +{Math.round(trends.biggestObsession.percentageIncrease)}%
                </span>
                <span className="opacity-50">plays vs last year</span>
              </div>
            </div>
          )}

          {/* Rank Climber */}
          {trends.rankClimber && (
            <div className="glass-panel p-5 rounded-xl border-l-4 border-theme-accent2 card-p-square">
              <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">
                Rank Climber
              </div>
              <div className="text-2xl font-black mb-1">{trends.rankClimber.name}</div>
              <div className="flex items-center gap-2 text-sm font-mono">
                <span className="bg-theme-accent2 text-white px-1.5 rounded text-xs">
                  #{trends.rankClimber.previousRank}
                </span>
                <span className="opacity-50">→</span>
                <span className="bg-theme-accent2 text-white px-1.5 rounded text-xs">
                  #{trends.rankClimber.currentRank}
                </span>
              </div>
            </div>
          )}

          {/* New Favorite */}
          {showNewFavorite && trends.newFavorite && (
            <div className="glass-panel p-5 rounded-xl border-l-4 border-theme-accent1 hide-on-square card-p-square">
              <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">
                New Favorite
              </div>
              <div className="text-2xl font-black mb-1">{trends.newFavorite.name}</div>
              <div className="text-sm opacity-60">
                From 0 plays to Top {trends.newFavorite.currentRank}
              </div>
            </div>
          )}
        </div>
      </div>
    </StorySlide>
  )
}
