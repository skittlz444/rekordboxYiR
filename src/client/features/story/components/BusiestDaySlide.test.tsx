import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BusiestDaySlide } from './BusiestDaySlide'

describe('BusiestDaySlide', () => {
  const mockProps = {
    busiestMonth: { month: '2023-07', count: 342 },
    longestSession: { date: '2023-10-14', durationSeconds: 22320 },
  }

  it('renders the hashtag correctly', () => {
    render(<BusiestDaySlide {...mockProps} />)
    expect(screen.getByText('#BUSIEST')).toBeInTheDocument()
  })

  it('displays busiest month correctly', () => {
    render(<BusiestDaySlide {...mockProps} />)
    expect(screen.getByText('JULY')).toBeInTheDocument()
    expect(screen.getByText('342 Tracks Played')).toBeInTheDocument()
  })

  it('formats longest session duration correctly', () => {
    render(<BusiestDaySlide {...mockProps} />)
    // 22320 seconds = 6 hours 12 minutes
    expect(screen.getByText('6h 12m')).toBeInTheDocument()
    // Date formatting depends on locale, but usually includes Oct 14
    expect(screen.getByText('Oct 14, 2023')).toBeInTheDocument()
  })

  it('handles missing duration gracefully', () => {
    const propsWithoutDuration = {
      ...mockProps,
      longestSession: { date: '2023-10-14' },
    }
    render(<BusiestDaySlide {...propsWithoutDuration} />)
    expect(screen.getByText('N/A')).toBeInTheDocument()
  })

  it('formats different durations correctly', () => {
    const props = {
      busiestMonth: { month: '2023-07', count: 342 },
      longestSession: { date: '2023-10-14', durationSeconds: 7260 }, // 2h 1m
    }
    render(<BusiestDaySlide {...props} />)
    expect(screen.getByText('2h 1m')).toBeInTheDocument()
  })
})
