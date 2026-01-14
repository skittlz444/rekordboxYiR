import { StorySlide, AspectRatio, Theme } from './StorySlide'
import { ArtistStat } from '@/shared/types'

export interface ArtistSlideProps {
  artists: ArtistStat[]
  aspectRatio?: AspectRatio
  theme?: Theme
}

export function ArtistSlide({ artists, aspectRatio = '9:16', theme }: ArtistSlideProps) {
  const displayArtists = aspectRatio === '1:1' || aspectRatio === '4:5' ? artists.slice(0, 3) : artists.slice(0, 5)

  return (
    <StorySlide aspectRatio={aspectRatio} theme={theme}>
      <div className="bg-gradient-to-br from-theme-bgStart to-theme-bgEnd flex flex-col p-8 text-theme-text relative slide-p-square h-full">
        <div className="absolute top-8 left-8 text-sm font-bold opacity-50 slide-mt-square-sm slide-tag">
          #TOPARTISTS
        </div>
        <h2 className="text-4xl font-black mt-12 mb-8 leading-none slide-text-square-sm slide-mt-square-sm">
          THE ONES
          <br />
          YOU LOVED
          <br />
          MOST
        </h2>

        <div className="flex-1 flex flex-col justify-center gap-4 slide-gap-square">
          {displayArtists.map((artist, index) => {
            const isTop = index === 0
            const isSecond = index === 1
            const isThird = index === 2

            const circleSize = isTop ? 'w-12 h-12' : isSecond || isThird ? 'w-10 h-10' : 'w-8 h-8'
            const circleBg = isTop
              ? 'bg-theme-accent2'
              : isSecond
                ? 'bg-theme-accent1'
                : isThird
                  ? 'bg-slate-300'
                  : 'bg-slate-200'
            const circleText = isTop
              ? 'text-white font-black text-xl'
              : isSecond || isThird
                ? 'text-white font-bold text-lg'
                : 'text-slate-500 font-bold text-sm'
            const nameSize = isTop
              ? 'text-2xl'
              : isSecond || isThird
                ? 'text-xl'
                : 'text-lg'

            return (
              <div
                key={index}
                className={`flex items-center gap-4 list-item-square ${index >= 3 ? 'hide-on-square' : ''}`}
              >
                <div className={`${circleSize} rounded-full ${circleBg} flex items-center justify-center ${circleText}`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold ${nameSize} line-clamp-2 leading-tight break-words`}>
                    {artist.Name || 'Unknown Artist'}
                  </div>
                  <div className="text-xs font-mono opacity-70">{artist.count} PLAYS</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </StorySlide>
  )
}
