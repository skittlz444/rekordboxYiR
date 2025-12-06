import { StorySlide, AspectRatio } from './StorySlide'

export interface SummaryData {
  year: string
  topArtist: string
  topGenre: string
  topTrack: {
    title: string
    artist: string
  }
  totalPlays: number
  setsPlayed: number
  busiestMonth: string
  djName?: string
}

export interface SummarySlideProps {
  data: SummaryData
  aspectRatio?: AspectRatio
}

export function SummarySlide({ data, aspectRatio = '9:16' }: SummarySlideProps) {
  return (
    <StorySlide aspectRatio={aspectRatio}>
      <div className="bg-gradient-to-br from-theme-bgStart to-theme-bgEnd flex flex-col p-8 text-theme-text relative slide-p-square h-full">
        <div className="text-center mt-8 mb-6 slide-mt-square-sm">
          <div className="text-sm font-bold opacity-50">REKORDBOX YEAR IN REVIEW</div>
          <h2 className="text-3xl font-black text-theme-accent2">{data.year} WRAPPED</h2>
        </div>

        <div className="glass-panel flex-1 rounded-2xl p-6 flex flex-col justify-center gap-5 slide-gap-square summary-grid-square card-p-square">
          <div>
            <div className="text-xs opacity-60 font-bold mb-1">TOP ARTIST</div>
            <div className="font-bold text-2xl truncate">{data.topArtist}</div>
          </div>

          <div className="h-px bg-slate-300 opacity-50 hide-on-square"></div>

          <div>
            <div className="text-xs opacity-60 font-bold mb-1">TOP GENRE</div>
            <div className="font-bold text-2xl truncate">{data.topGenre}</div>
          </div>

          <div className="h-px bg-slate-300 opacity-50 hide-on-square"></div>

          <div>
            <div className="text-xs opacity-60 font-bold mb-1">TOP TRACK</div>
            <div className="font-bold text-xl leading-tight">{data.topTrack.title}</div>
            <div className="text-xs opacity-60">{data.topTrack.artist}</div>
          </div>

          <div className="h-px bg-slate-300 opacity-50 hide-on-square"></div>

          <div className="grid grid-cols-2 gap-4 summary-col-span-2">
            <div>
              <div className="text-xs opacity-60 font-bold mb-1">TOTAL PLAYS</div>
              <div className="font-mono font-bold text-2xl text-big-square">
                {data.totalPlays.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs opacity-60 font-bold mb-1">SETS PLAYED</div>
              <div className="font-mono font-bold text-2xl text-big-square">
                {data.setsPlayed}
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-300 opacity-50 hide-on-square"></div>

          <div className="summary-col-span-2">
            <div className="text-xs opacity-60 font-bold mb-1">BUSIEST MONTH</div>
            <div className="font-mono font-bold text-2xl text-big-square">{data.busiestMonth}</div>
          </div>
        </div>

        <div className="mt-6 text-center hide-on-square">
          <div className="font-mono font-bold text-sm">
            {data.djName ? data.djName.toUpperCase() : 'YOUR YEAR IN MUSIC'}
          </div>
        </div>
      </div>
    </StorySlide>
  )
}
