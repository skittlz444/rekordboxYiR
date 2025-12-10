// import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Dashboard } from './Dashboard'
import { StatsResponse } from '@/shared/types'

describe('Dashboard', () => {
  const mockData: StatsResponse = {
    year: '2024',
    stats: {
      totalTracks: 1500,
      totalPlaytimeSeconds: 54000,
      totalSessions: 25,
      libraryGrowth: {
        total: 5000,
        added: 200,
      },
      longestSession: {
        date: '2024-06-15',
        count: 150,
        durationSeconds: 18000,
      },
      busiestMonth: {
        month: '2024-06',
        count: 300,
      },
      topTracks: [
        { Title: 'Best Track Ever', Artist: 'Top Artist', count: 50 },
      ],
      topArtists: [{ Name: 'Top Artist', count: 100 }],
      topGenres: [{ Name: 'House', count: 500 }],
      topBPMs: [{ BPM: 128, count: 300 }],
    },
  }

  it('should render the dashboard with year', () => {
    const onPlayStory = vi.fn()
    const onViewAllSlides = vi.fn()
    render(<Dashboard data={mockData} onPlayStory={onPlayStory} onViewAllSlides={onViewAllSlides} />)

    expect(screen.getByText(/Your 2024 Year in Review/i)).toBeInTheDocument()
  })

  it('should display total plays stat', () => {
    const onPlayStory = vi.fn()
    const onViewAllSlides = vi.fn()
    render(<Dashboard data={mockData} onPlayStory={onPlayStory} onViewAllSlides={onViewAllSlides} />)

    expect(screen.getByText('Total Plays')).toBeInTheDocument()
    expect(screen.getByText('1,500')).toBeInTheDocument()
  })

  it('should display top artist', () => {
    const onPlayStory = vi.fn()
    const onViewAllSlides = vi.fn()
    render(<Dashboard data={mockData} onPlayStory={onPlayStory} onViewAllSlides={onViewAllSlides} />)

    expect(screen.getByText('Top 10 Artists')).toBeInTheDocument()
    expect(screen.getByText('100 plays')).toBeInTheDocument()
  })

  it('should display top track', () => {
    const onPlayStory = vi.fn()
    const onViewAllSlides = vi.fn()
    render(<Dashboard data={mockData} onPlayStory={onPlayStory} onViewAllSlides={onViewAllSlides} />)

    expect(screen.getByText('Best Track Ever')).toBeInTheDocument()
    expect(screen.getByText('50 plays')).toBeInTheDocument()
  })

  it('should display play story button', () => {
    const onPlayStory = vi.fn()
    const onViewAllSlides = vi.fn()
    render(<Dashboard data={mockData} onPlayStory={onPlayStory} onViewAllSlides={onViewAllSlides} />)

    expect(screen.getByText('Play Story')).toBeInTheDocument()
  })

  it('should call onPlayStory when play button is clicked', () => {
    const onPlayStory = vi.fn()
    const onViewAllSlides = vi.fn()
    render(<Dashboard data={mockData} onPlayStory={onPlayStory} onViewAllSlides={onViewAllSlides} />)

    const playButton = screen.getByText('Play Story')
    fireEvent.click(playButton)

    expect(onPlayStory).toHaveBeenCalledTimes(1)
  })

  it('should call onViewAllSlides when view all slides button is clicked', () => {
    const onPlayStory = vi.fn()
    const onViewAllSlides = vi.fn()
    render(<Dashboard data={mockData} onPlayStory={onPlayStory} onViewAllSlides={onViewAllSlides} />)

    const viewAllButton = screen.getByText('View All Slides')
    fireEvent.click(viewAllButton)

    expect(onViewAllSlides).toHaveBeenCalledTimes(1)
  })

  it('should display comparison data when available', () => {
    const dataWithComparison: StatsResponse = {
      ...mockData,
      comparison: {
        year: '2023',
        stats: {
          ...mockData.stats,
          totalTracks: 1000,
        },
        diffs: {
          tracksPercentage: 50,
          playtimePercentage: 20,
          sessionPercentage: 10,
          totalSessionsPercentage: 25,
        },
      },
    }

    const onPlayStory = vi.fn()
    const onViewAllSlides = vi.fn()
    render(<Dashboard data={dataWithComparison} onPlayStory={onPlayStory} onViewAllSlides={onViewAllSlides} />)

    expect(screen.getByText(/compared to 2023/i)).toBeInTheDocument()
    expect(screen.getByText('+50% from 2023')).toBeInTheDocument()
  })

  it('should display library growth', () => {
    const onPlayStory = vi.fn()
    const onViewAllSlides = vi.fn()
    render(<Dashboard data={mockData} onPlayStory={onPlayStory} onViewAllSlides={onViewAllSlides} />)

    expect(screen.getByText('Library Growth')).toBeInTheDocument()
    expect(screen.getByText('+200')).toBeInTheDocument()
  })

  it('should calculate total playtime in hours with percentage adjustment', () => {
    const onPlayStory = vi.fn()
    const onViewAllSlides = vi.fn()
    render(<Dashboard data={mockData} onPlayStory={onPlayStory} onViewAllSlides={onViewAllSlides} />)

    // 54000 seconds * 0.75 (default percentage) = 40500 seconds = 11.25 hours => 11h
    expect(screen.getByText('11h')).toBeInTheDocument()
  })
})
