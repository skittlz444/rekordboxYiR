// import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSlideDownload } from './useSlideDownload'
import * as htmlToImage from 'html-to-image'
import download from 'downloadjs'

// Mock dependencies
vi.mock('html-to-image', () => ({
  toPng: vi.fn(),
}))

vi.mock('downloadjs', () => ({
  default: vi.fn(),
}))

describe('useSlideDownload', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should download slide as png', async () => {
    const mockDataUrl = 'data:image/png;base64,fake-data'
    const mockNode = document.createElement('div')
    const filename = 'test-slide.png'

    // Setup mock return value
    vi.mocked(htmlToImage.toPng).mockResolvedValue(mockDataUrl)

    const { result } = renderHook(() => useSlideDownload())

    await result.current.downloadSlide(mockNode, filename)

    // Verify html-to-image was called with correct params
    expect(htmlToImage.toPng).toHaveBeenCalledWith(mockNode, {
      pixelRatio: 3,
      cacheBust: true,
    })

    // Verify downloadjs was called with correct params
    expect(download).toHaveBeenCalledWith(mockDataUrl, filename)
  })

  it('should handle errors gracefully', async () => {
    const mockNode = document.createElement('div')
    const filename = 'test-slide.png'
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

    // Setup mock to reject
    vi.mocked(htmlToImage.toPng).mockRejectedValue(new Error('Failed to generate image'))

    const { result } = renderHook(() => useSlideDownload())

    await result.current.downloadSlide(mockNode, filename)

    expect(consoleSpy).toHaveBeenCalledWith('Failed to download slide:', expect.any(Error))
    expect(download).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })
})
