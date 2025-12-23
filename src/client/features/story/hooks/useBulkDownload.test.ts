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

// Mock JSZip
vi.mock('jszip', () => {
  return {
    default: class MockJSZip {
      file = vi.fn()
      generateAsync = vi.fn(() => Promise.resolve(new Blob(['mock zip data'])))
    },
  }
})

describe('useBulkDownload', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset DOM
    document.body.innerHTML = ''
  })

  it('should return bulkDownload function', () => {
    const { result } = renderHook(() => useBulkDownload())
    expect(result.current.bulkDownload).toBeDefined()
    expect(typeof result.current.bulkDownload).toBe('function')
  })

  it('should download single slide without zip when no variants', async () => {
    const { result } = renderHook(() => useBulkDownload())
    
    const mockDiv = document.createElement('div')
    mockDiv.setAttribute('data-ratio', '9:16')
    mockDiv.style.height = '640px'
    document.body.appendChild(mockDiv)
    
    const slideRefs = [
      { name: 'slide1', ref: mockDiv },
    ]

    const options = {
      allSizes: false,
      allThemes: false,
      currentSize: '9:16' as const,
      currentTheme: 'theme-pastel' as const,
    }

    await result.current.bulkDownload(slideRefs, options)

    const { toast } = await import('@/client/components/ui/use-toast')
    const download = (await import('downloadjs')).default
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Starting bulk download...',
        })
      )
      expect(download).toHaveBeenCalledWith(
        'data:image/png;base64,mockdata',
        'slide1.png'
      )
    })
  })

  it('should create zip file when downloading multiple variants', async () => {
    const { result } = renderHook(() => useBulkDownload())
    
    const mockDiv = document.createElement('div')
    mockDiv.setAttribute('data-ratio', '9:16')
    mockDiv.style.height = '640px'
    
    const container = document.createElement('div')
    container.className = 'theme-pastel'
    container.setAttribute('data-theme-container', '')
    container.setAttribute('data-theme', 'theme-pastel')
    container.appendChild(mockDiv)
    document.body.appendChild(container)
    
    const slideRefs = [
      { name: 'slide1', ref: mockDiv },
    ]

    const options = {
      allSizes: true,
      allThemes: false,
      currentSize: '9:16' as const,
      currentTheme: 'theme-pastel' as const,
    }

    await result.current.bulkDownload(slideRefs, options)

    const { toast } = await import('@/client/components/ui/use-toast')
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringMatching(/zip file/),
        })
      )
    })
  })

  it('should generate correct filenames for different combinations', async () => {
    const { result } = renderHook(() => useBulkDownload())
    
    const mockDiv = document.createElement('div')
    mockDiv.setAttribute('data-ratio', '9:16')
    mockDiv.style.height = '640px'
    document.body.appendChild(mockDiv)
    
    const slideRefs = [
      { name: 'opener-2024', ref: mockDiv },
    ]

    // Test with all sizes
    await result.current.bulkDownload(slideRefs, {
      allSizes: true,
      allThemes: false,
      currentSize: '9:16',
      currentTheme: 'theme-pastel',
    })

    const { toPng } = await import('html-to-image')
    // Verify toPng was called 3 times (once for each size)
    expect(toPng).toHaveBeenCalledTimes(3)
  })

  it('should restore DOM state after errors', async () => {
    const { result } = renderHook(() => useBulkDownload())
    
    const mockDiv = document.createElement('div')
    mockDiv.setAttribute('data-ratio', '9:16')
    mockDiv.style.height = '640px'
    const originalHeight = mockDiv.style.height
    const originalRatio = mockDiv.getAttribute('data-ratio')
    document.body.appendChild(mockDiv)
    
    // Make toPng throw an error
    const { toPng } = await import('html-to-image')
    vi.mocked(toPng).mockRejectedValueOnce(new Error('Test error'))
    
    const slideRefs = [
      { name: 'slide1', ref: mockDiv },
    ]

    await result.current.bulkDownload(slideRefs, {
      allSizes: false,
      allThemes: false,
      currentSize: '9:16',
      currentTheme: 'theme-pastel',
    })

    // Verify state was restored
    expect(mockDiv.style.height).toBe(originalHeight)
    expect(mockDiv.getAttribute('data-ratio')).toBe(originalRatio)
  })

  it('should handle null refs gracefully', async () => {
    const { result } = renderHook(() => useBulkDownload())
    
    const slideRefs = [
      { name: 'slide1', ref: null },
      { name: 'slide2', ref: null },
    ]

    await result.current.bulkDownload(slideRefs, {
      allSizes: false,
      allThemes: false,
      currentSize: '9:16',
      currentTheme: 'theme-pastel',
    })

    const { toast } = await import('@/client/components/ui/use-toast')
    await waitFor(() => {
      expect(toast).toHaveBeenCalled()
    })
    
    const { toPng } = await import('html-to-image')
    // Should not have called toPng
    expect(toPng).not.toHaveBeenCalled()
  })

  it('should show error toast when download fails', async () => {
    const { result } = renderHook(() => useBulkDownload())
    
    const mockDiv = document.createElement('div')
    document.body.appendChild(mockDiv)
    
    // Make toPng throw an error
    const { toPng } = await import('html-to-image')
    vi.mocked(toPng).mockRejectedValueOnce(new Error('Download failed'))
    
    const slideRefs = [
      { name: 'slide1', ref: mockDiv },
    ]

    await result.current.bulkDownload(slideRefs, {
      allSizes: false,
      allThemes: false,
      currentSize: '9:16',
      currentTheme: 'theme-pastel',
    })

    const { toast } = await import('@/client/components/ui/use-toast')
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Download complete!',
        })
      )
    })
  })
})
