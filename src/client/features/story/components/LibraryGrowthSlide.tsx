import { StorySlide, AspectRatio, Theme } from './StorySlide'

export interface LibraryGrowthSlideProps {
  newTracks: number
  totalLibrarySize: number
  aspectRatio?: AspectRatio
  theme?: Theme
}

export function LibraryGrowthSlide({
  newTracks,
  totalLibrarySize,
  aspectRatio = '9:16',
  theme,
}: LibraryGrowthSlideProps) {
  const isGrowth = newTracks > 0
  const title = isGrowth ? 'THE\nCOLLECTION\nGREW' : 'LIBRARY\nCLEANED\nUP'
  const subtitle = isGrowth ? 'New Tracks Added' : 'Tracks Removed'
  const perDayText = isGrowth
    ? `That's ${(newTracks / 365).toFixed(1)} tracks per day!`
    : 'Time to refresh your sound'

  return (
    <StorySlide aspectRatio={aspectRatio} theme={theme}>
      <div className="bg-gradient-to-br from-theme-bgStart to-theme-bgEnd flex flex-col p-8 text-theme-text relative slide-p-square h-full">
        <div className="absolute top-8 left-8 text-sm font-bold opacity-50 slide-mt-square-sm slide-tag">
          #LIBRARY
        </div>
        <h2 className="text-4xl font-black mt-12 mb-8 leading-none slide-text-square-sm slide-mt-square-sm whitespace-pre-line">
          {title}
        </h2>

        <div className="flex-1 flex flex-col justify-center gap-8 slide-gap-square grid-cols-square-2">
          <div className="glass-panel p-6 rounded-2xl text-center card-p-square">
            <div className="text-sm font-bold uppercase tracking-wider opacity-60 mb-2">
              {subtitle}
            </div>
            <div className="text-6xl font-black text-theme-accent2 text-huge-square">
              {isGrowth ? newTracks : Math.abs(newTracks)}
            </div>
            <div className="mt-2 font-mono text-sm opacity-70">{perDayText}</div>
          </div>

          <div className="glass-panel p-6 rounded-2xl text-center card-p-square">
            <div className="text-sm font-bold uppercase tracking-wider opacity-60 mb-2">
              Total Library Size
            </div>
            <div className="text-4xl font-black text-theme-accent1 text-huge-square">
              {totalLibrarySize.toLocaleString()}
            </div>
            <div className="mt-2 font-mono text-sm opacity-70">Tracks</div>
          </div>
        </div>
      </div>
    </StorySlide>
  )
}
