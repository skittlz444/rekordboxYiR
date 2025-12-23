import { useCallback } from 'react'
import { toPng } from 'html-to-image'
import download from 'downloadjs'
import { toast } from '@/client/components/ui/use-toast'
import JSZip from 'jszip'

export type AspectRatio = '9:16' | '4:5' | '1:1'
export type Theme = 'theme-pastel' | 'theme-club' | 'theme-clean' | 'theme-dark'

export interface BulkDownloadOptions {
  allSizes: boolean
  allThemes: boolean
  currentSize: AspectRatio
  currentTheme: Theme
}

// Map aspect ratios to their height values (must match StorySlide.tsx)
const ASPECT_RATIO_HEIGHTS: Record<AspectRatio, string> = {
  '9:16': '640px',
  '4:5': '450px',
  '1:1': '360px',
}

interface SlideState {
  ref: HTMLElement
  originalDataRatio: string | null
  originalHeight: string
  container: Element | null
  originalTheme: string | undefined
}

export function useBulkDownload() {
  const downloadSlide = useCallback(async (node: HTMLElement) => {
    const dataUrl = await toPng(node, {
      pixelRatio: 3,
      cacheBust: true,
    })
    return dataUrl
  }, [])

  const waitForTransition = useCallback((element: HTMLElement): Promise<void> => {
    return new Promise((resolve) => {
      const transitionDuration = window.getComputedStyle(element).transitionDuration
      const duration = parseFloat(transitionDuration) * 1000 || 200 // Default 200ms if no transition
      
      const handleTransitionEnd = () => {
        element.removeEventListener('transitionend', handleTransitionEnd)
        resolve()
      }
      
      element.addEventListener('transitionend', handleTransitionEnd)
      
      // Fallback timeout slightly longer than transition duration
      setTimeout(() => {
        element.removeEventListener('transitionend', handleTransitionEnd)
        resolve()
      }, duration + 100)
    })
  }, [])

  const applySlideState = useCallback(async (
    slideRef: HTMLElement,
    size: AspectRatio,
    theme: Theme
  ): Promise<SlideState> => {
    // Store original state
    const originalDataRatio = slideRef.getAttribute('data-ratio')
    const originalHeight = slideRef.style.height
    const container = slideRef.closest('[data-theme-container]') || slideRef.closest('div[class*="theme-"]')
    const originalTheme = container?.getAttribute('data-theme') || container?.className.match(/theme-\w+/)?.[0]

    // Apply new ratio and height
    slideRef.setAttribute('data-ratio', size)
    slideRef.style.height = ASPECT_RATIO_HEIGHTS[size]

    // Apply new theme
    if (container) {
      if (container.hasAttribute('data-theme')) {
        container.setAttribute('data-theme', theme)
      }
      // More robust theme class replacement
      const classList = Array.from(container.classList)
      const newClassList = classList.filter(c => !c.startsWith('theme-'))
      newClassList.push(theme)
      container.className = newClassList.join(' ')
    }

    // Wait for transitions to complete
    await waitForTransition(slideRef)

    return {
      ref: slideRef,
      originalDataRatio,
      originalHeight,
      container,
      originalTheme,
    }
  }, [waitForTransition])

  const restoreSlideState = useCallback((state: SlideState) => {
    const { ref, originalDataRatio, originalHeight, container, originalTheme } = state

    if (originalDataRatio) {
      ref.setAttribute('data-ratio', originalDataRatio)
    }
    ref.style.height = originalHeight

    if (container && originalTheme) {
      if (container.hasAttribute('data-theme')) {
        container.setAttribute('data-theme', originalTheme)
      }
      const classList = Array.from(container.classList)
      const newClassList = classList.filter(c => !c.startsWith('theme-'))
      newClassList.push(originalTheme)
      container.className = newClassList.join(' ')
    }
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
    const shouldZip = totalSlides > slideRefs.length // More than one variant per slide

    let zip: JSZip | null = null
    if (shouldZip) {
      zip = new JSZip()
    }

    const stateStack: SlideState[] = []

    try {
      toast({
        title: 'Starting bulk download...',
        description: shouldZip 
          ? `Preparing ${totalSlides} slides for zip file. This may take a few moments.`
          : `Preparing ${totalSlides} slides. This may take a few moments.`,
      })

      let processedCount = 0

      for (const size of sizes) {
        for (const theme of themes) {
          for (const slideRef of slideRefs) {
            if (!slideRef.ref) continue

            let state: SlideState | null = null

            try {
              // Apply new state and capture
              state = await applySlideState(slideRef.ref, size, theme)
              stateStack.push(state)

              const dataUrl = await downloadSlide(slideRef.ref)
              
              // Create filename with size and theme info if multiple variants
              const sizeLabel = allSizes ? size.replace(':', 'x') : ''
              const themeLabel = allThemes ? theme.replace('theme-', '') : ''
              const prefix = [sizeLabel, themeLabel].filter(Boolean).join('_')
              const filename = prefix ? `${prefix}_${slideRef.name}.png` : `${slideRef.name}.png`
              
              if (zip) {
                // Add to zip file
                const base64Data = dataUrl.split(',')[1]
                zip.file(filename, base64Data, { base64: true })
              } else {
                // Direct download
                download(dataUrl, filename)
                // Small delay for single downloads
                await new Promise(resolve => setTimeout(resolve, 100))
              }

              processedCount++
            } catch (error) {
              console.error(`Failed to process slide ${slideRef.name}:`, error)
              // Continue with other slides
            } finally {
              // Restore state immediately after capture
              if (state) {
                restoreSlideState(state)
                stateStack.pop()
              }
            }
          }
        }
      }

      // Generate and download zip if needed
      if (zip) {
        toast({
          title: 'Creating zip file...',
          description: 'Compressing slides, this may take a moment.',
        })

        const blob = await zip.generateAsync({ type: 'blob' })
        const timestamp = new Date().toISOString().split('T')[0]
        download(blob, `rekordbox-slides-${timestamp}.zip`, 'application/zip')
      }

      toast({
        title: 'Download complete!',
        description: shouldZip 
          ? `Successfully downloaded ${processedCount} slides in a zip file`
          : `Successfully downloaded ${processedCount} slides`,
      })
    } catch (error) {
      console.error('Failed to download slides:', error)
      toast({
        variant: 'destructive',
        title: 'Bulk download failed',
        description: error instanceof Error ? error.message : 'Unable to download slides. Please try again.',
      })
    } finally {
      // Ensure all states are restored even if there was an error
      while (stateStack.length > 0) {
        const state = stateStack.pop()
        if (state) {
          restoreSlideState(state)
        }
      }
    }
  }, [downloadSlide, applySlideState, restoreSlideState])

  return { bulkDownload }
}
