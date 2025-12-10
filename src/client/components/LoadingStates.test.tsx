// import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Spinner } from './ui/spinner'
import { DashboardSkeleton, UploadLoadingOverlay } from './LoadingStates'

describe('Loading States Components', () => {
  describe('Spinner', () => {
    it('renders with default size', () => {
      const { container } = render(<Spinner />)
      const spinner = container.querySelector('div')
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('w-8', 'h-8')
    })

    it('renders with small size', () => {
      const { container } = render(<Spinner size="sm" />)
      const spinner = container.querySelector('div')
      expect(spinner).toHaveClass('w-4', 'h-4')
    })

    it('renders with large size', () => {
      const { container } = render(<Spinner size="lg" />)
      const spinner = container.querySelector('div')
      expect(spinner).toHaveClass('w-12', 'h-12')
    })

    it('applies custom className', () => {
      const { container } = render(<Spinner className="custom-class" />)
      const spinner = container.querySelector('div')
      expect(spinner).toHaveClass('custom-class')
    })
  })

  describe('DashboardSkeleton', () => {
    it('renders skeleton structure', () => {
      render(<DashboardSkeleton />)
      // Check for action buttons skeleton
      const buttons = screen.getAllByRole('generic').filter(el =>
        el.className.includes('h-10 w-32')
      )
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('UploadLoadingOverlay', () => {
    it('renders loading overlay with message', () => {
      render(<UploadLoadingOverlay />)
      expect(screen.getByText('Processing Your Database')).toBeInTheDocument()
      expect(screen.getByText(/Analyzing your Rekordbox library/)).toBeInTheDocument()
      expect(screen.getByText(/This may take a few moments/)).toBeInTheDocument()
    })
  })
})
