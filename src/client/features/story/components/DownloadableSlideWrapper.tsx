import { useRef, forwardRef, useImperativeHandle } from 'react'
import { Button } from '@/client/components/ui/button'
import { Download } from 'lucide-react'
import { useSlideDownload } from '../hooks/useSlideDownload'

interface DownloadableSlideWrapperProps {
  children: React.ReactNode
  filename: string
}

export const DownloadableSlideWrapper = forwardRef<HTMLDivElement, DownloadableSlideWrapperProps>(
  ({ children, filename }, externalRef) => {
    const internalRef = useRef<HTMLDivElement>(null)
    const { downloadSlide } = useSlideDownload()

    // Properly expose the ref to parent using useImperativeHandle
    useImperativeHandle(externalRef, () => internalRef.current as HTMLDivElement, [])

    const handleDownload = () => {
      if (internalRef.current?.firstElementChild) {
        // Target the first child which is the StorySlide component's div
        downloadSlide(internalRef.current.firstElementChild as HTMLElement, filename)
      }
    }

    return (
      <div className="flex flex-col items-center gap-2">
        <div ref={internalRef}>
          {children}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          aria-label={`Download ${filename}`}
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    )
  }
)

DownloadableSlideWrapper.displayName = 'DownloadableSlideWrapper'
