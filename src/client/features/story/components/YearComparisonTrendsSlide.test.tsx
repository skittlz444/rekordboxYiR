// import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { YearComparisonTrendsSlide, TrendData } from './YearComparisonTrendsSlide'

describe('YearComparisonTrendsSlide', () => {
  const mockTrends: TrendData = {
    biggestObsession: {
      name: 'Fred again..',
      percentageIncrease: 145.5,
    },
    rankClimber: {
      name: 'Dom Dolla',
      previousRank: 15,
      currentRank: 3,
    },
    newFavorite: {
      name: 'Overmono',
      currentRank: 5,
      type: 'Artist',
    },
  }

  it('renders the hashtag correctly', () => {
    render(<YearComparisonTrendsSlide trends={mockTrends} />)
    expect(screen.getByText('#TRENDS')).toBeInTheDocument()
  })

  it('renders the title correctly', () => {
    render(<YearComparisonTrendsSlide trends={mockTrends} />)
    expect(screen.getByText(/MOVING/)).toBeInTheDocument()
    expect(screen.getByText(/ON UP/)).toBeInTheDocument()
  })

  it('displays biggest obsession correctly', () => {
    render(<YearComparisonTrendsSlide trends={mockTrends} />)
    expect(screen.getByText('Biggest Obsession')).toBeInTheDocument()
    expect(screen.getByText('Fred again..')).toBeInTheDocument()
    expect(screen.getByText(/\+146%/)).toBeInTheDocument()
    expect(screen.getByText('plays vs last year')).toBeInTheDocument()
  })

  it('displays rank climber correctly', () => {
    render(<YearComparisonTrendsSlide trends={mockTrends} />)
    expect(screen.getByText('Rank Climber')).toBeInTheDocument()
    expect(screen.getByText('Dom Dolla')).toBeInTheDocument()
    expect(screen.getByText('#15')).toBeInTheDocument()
    expect(screen.getByText('#3')).toBeInTheDocument()
  })

  it('displays new favorite in 9:16 aspect ratio', () => {
    render(<YearComparisonTrendsSlide trends={mockTrends} aspectRatio="9:16" />)
    expect(screen.getByText('New Favorite')).toBeInTheDocument()
    expect(screen.getByText('Overmono')).toBeInTheDocument()
    expect(screen.getByText('From 0 plays to Top 5')).toBeInTheDocument()
  })

  it('hides new favorite in square aspect ratios', () => {
    render(<YearComparisonTrendsSlide trends={mockTrends} aspectRatio="1:1" />)
    expect(screen.queryByText('New Favorite')).not.toBeInTheDocument()
  })

  it('handles missing biggest obsession', () => {
    const trendsWithoutObsession: TrendData = {
      rankClimber: mockTrends.rankClimber,
    }
    render(<YearComparisonTrendsSlide trends={trendsWithoutObsession} />)
    expect(screen.queryByText('Biggest Obsession')).not.toBeInTheDocument()
    expect(screen.getByText('Rank Climber')).toBeInTheDocument()
  })

  it('handles missing rank climber', () => {
    const trendsWithoutClimber: TrendData = {
      biggestObsession: mockTrends.biggestObsession,
    }
    render(<YearComparisonTrendsSlide trends={trendsWithoutClimber} />)
    expect(screen.getByText('Biggest Obsession')).toBeInTheDocument()
    expect(screen.queryByText('Rank Climber')).not.toBeInTheDocument()
  })

  it('handles missing new favorite', () => {
    const trendsWithoutNewFavorite: TrendData = {
      biggestObsession: mockTrends.biggestObsession,
      rankClimber: mockTrends.rankClimber,
    }
    render(<YearComparisonTrendsSlide trends={trendsWithoutNewFavorite} aspectRatio="9:16" />)
    expect(screen.queryByText('New Favorite')).not.toBeInTheDocument()
  })

  it('handles empty trends object', () => {
    const emptyTrends: TrendData = {}
    render(<YearComparisonTrendsSlide trends={emptyTrends} />)
    expect(screen.getByText('#TRENDS')).toBeInTheDocument()
    expect(screen.getByText(/MOVING/)).toBeInTheDocument()
    // Should render without any trend cards
    expect(screen.queryByText('Biggest Obsession')).not.toBeInTheDocument()
    expect(screen.queryByText('Rank Climber')).not.toBeInTheDocument()
    expect(screen.queryByText('New Favorite')).not.toBeInTheDocument()
  })

  it('rounds percentage increase correctly', () => {
    const trendsWithDecimal: TrendData = {
      biggestObsession: {
        name: 'Test Artist',
        percentageIncrease: 123.789,
      },
    }
    render(<YearComparisonTrendsSlide trends={trendsWithDecimal} />)
    expect(screen.getByText(/\+124%/)).toBeInTheDocument()
  })

  it('renders in different aspect ratios', () => {
    const { rerender } = render(<YearComparisonTrendsSlide trends={mockTrends} aspectRatio="9:16" />)
    expect(screen.getByText('Fred again..')).toBeInTheDocument()
    expect(screen.getByText('New Favorite')).toBeInTheDocument() // shown in 9:16

    rerender(<YearComparisonTrendsSlide trends={mockTrends} aspectRatio="4:5" />)
    expect(screen.getByText('Fred again..')).toBeInTheDocument()
    expect(screen.queryByText('New Favorite')).not.toBeInTheDocument() // hidden in 4:5

    rerender(<YearComparisonTrendsSlide trends={mockTrends} aspectRatio="1:1" />)
    expect(screen.getByText('Fred again..')).toBeInTheDocument()
    expect(screen.queryByText('New Favorite')).not.toBeInTheDocument() // hidden in 1:1
  })
})
