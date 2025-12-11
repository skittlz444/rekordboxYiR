import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useBulkDownload } from './useBulkDownload'

// Mock dependencies
vi.mock('html-to-image', () => ({
  toPng: vi.fn(() => Promise.resolve('data:image/png;base64,mockdata')),
}))

vi.mock('downloadjs', () => ({
  default: vi.fn(),
}))

vi.mock('@/client/components/ui/use-toast', () => ({
  toast: vi.fn(),
}))

describe('useBulkDownload', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return bulkDownload function', () => {
    const { result } = renderHook(() => useBulkDownload())
    expect(result.current.bulkDownload).toBeDefined()
    expect(typeof result.current.bulkDownload).toBe('function')
  })

  it('should handle bulk download with current size and theme', async () => {
    const { result } = renderHook(() => useBulkDownload())
    
    const mockDiv = document.createElement('div')
    mockDiv.setAttribute('data-ratio', '9:16')
    
    const slideRefs = [
      { name: 'slide1', ref: mockDiv },
      { name: 'slide2', ref: mockDiv },
    ]

    const options = {
      allSizes: false,
      allThemes: false,
      currentSize: '9:16' as const,
      currentTheme: 'theme-pastel' as const,
    }

    await result.current.bulkDownload(slideRefs, options)

    const { toast } = await import('@/client/components/ui/use-toast')
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Starting bulk download...',
        })
      )
    })
  })

  it('should handle errors gracefully', async () => {
    const { result } = renderHook(() => useBulkDownload())
    
    const slideRefs = [
      { name: 'slide1', ref: null },
    ]

    const options = {
      allSizes: false,
      allThemes: false,
      currentSize: '9:16' as const,
      currentTheme: 'theme-pastel' as const,
    }

    await result.current.bulkDownload(slideRefs, options)

    const { toast } = await import('@/client/components/ui/use-toast')
    await waitFor(() => {
      expect(toast).toHaveBeenCalled()
    })
  })
})
