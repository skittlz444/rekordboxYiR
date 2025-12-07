import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ArtistSlide } from './ArtistSlide'
import { ArtistStat } from '@/shared/types'

describe('ArtistSlide', () => {
  const mockArtists: ArtistStat[] = [
    { Name: 'Fred again..', count: 142 },
    { Name: 'Skrillex', count: 98 },
    { Name: 'Four Tet', count: 85 },
    { Name: 'Overmono', count: 72 },
    { Name: 'Bicep', count: 64 },
  ]

  it('renders the hashtag correctly', () => {
    render(<ArtistSlide artists={mockArtists} />)
    expect(screen.getByText('#TOPARTISTS')).toBeInTheDocument()
  })

  it('renders all artists in 9:16 ratio', () => {
    render(<ArtistSlide artists={mockArtists} aspectRatio="9:16" />)
    expect(screen.getByText('Fred again..')).toBeInTheDocument()
    expect(screen.getByText('Skrillex')).toBeInTheDocument()
    expect(screen.getByText('Four Tet')).toBeInTheDocument()
    expect(screen.getByText('Overmono')).toBeInTheDocument()
    expect(screen.getByText('Bicep')).toBeInTheDocument()
  })

  it('displays play counts correctly', () => {
    render(<ArtistSlide artists={mockArtists} />)
    expect(screen.getByText('142 PLAYS')).toBeInTheDocument()
    expect(screen.getByText('98 PLAYS')).toBeInTheDocument()
  })

  it('renders rank numbers correctly', () => {
    render(<ArtistSlide artists={mockArtists} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('handles unknown artist names gracefully', () => {
    const artistsWithUnknown: ArtistStat[] = [
      { Name: '', count: 10 },
    ]
    render(<ArtistSlide artists={artistsWithUnknown} />)
    expect(screen.getByText('Unknown Artist')).toBeInTheDocument()
  })
})
