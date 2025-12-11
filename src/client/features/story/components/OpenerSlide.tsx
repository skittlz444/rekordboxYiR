import { StorySlide, AspectRatio } from './StorySlide'
import { useState } from 'react'

export interface OpenerSlideProps {
  year: string
  djName?: string
  logo?: string
  aspectRatio?: AspectRatio
}

export function OpenerSlide({ year, djName = 'DJ', logo, aspectRatio = '9:16' }: OpenerSlideProps) {
  const [logoError, setLogoError] = useState(false)

  return (
    <StorySlide aspectRatio={aspectRatio}>
      <div className="bg-gradient-to-br from-theme-bgStart to-theme-bgEnd flex flex-col justify-center items-center p-8 text-theme-text slide-p-square h-full">
        <div className="text-xl font-bold mb-4 opacity-70 slide-mt-square-sm">REKORDBOX</div>
        <h1 className="text-6xl font-black mb-6 text-center leading-tight slide-text-square-sm text-huge-square">
          YOUR
          <br />
          <span className="text-theme-accent2">{year}</span>
          <br />
          IN MUSIC
        </h1>
        <p className="text-lg font-medium text-center mb-12 slide-mt-square-sm">
          Ready to see what you played?
        </p>
        {logo && !logoError ? (
          <img
            src={logo}
            alt={djName ? `${djName} logo` : "DJ logo"}
            className="h-24 w-auto max-w-[200px] object-contain drop-shadow-md"
            width={200}
            height={96}
            loading="lazy"
            onError={() => setLogoError(true)}
          />
        ) : (
          <div className="glass-panel px-6 py-3 rounded-full font-mono text-sm font-bold">
            {djName.toUpperCase()}
          </div>
        )}
      </div>
    </StorySlide>
  )
}
