import { ReactNode } from 'react'

export type AspectRatio = '9:16' | '4:5' | '1:1'

export interface StorySlideProps {
  children: ReactNode
  aspectRatio?: AspectRatio
  className?: string
  dataRatio?: AspectRatio
}

const ASPECT_RATIO_HEIGHTS: Record<AspectRatio, string> = {
  '9:16': '640px',
  '4:5': '450px',
  '1:1': '360px',
}

export function StorySlide({
  children,
  aspectRatio = '9:16',
  className = '',
  dataRatio,
}: StorySlideProps) {
  const height = ASPECT_RATIO_HEIGHTS[aspectRatio]
  const ratio = dataRatio || aspectRatio

  return (
    <div
      className={`slide-container relative overflow-hidden w-[360px] ${className}`}
      style={{ height }}
      data-ratio={ratio}
    >
      {children}
    </div>
  )
}
