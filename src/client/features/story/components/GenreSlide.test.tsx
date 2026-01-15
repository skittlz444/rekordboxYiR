import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GenreSlide } from './GenreSlide'
import { GenreStat } from '@/shared/types'

describe('GenreSlide', () => {
  const mockGenres: GenreStat[] = [
    { Name: 'House', count: 350 },
    { Name: 'Techno', count: 250 },
    { Name: 'Garage', count: 200 },
    { Name: 'Drum & Bass', count: 100 },
    { Name: 'Other', count: 100 },
  ]

  it('renders the hashtag correctly', () => {
    render(<GenreSlide genres={mockGenres} />)
    expect(screen.getByText('#TOPGENRES')).toBeInTheDocument()
  })

  it('renders the title correctly', () => {
    render(<GenreSlide genres={mockGenres} />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('THE')
    expect(heading).toHaveTextContent('VIBE')
    expect(heading).toHaveTextContent('CHECK')
  })

  it('displays genre names correctly', () => {
    render(<GenreSlide genres={mockGenres} />)
    expect(screen.getByText('House')).toBeInTheDocument()
    expect(screen.getByText('Techno')).toBeInTheDocument()
    expect(screen.getByText('Garage')).toBeInTheDocument()
  })

  it('calculates percentages correctly', () => {
    render(<GenreSlide genres={mockGenres} />)
    // Total = 1000, House = 350, so 35%
    expect(screen.getByText('35%')).toBeInTheDocument()
    // Techno = 250, so 25%
    expect(screen.getByText('25%')).toBeInTheDocument()
    // Garage = 200, so 20%
    expect(screen.getByText('20%')).toBeInTheDocument()
  })

  it('handles empty genre names gracefully', () => {
    const genresWithUnknown: GenreStat[] = [
      { Name: '', count: 100 },
    ]
    render(<GenreSlide genres={genresWithUnknown} />)
    expect(screen.getByText('Unknown')).toBeInTheDocument()
  })

  it('applies theme to StorySlide container', () => {
    const { container } = render(<GenreSlide genres={mockGenres} theme="theme-club" />)
    const slideContainer = container.querySelector('.slide-container')
    expect(slideContainer).toHaveClass('theme-club')
  })

  it('applies default theme when no theme prop is provided', () => {
    const { container } = render(<GenreSlide genres={mockGenres} />)
    const slideContainer = container.querySelector('.slide-container')
    expect(slideContainer).toHaveClass('theme-pastel')
  })
})
