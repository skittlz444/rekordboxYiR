import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TrackSlide } from './TrackSlide'
import { TrackStat } from '@/shared/types'

describe('TrackSlide', () => {
  const mockTracks: TrackStat[] = [
    { Title: 'Rumble', Artist: 'Skrillex, Fred again..', count: 84 },
    { Title: 'Baby again..', Artist: 'Fred again.., Skrillex, Four Tet', count: 62 },
    { Title: 'Leavemealone', Artist: 'Fred again.., Baby Keem', count: 58 },
    { Title: 'Strong', Artist: 'Romy, Fred again..', count: 45 },
    { Title: 'Miracle Maker', Artist: 'Dom Dolla', count: 42 },
  ]

  it('renders the hashtag correctly', () => {
    render(<TrackSlide tracks={mockTracks} />)
    expect(screen.getByText('#TOPTRACKS')).toBeInTheDocument()
  })

  it('renders the top track with featured styling', () => {
    render(<TrackSlide tracks={mockTracks} />)
    expect(screen.getByText('MOST PLAYED')).toBeInTheDocument()
    expect(screen.getByText('Rumble')).toBeInTheDocument()
    expect(screen.getByText('Skrillex, Fred again..')).toBeInTheDocument()
  })

  it('displays track play counts correctly', () => {
    render(<TrackSlide tracks={mockTracks} />)
    expect(screen.getByText('84')).toBeInTheDocument()
    expect(screen.getByText('62')).toBeInTheDocument()
  })

  it('renders remaining tracks with rank numbers', () => {
    render(<TrackSlide tracks={mockTracks} />)
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(screen.getByText('03')).toBeInTheDocument()
    expect(screen.getByText('04')).toBeInTheDocument()
    expect(screen.getByText('05')).toBeInTheDocument()
  })

  it('handles unknown track/artist names gracefully', () => {
    const tracksWithUnknown: TrackStat[] = [
      { Title: '', Artist: '', count: 10 },
    ]
    render(<TrackSlide tracks={tracksWithUnknown} />)
    expect(screen.getByText('Unknown Track')).toBeInTheDocument()
    expect(screen.getByText('Unknown Artist')).toBeInTheDocument()
  })
})
