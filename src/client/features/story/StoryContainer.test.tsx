import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StoryContainer } from './StoryContainer'
import { StatsResponse } from '@/shared/types'

// Mock the download hook
const mockDownloadSlide = vi.fn()
vi.mock('./hooks/useSlideDownload', () => ({
  useSlideDownload: () => ({
    downloadSlide: mockDownloadSlide,
  }),
}))

// Mock the DownloadableSlideWrapper to simplify testing
vi.mock('./components', async () => {
  const actual = await vi.importActual('./components')
  return {
    ...actual,
    DownloadableSlideWrapper: ({ children, filename }: { children: React.ReactNode; filename: string }) => (
      <div data-testid={`wrapper-${filename}`}>
        {children}
        <button onClick={() => mockDownloadSlide(null, filename)}>Download {filename}</button>
      </div>
    ),
  }
})

describe('StoryContainer', () => {
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

  const mockDataWithComparison: StatsResponse = {
    ...mockData,
    comparison: {
      year: '2023',
      stats: {
        ...mockData.stats,
        totalTracks: 1000,
        topTracks: [
          { Title: 'Old Track', Artist: 'Old Artist', count: 30 },
          { Title: 'Best Track Ever', Artist: 'Top Artist', count: 10 },
        ],
        topArtists: [
          { Name: 'Old Artist', count: 50 },
          { Name: 'Top Artist', count: 40 },
        ],
        topGenres: [
          { Name: 'Techno', count: 300 },
          { Name: 'House', count: 200 },
        ],
      },
      diffs: {
        tracksPercentage: 50,
        playtimePercentage: 20,
        sessionPercentage: 10,
        totalSessionsPercentage: 25,
      },
    },
  }

  beforeEach(() => {
    mockDownloadSlide.mockClear()
  })

  it('should render all base slides with download wrappers', () => {
    render(<StoryContainer data={mockData} />)
    
    // Check that all base slides have download wrappers
    expect(screen.getByTestId('wrapper-opener-2024.png')).toBeInTheDocument()
    expect(screen.getByTestId('wrapper-top-artists-2024.png')).toBeInTheDocument()
    expect(screen.getByTestId('wrapper-top-tracks-2024.png')).toBeInTheDocument()
    expect(screen.getByTestId('wrapper-top-genres-2024.png')).toBeInTheDocument()
    expect(screen.getByTestId('wrapper-busiest-day-2024.png')).toBeInTheDocument()
    expect(screen.getByTestId('wrapper-library-growth-2024.png')).toBeInTheDocument()
    expect(screen.getByTestId('wrapper-summary-2024.png')).toBeInTheDocument()
  })

  it('should render download buttons for each slide', () => {
    render(<StoryContainer data={mockData} />)
    
    expect(screen.getByText('Download opener-2024.png')).toBeInTheDocument()
    expect(screen.getByText('Download top-artists-2024.png')).toBeInTheDocument()
    expect(screen.getByText('Download top-tracks-2024.png')).toBeInTheDocument()
    expect(screen.getByText('Download top-genres-2024.png')).toBeInTheDocument()
    expect(screen.getByText('Download busiest-day-2024.png')).toBeInTheDocument()
    expect(screen.getByText('Download library-growth-2024.png')).toBeInTheDocument()
    expect(screen.getByText('Download summary-2024.png')).toBeInTheDocument()
  })

  it('should trigger download with correct filename when download button is clicked', () => {
    render(<StoryContainer data={mockData} />)
    
    const downloadButton = screen.getByText('Download opener-2024.png')
    fireEvent.click(downloadButton)
    
    expect(mockDownloadSlide).toHaveBeenCalledTimes(1)
    expect(mockDownloadSlide).toHaveBeenCalledWith(null, 'opener-2024.png')
  })

  it('should include comparison slides when comparison data is available', () => {
    render(<StoryContainer data={mockDataWithComparison} />)
    
    // Check that comparison slides are rendered
    expect(screen.getByTestId('wrapper-comparison-2024.png')).toBeInTheDocument()
    expect(screen.getByTestId('wrapper-trends-2024.png')).toBeInTheDocument()
  })

  it('should not include comparison slides when comparison data is missing', () => {
    render(<StoryContainer data={mockData} />)
    
    // Check that comparison slides are not rendered
    expect(screen.queryByTestId('wrapper-comparison-2024.png')).not.toBeInTheDocument()
    expect(screen.queryByTestId('wrapper-trends-2024.png')).not.toBeInTheDocument()
  })

  it('should have aspect ratio switcher buttons', () => {
    render(<StoryContainer data={mockData} />)
    
    expect(screen.getByText('9:16 (Story)')).toBeInTheDocument()
    expect(screen.getByText('4:5 (Portrait)')).toBeInTheDocument()
    expect(screen.getByText('1:1 (Square)')).toBeInTheDocument()
  })

  it('should have theme switcher buttons', () => {
    render(<StoryContainer data={mockData} />)
    
    expect(screen.getByText('Pastel')).toBeInTheDocument()
    expect(screen.getByText('Club')).toBeInTheDocument()
    expect(screen.getByText('Clean')).toBeInTheDocument()
    expect(screen.getByText('Dark')).toBeInTheDocument()
  })
})
