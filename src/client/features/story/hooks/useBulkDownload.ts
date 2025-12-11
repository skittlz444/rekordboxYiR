import { useCallback } from 'react'
import { toPng } from 'html-to-image'
import download from 'downloadjs'
import { toast } from '@/client/components/ui/use-toast'

export type AspectRatio = '9:16' | '4:5' | '1:1'
export type Theme = 'theme-pastel' | 'theme-club' | 'theme-clean' | 'theme-dark'

export interface BulkDownloadOptions {
  allSizes: boolean
  allThemes: boolean
  currentSize: AspectRatio
  currentTheme: Theme
}

export function useBulkDownload() {
  const downloadSlide = useCallback(async (node: HTMLElement) => {
    const dataUrl = await toPng(node, {
      pixelRatio: 3,
      cacheBust: true,
    })
    return dataUrl
  }, [])

  const bulkDownload = useCallback(async (
    slideRefs: { name: string; ref: HTMLElement | null }[],
    options: BulkDownloadOptions
  ) => {
    const { allSizes, allThemes, currentSize, currentTheme } = options
    
    // Determine which sizes and themes to use
    const sizes: AspectRatio[] = allSizes 
      ? ['9:16', '4:5', '1:1'] 
      : [currentSize]
    
    const themes: Theme[] = allThemes 
      ? ['theme-pastel', 'theme-club', 'theme-clean', 'theme-dark'] 
      : [currentTheme]

    const totalSlides = slideRefs.length * sizes.length * themes.length

    try {
      toast({
        title: 'Starting bulk download...',
        description: `Preparing ${totalSlides} slides. This may take a few moments.`,
      })

      let processedCount = 0

      for (const size of sizes) {
        for (const theme of themes) {
          for (const slideRef of slideRefs) {
            if (slideRef.ref) {
              // Temporarily change the slide's aspect ratio and theme
              const originalDataRatio = slideRef.ref.getAttribute('data-ratio')
              const container = slideRef.ref.closest(`[class*="theme-"]`)
              const originalTheme = container?.className.match(/theme-\w+/)?.[0]

              // Apply new ratio and theme
              slideRef.ref.setAttribute('data-ratio', size)
              if (container) {
                container.className = container.className.replace(/theme-\w+/, theme)
              }

              // Wait for any CSS transitions
              await new Promise(resolve => setTimeout(resolve, 100))

              // Capture and download the slide
              const dataUrl = await downloadSlide(slideRef.ref)
              
              // Create filename with size and theme info if multiple variants
              const sizeLabel = allSizes ? size.replace(':', 'x') : ''
              const themeLabel = allThemes ? theme.replace('theme-', '') : ''
              const prefix = [sizeLabel, themeLabel].filter(Boolean).join('_')
              const filename = prefix ? `${prefix}_${slideRef.name}.png` : `${slideRef.name}.png`
              
              download(dataUrl, filename)

              // Restore original ratio and theme
              if (originalDataRatio) {
                slideRef.ref.setAttribute('data-ratio', originalDataRatio)
              }
              if (container && originalTheme) {
                container.className = container.className.replace(/theme-\w+/, originalTheme)
              }

              processedCount++
              
              // Add a small delay between downloads to avoid browser throttling
              await new Promise(resolve => setTimeout(resolve, 300))
            }
          }
        }
      }

      toast({
        title: 'Download complete!',
        description: `Successfully downloaded ${processedCount} slides`,
      })
    } catch (error) {
      console.error('Failed to download slides:', error)
      toast({
        variant: 'destructive',
        title: 'Bulk download failed',
        description: 'Unable to download slides. Please try again.',
      })
    }
  }, [downloadSlide])

  return { bulkDownload }
}
