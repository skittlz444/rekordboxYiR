import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StoryModeOverlay } from './StoryModeOverlay'
import { StatsResponse } from '@/shared/types'

// Mock the download hook
const mockDownloadSlide = vi.fn()
vi.mock('./hooks/useSlideDownload', () => ({
  useSlideDownload: () => ({
    downloadSlide: mockDownloadSlide,
  }),
}))

describe('StoryModeOverlay', () => {
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
      },
      diffs: {
        tracksPercentage: 50,
        playtimePercentage: 20,
        sessionPercentage: 10,
        totalSessionsPercentage: 25,
      },
    },
  }

  it('should render story mode overlay', () => {
    const onClose = vi.fn()
    render(<StoryModeOverlay data={mockData} onClose={onClose} />)
    
    // Check for close button
    expect(screen.getByLabelText('Close story mode')).toBeInTheDocument()
  })

  it('should display slide counter', () => {
    const onClose = vi.fn()
    render(<StoryModeOverlay data={mockData} onClose={onClose} />)
    
    // Should show current slide / total slides
    expect(screen.getByText(/1 \/ \d+/)).toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<StoryModeOverlay data={mockData} onClose={onClose} />)
    
    const closeButton = screen.getByLabelText('Close story mode')
    fireEvent.click(closeButton)
    
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should navigate to next slide when next button is clicked', () => {
    const onClose = vi.fn()
    render(<StoryModeOverlay data={mockData} onClose={onClose} />)
    
    const nextButton = screen.getByLabelText('Next slide')
    
    // Check initial slide counter
    expect(screen.getByText(/1 \/ \d+/)).toBeInTheDocument()
    
    // Click next
    fireEvent.click(nextButton)
    
    // Should advance to slide 2
    expect(screen.getByText(/2 \/ \d+/)).toBeInTheDocument()
  })

  it('should navigate to previous slide when previous button is clicked', () => {
    const onClose = vi.fn()
    render(<StoryModeOverlay data={mockData} onClose={onClose} />)
    
    const nextButton = screen.getByLabelText('Next slide')
    const prevButton = screen.getByLabelText('Previous slide')
    
    // Go to slide 2
    fireEvent.click(nextButton)
    expect(screen.getByText(/2 \/ \d+/)).toBeInTheDocument()
    
    // Go back to slide 1
    fireEvent.click(prevButton)
    expect(screen.getByText(/1 \/ \d+/)).toBeInTheDocument()
  })

  it('should disable previous button on first slide', () => {
    const onClose = vi.fn()
    render(<StoryModeOverlay data={mockData} onClose={onClose} />)
    
    const prevButton = screen.getByLabelText('Previous slide')
    expect(prevButton).toBeDisabled()
  })

  it('should close overlay when advancing past last slide', () => {
    const onClose = vi.fn()
    render(<StoryModeOverlay data={mockData} onClose={onClose} />)
    
    const nextButton = screen.getByLabelText('Next slide')
    
    // Click next repeatedly until we reach the last slide
    // Get the total number of slides from the counter
    const counterText = screen.getByText(/1 \/ (\d+)/)
    const totalSlides = parseInt(counterText.textContent?.match(/\d+$/)?.[0] || '0')
    
    // Navigate to the second-to-last slide
    for (let i = 1; i < totalSlides - 1; i++) {
      fireEvent.click(nextButton)
    }
    
    // Now we're on the second-to-last slide, click next to go to last slide
    fireEvent.click(nextButton)
    
    // Verify we're on the last slide
    expect(screen.getByText(new RegExp(`${totalSlides} \\/ ${totalSlides}`))).toBeInTheDocument()
    
    // Click next one more time - should close since we implemented close on last slide advance
    fireEvent.click(nextButton)
    
    // Should call onClose
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should handle keyboard navigation with arrow keys', () => {
    const onClose = vi.fn()
    const { container } = render(<StoryModeOverlay data={mockData} onClose={onClose} />)
    
    const overlay = container.firstChild as HTMLElement
    
    // Check initial slide
    expect(screen.getByText(/1 \/ \d+/)).toBeInTheDocument()
    
    // Press right arrow
    fireEvent.keyDown(overlay, { key: 'ArrowRight' })
    expect(screen.getByText(/2 \/ \d+/)).toBeInTheDocument()
    
    // Press left arrow
    fireEvent.keyDown(overlay, { key: 'ArrowLeft' })
    expect(screen.getByText(/1 \/ \d+/)).toBeInTheDocument()
  })

  it('should close overlay when Escape key is pressed', () => {
    const onClose = vi.fn()
    const { container } = render(<StoryModeOverlay data={mockData} onClose={onClose} />)
    
    const overlay = container.firstChild as HTMLElement
    
    // Press Escape
    fireEvent.keyDown(overlay, { key: 'Escape' })
    
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should change aspect ratio when aspect ratio buttons are clicked', () => {
    const onClose = vi.fn()
    const { container } = render(<StoryModeOverlay data={mockData} onClose={onClose} />)
    
    // Find and click 4:5 button
    const button45 = screen.getByLabelText('Set aspect ratio to 4:5')
    fireEvent.click(button45)
    
    // Check if data-ratio attribute changed
    const overlay = container.firstChild as HTMLElement
    expect(overlay.getAttribute('data-ratio')).toBe('4:5')
  })

  it('should change theme when theme buttons are clicked', () => {
    const onClose = vi.fn()
    render(<StoryModeOverlay data={mockData} onClose={onClose} />)
    
    // Find and click Club theme button
    const clubButton = screen.getByLabelText('Set theme to Club')
    fireEvent.click(clubButton)
    
    // Check if theme class is present
    expect(screen.getByRole('dialog')).toHaveClass('theme-club')
  })

  it('should include comparison slides when comparison data is available', () => {
    const onClose = vi.fn()
    render(<StoryModeOverlay data={mockDataWithComparison} onClose={onClose} />)
    
    // Get total slides count - should be more with comparison data
    const counterText = screen.getByText(/1 \/ (\d+)/)
    const totalSlides = parseInt(counterText.textContent?.match(/\d+$/)?.[0] || '0')
    
    // Should have more slides with comparison data (at least the base + 2 comparison slides)
    expect(totalSlides).toBeGreaterThanOrEqual(7)
  })

  it('should have proper ARIA attributes for accessibility', () => {
    const onClose = vi.fn()
    render(<StoryModeOverlay data={mockData} onClose={onClose} />)
    
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-label', 'Story Mode')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('should call downloadSlide when download button is clicked', () => {
    const onClose = vi.fn()
    render(<StoryModeOverlay data={mockData} onClose={onClose} />)
    
    const downloadButton = screen.getByLabelText('Download slide')
    fireEvent.click(downloadButton)
    
    expect(mockDownloadSlide).toHaveBeenCalledTimes(1)
    // Should use descriptive filename for opener slide
    expect(mockDownloadSlide).toHaveBeenCalledWith(expect.any(HTMLElement), 'opener-2024.png')
  })
})
