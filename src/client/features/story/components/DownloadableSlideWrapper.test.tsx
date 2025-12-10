// import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DownloadableSlideWrapper } from './DownloadableSlideWrapper'

// Mock the hook
const mockDownloadSlide = vi.fn()
vi.mock('../hooks/useSlideDownload', () => ({
  useSlideDownload: () => ({
    downloadSlide: mockDownloadSlide,
  }),
}))

describe('DownloadableSlideWrapper', () => {
  it('should render children and download button', () => {
    render(
      <DownloadableSlideWrapper filename="test.png">
        <div data-testid="slide-content">Slide Content</div>
      </DownloadableSlideWrapper>
    )

    expect(screen.getByTestId('slide-content')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument()
  })

  it('should call downloadSlide when button is clicked', () => {
    render(
      <DownloadableSlideWrapper filename="test.png">
        <div data-testid="slide-content">Slide Content</div>
      </DownloadableSlideWrapper>
    )

    const button = screen.getByRole('button', { name: /download/i })
    fireEvent.click(button)

    expect(mockDownloadSlide).toHaveBeenCalledTimes(1)
    // The first argument is the DOM node, second is filename
    expect(mockDownloadSlide).toHaveBeenCalledWith(expect.any(HTMLElement), 'test.png')
  })
})
