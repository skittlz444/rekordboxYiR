import { StorySlide, AspectRatio } from './StorySlide'
import { TrackStat } from '@/shared/types'

export interface TrackSlideProps {
  tracks: TrackStat[]
  aspectRatio?: AspectRatio
}

export function TrackSlide({ tracks, aspectRatio = '9:16' }: TrackSlideProps) {
  const displayTracks = aspectRatio === '1:1' || aspectRatio === '4:5' ? tracks.slice(0, 3) : tracks.slice(0, 5)
  const topTrack = tracks[0]
  const remainingTracks = displayTracks.slice(1)

  return (
    <StorySlide aspectRatio={aspectRatio}>
      <div className="bg-gradient-to-br from-theme-bgStart to-theme-bgEnd flex flex-col p-8 text-theme-text relative slide-p-square h-full">
        <div className="absolute top-8 left-8 text-sm font-bold opacity-50 slide-mt-square-sm slide-tag">
          #TOPTRACKS
        </div>
        <h2 className="text-4xl font-black mt-12 mb-8 leading-none slide-text-square-sm slide-mt-square-sm">
          YOUR
          <br />
          ANTHEMS
        </h2>

        <div className="flex-1 flex flex-col justify-center gap-6 slide-gap-square">
          {/* Top Track - Featured Card */}
          <div className="glass-panel p-4 rounded-xl border-l-4 border-theme-accent2 flex justify-between items-center card-p-square">
            <div>
              <div className="text-xs font-mono font-bold text-theme-accent2 mb-1">MOST PLAYED</div>
              <div className="font-bold text-xl leading-tight mb-1 line-clamp-2">
                {topTrack.Title || 'Unknown Track'}
              </div>
              <div className="text-sm opacity-70 line-clamp-1">{topTrack.Artist || 'Unknown Artist'}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black">{topTrack.count}</div>
              <div className="text-[10px] font-mono opacity-60 uppercase">Plays</div>
            </div>
          </div>

          {/* Remaining Tracks */}
          {remainingTracks.map((track, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 list-item-square ${index >= 3 ? 'hide-on-square' : ''}`}
            >
              <div className={`font-mono font-bold text-xl ${index === 0 ? 'text-theme-accent1' : 'text-slate-400'}`}>
                {String(index + 2).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-lg line-clamp-1">{track.Title || 'Unknown Track'}</div>
                <div className="text-xs opacity-60 line-clamp-1">{track.Artist || 'Unknown Artist'}</div>
              </div>
              <div className="text-right opacity-70">
                <div className="font-mono font-bold text-sm">{track.count}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StorySlide>
  )
}
