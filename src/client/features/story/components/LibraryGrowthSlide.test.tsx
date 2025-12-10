// import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LibraryGrowthSlide } from './LibraryGrowthSlide'

describe('LibraryGrowthSlide', () => {
  it('renders the hashtag correctly', () => {
    render(<LibraryGrowthSlide newTracks={250} totalLibrarySize={5000} />)
    expect(screen.getByText('#LIBRARY')).toBeInTheDocument()
  })

  it('displays positive growth correctly', () => {
    render(<LibraryGrowthSlide newTracks={250} totalLibrarySize={5000} />)
    expect(screen.getByText(/THE/)).toBeInTheDocument()
    expect(screen.getByText(/COLLECTION/)).toBeInTheDocument()
    expect(screen.getByText(/GREW/)).toBeInTheDocument()
    expect(screen.getByText('New Tracks Added')).toBeInTheDocument()
    expect(screen.getByText('250')).toBeInTheDocument()
  })

  it('displays negative growth correctly', () => {
    render(<LibraryGrowthSlide newTracks={-50} totalLibrarySize={4950} />)
    expect(screen.getByText(/CLEANED/)).toBeInTheDocument()
    expect(screen.getByText(/UP/)).toBeInTheDocument()
    expect(screen.getByText('Tracks Removed')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
  })

  it('displays total library size correctly', () => {
    render(<LibraryGrowthSlide newTracks={250} totalLibrarySize={5000} />)
    expect(screen.getByText('5,000')).toBeInTheDocument()
    expect(screen.getByText('Total Library Size')).toBeInTheDocument()
  })

  it('calculates tracks per day correctly for positive growth', () => {
    render(<LibraryGrowthSlide newTracks={365} totalLibrarySize={5000} />)
    expect(screen.getByText("That's 1.0 tracks per day!")).toBeInTheDocument()
  })

  it('displays cleanup message for negative growth', () => {
    render(<LibraryGrowthSlide newTracks={-100} totalLibrarySize={4900} />)
    expect(screen.getByText('Time to refresh your sound')).toBeInTheDocument()
  })

  it('handles zero growth', () => {
    render(<LibraryGrowthSlide newTracks={0} totalLibrarySize={5000} />)
    // Zero is technically "not growth", so it should show the cleaned up message
    expect(screen.getByText('Tracks Removed')).toBeInTheDocument()
  })

  it('renders in different aspect ratios', () => {
    const { rerender } = render(<LibraryGrowthSlide newTracks={250} totalLibrarySize={5000} aspectRatio="9:16" />)
    expect(screen.getByText('250')).toBeInTheDocument()

    rerender(<LibraryGrowthSlide newTracks={250} totalLibrarySize={5000} aspectRatio="4:5" />)
    expect(screen.getByText('250')).toBeInTheDocument()

    rerender(<LibraryGrowthSlide newTracks={250} totalLibrarySize={5000} aspectRatio="1:1" />)
    expect(screen.getByText('250')).toBeInTheDocument()
  })
})
