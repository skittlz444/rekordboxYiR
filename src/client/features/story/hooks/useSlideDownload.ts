import { useCallback } from 'react'
import { toPng } from 'html-to-image'
import download from 'downloadjs'
import { toast } from '@/client/components/ui/use-toast'

export function useSlideDownload() {
  const downloadSlide = useCallback(async (node: HTMLElement, filename: string) => {
    try {
      // The slides are 360px wide. To get 1080px, we need 3x scale.
      const dataUrl = await toPng(node, {
        pixelRatio: 3,
        cacheBust: true,
      })
      download(dataUrl, filename)
    } catch (error) {
      console.error('Failed to download slide:', error)
      toast({
        variant: 'destructive',
        title: 'Download failed',
        description: 'Unable to download the slide. Please try again.',
      })
    }
  }, [])

  return { downloadSlide }
}
