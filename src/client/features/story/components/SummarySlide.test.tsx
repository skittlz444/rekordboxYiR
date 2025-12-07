import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SummarySlide } from './SummarySlide'

describe('SummarySlide', () => {
  const mockData = {
    year: '2025',
    topArtist: 'Fred again..',
    topGenre: 'House',
    topTrack: {
      title: 'Rumble',
      artist: 'Skrillex, Fred again..',
    },
    totalPlays: 2451,
    setsPlayed: 42,
    busiestMonth: '2023-07',
    djName: 'DJ SKITTLZ',
  }

  it('renders the year correctly', () => {
    render(<SummarySlide data={mockData} />)
    expect(screen.getByText('2025 WRAPPED')).toBeInTheDocument()
  })

  it('displays top artist correctly', () => {
    render(<SummarySlide data={mockData} />)
    expect(screen.getByText('Fred again..')).toBeInTheDocument()
  })

  it('displays top genre correctly', () => {
    render(<SummarySlide data={mockData} />)
    expect(screen.getByText('House')).toBeInTheDocument()
  })

  it('displays top track correctly', () => {
    render(<SummarySlide data={mockData} />)
    expect(screen.getByText('Rumble')).toBeInTheDocument()
    expect(screen.getByText('Skrillex, Fred again..')).toBeInTheDocument()
  })

  it('displays total plays correctly', () => {
    render(<SummarySlide data={mockData} />)
    expect(screen.getByText('2,451')).toBeInTheDocument()
  })

  it('displays sets played correctly', () => {
    render(<SummarySlide data={mockData} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('displays busiest month correctly', () => {
    render(<SummarySlide data={mockData} />)
    expect(screen.getByText('July')).toBeInTheDocument()
  })

  it('displays DJ name correctly', () => {
    render(<SummarySlide data={mockData} />)
    expect(screen.getByText('DJ SKITTLZ')).toBeInTheDocument()
  })

  it('shows default text when DJ name is not provided', () => {
    const dataWithoutDJ = { ...mockData, djName: undefined }
    render(<SummarySlide data={dataWithoutDJ} />)
    expect(screen.getByText('YOUR YEAR IN MUSIC')).toBeInTheDocument()
  })
})
