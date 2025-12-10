// import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OpenerSlide } from './OpenerSlide'

describe('OpenerSlide', () => {
  it('renders the year correctly', () => {
    render(<OpenerSlide year="2025" />)
    expect(screen.getByText('2025')).toBeInTheDocument()
  })

  it('renders the DJ name correctly', () => {
    render(<OpenerSlide year="2025" djName="DJ SKITTLZ" />)
    expect(screen.getByText('DJ SKITTLZ')).toBeInTheDocument()
  })

  it('renders with default DJ name when not provided', () => {
    render(<OpenerSlide year="2025" />)
    expect(screen.getByText('DJ')).toBeInTheDocument()
  })

  it('renders REKORDBOX branding', () => {
    render(<OpenerSlide year="2025" />)
    expect(screen.getByText('REKORDBOX')).toBeInTheDocument()
  })

  it('renders the main title', () => {
    render(<OpenerSlide year="2025" />)
    expect(screen.getByText(/YOUR/i)).toBeInTheDocument()
    expect(screen.getByText(/IN MUSIC/i)).toBeInTheDocument()
  })
})
