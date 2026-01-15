import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { StorySlide } from './StorySlide'

describe('StorySlide', () => {
  it('renders children correctly', () => {
    const { container } = render(
      <StorySlide>
        <div>Test Content</div>
      </StorySlide>
    )
    expect(container.textContent).toContain('Test Content')
  })

  it('applies default theme when no theme prop is provided', () => {
    const { container } = render(
      <StorySlide>
        <div>Test Content</div>
      </StorySlide>
    )
    const slideContainer = container.querySelector('.slide-container')
    expect(slideContainer).toHaveClass('theme-pastel')
  })

  it('applies the pastel theme correctly', () => {
    const { container } = render(
      <StorySlide theme="theme-pastel">
        <div>Test Content</div>
      </StorySlide>
    )
    const slideContainer = container.querySelector('.slide-container')
    expect(slideContainer).toHaveClass('theme-pastel')
  })

  it('applies the club theme correctly', () => {
    const { container } = render(
      <StorySlide theme="theme-club">
        <div>Test Content</div>
      </StorySlide>
    )
    const slideContainer = container.querySelector('.slide-container')
    expect(slideContainer).toHaveClass('theme-club')
  })

  it('applies the clean theme correctly', () => {
    const { container } = render(
      <StorySlide theme="theme-clean">
        <div>Test Content</div>
      </StorySlide>
    )
    const slideContainer = container.querySelector('.slide-container')
    expect(slideContainer).toHaveClass('theme-clean')
  })

  it('applies the dark theme correctly', () => {
    const { container } = render(
      <StorySlide theme="theme-dark">
        <div>Test Content</div>
      </StorySlide>
    )
    const slideContainer = container.querySelector('.slide-container')
    expect(slideContainer).toHaveClass('theme-dark')
  })

  it('applies the correct aspect ratio height for 9:16', () => {
    const { container } = render(
      <StorySlide aspectRatio="9:16">
        <div>Test Content</div>
      </StorySlide>
    )
    const slideContainer = container.querySelector('.slide-container')
    expect(slideContainer).toHaveStyle({ height: '640px' })
  })

  it('applies the correct aspect ratio height for 4:5', () => {
    const { container } = render(
      <StorySlide aspectRatio="4:5">
        <div>Test Content</div>
      </StorySlide>
    )
    const slideContainer = container.querySelector('.slide-container')
    expect(slideContainer).toHaveStyle({ height: '450px' })
  })

  it('applies the correct aspect ratio height for 1:1', () => {
    const { container } = render(
      <StorySlide aspectRatio="1:1">
        <div>Test Content</div>
      </StorySlide>
    )
    const slideContainer = container.querySelector('.slide-container')
    expect(slideContainer).toHaveStyle({ height: '360px' })
  })

  it('sets the data-ratio attribute correctly', () => {
    const { container } = render(
      <StorySlide aspectRatio="4:5">
        <div>Test Content</div>
      </StorySlide>
    )
    const slideContainer = container.querySelector('.slide-container')
    expect(slideContainer).toHaveAttribute('data-ratio', '4:5')
  })

  it('allows custom className to be added', () => {
    const { container } = render(
      <StorySlide className="custom-class">
        <div>Test Content</div>
      </StorySlide>
    )
    const slideContainer = container.querySelector('.slide-container')
    expect(slideContainer).toHaveClass('custom-class')
  })

  it('combines theme and custom className correctly', () => {
    const { container } = render(
      <StorySlide theme="theme-club" className="custom-class">
        <div>Test Content</div>
      </StorySlide>
    )
    const slideContainer = container.querySelector('.slide-container')
    expect(slideContainer).toHaveClass('theme-club')
    expect(slideContainer).toHaveClass('custom-class')
  })
})
