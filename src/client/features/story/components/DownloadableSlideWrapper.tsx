import { useRef } from 'react'
import { Button } from '@/client/components/ui/button'
import { Download } from 'lucide-react'
import { useSlideDownload } from '../hooks/useSlideDownload'

interface DownloadableSlideWrapperProps {
  children: React.ReactNode
  filename: string
}

export function DownloadableSlideWrapper({ children, filename }: DownloadableSlideWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { downloadSlide } = useSlideDownload()

  const handleDownload = () => {
    if (ref.current?.firstElementChild) {
      // Target the first child which is the StorySlide component's div
      downloadSlide(ref.current.firstElementChild as HTMLElement, filename)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div ref={ref}>
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
