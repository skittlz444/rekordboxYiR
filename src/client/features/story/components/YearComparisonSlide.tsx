import { StorySlide, AspectRatio } from './StorySlide'

export interface ComparisonMetric {
  label: string
  current: string | number
  previous: string | number
  change: string
  changePercentage: number
}

export interface YearComparisonSlideProps {
  comparisonYear: string
  metrics: ComparisonMetric[]
  aspectRatio?: AspectRatio
}

export function YearComparisonSlide({
  comparisonYear,
  metrics,
  aspectRatio = '9:16',
}: YearComparisonSlideProps) {
  const metricCount = metrics.length
  
  // Determine title based on metric count
  const getTitle = () => {
    if (metricCount === 1) return 'ONE BIG\nWIN'
    if (metricCount >= 4) return 'FULL\nGROWTH'
    return 'LEVELING\nUP?'
  }
  const title = getTitle()
  
  // Determine layout based on count
  const isCompact = metricCount >= 4
  const isSingle = metricCount === 1

  return (
    <StorySlide aspectRatio={aspectRatio}>
      <div className="bg-gradient-to-br from-theme-bgStart to-theme-bgEnd flex flex-col p-8 text-theme-text relative slide-p-square h-full">
        <div className="absolute top-8 left-8 text-sm font-bold opacity-50 slide-mt-square-sm slide-tag">
          #{`VS${comparisonYear}`}
        </div>
        <h2 className="text-4xl font-black mt-12 mb-8 leading-none slide-text-square-sm slide-mt-square-sm whitespace-pre-line">
          {title}
        </h2>

        {isSingle ? (
          // Single metric - centered large display
          <div className="flex-1 flex flex-col justify-center">
            <div className="glass-panel p-8 rounded-2xl text-center card-p-square">
              <div className="text-lg font-bold opacity-60 mb-4">{metrics[0].label}</div>
              <div className="text-7xl font-black text-theme-accent2 mb-4 text-huge-square">
                {metrics[0].current}
              </div>
              <div className="inline-block bg-green-200 text-green-800 font-mono font-bold px-4 py-2 rounded-full text-lg mb-4">
                {metrics[0].change}
              </div>
              <div className="text-lg opacity-50">vs {metrics[0].previous} in {comparisonYear}</div>
            </div>
          </div>
        ) : isCompact ? (
          // 4 metrics - compact grid
          <div className="flex-1 grid grid-cols-2 gap-4 content-center slide-gap-square">
            {metrics.map((metric, index) => (
              <div key={index} className="glass-panel p-4 rounded-xl flex flex-col justify-between h-32 h-auto-square">
                <div className="text-xs font-bold opacity-60">{metric.label}</div>
                <div>
                  <div className="text-2xl font-black">{metric.current}</div>
                  <div className="text-xs text-green-600 font-bold">{metric.change}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // 2-3 metrics - larger cards
          <div className={`flex-1 flex flex-col justify-center ${metricCount === 2 ? 'gap-8' : 'gap-6'} slide-gap-square grid-cols-square-2`}>
            {metrics.map((metric, index) => (
              <div key={index} className={`glass-panel ${metricCount === 2 ? 'p-6' : 'p-5'} rounded-xl card-p-square`}>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-sm font-bold opacity-60">{metric.label}</div>
                  <div className="text-xs font-mono bg-green-200 text-green-800 px-2 py-1 rounded">
                    {metric.change}
                  </div>
                </div>
                <div className={`${metricCount === 2 ? 'text-5xl text-huge-square' : 'text-4xl text-big-square'} font-black`}>
                  {metric.current}
                </div>
                <div className={`${metricCount === 2 ? 'text-sm mt-2' : 'text-xs mt-1'} opacity-50`}>
                  vs {metric.previous} in {comparisonYear}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StorySlide>
  )
}
