import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { YearComparisonSlide, ComparisonMetric } from './YearComparisonSlide'

describe('YearComparisonSlide', () => {
  const mockMetrics: ComparisonMetric[] = [
    {
      label: 'Total Plays',
      current: 2451,
      previous: 1820,
      change: '+631',
      changePercentage: 34.7,
    },
    {
      label: 'Sessions',
      current: 42,
      previous: 35,
      change: '+7',
      changePercentage: 20.0,
    },
  ]

  it('renders the hashtag with comparison year', () => {
    render(<YearComparisonSlide comparisonYear="2024" metrics={mockMetrics} />)
    expect(screen.getByText('#VS2024')).toBeInTheDocument()
  })

  it('displays "LEVELING UP?" title for 2-3 metrics', () => {
    render(<YearComparisonSlide comparisonYear="2024" metrics={mockMetrics} />)
    expect(screen.getByText(/LEVELING/)).toBeInTheDocument()
    expect(screen.getByText(/UP\?/)).toBeInTheDocument()
  })

  it('displays "ONE BIG WIN" title for single metric', () => {
    const singleMetric = [mockMetrics[0]]
    render(<YearComparisonSlide comparisonYear="2024" metrics={singleMetric} />)
    expect(screen.getByText(/ONE BIG/)).toBeInTheDocument()
    expect(screen.getByText(/WIN/)).toBeInTheDocument()
  })

  it('displays "FULL GROWTH" title for 4+ metrics', () => {
    const fourMetrics: ComparisonMetric[] = [
      ...mockMetrics,
      {
        label: 'Library Size',
        current: 5000,
        previous: 4500,
        change: '+500',
        changePercentage: 11.1,
      },
      {
        label: 'Longest Session',
        current: '4.2 hrs',
        previous: '3.5 hrs',
        change: '+0.7 hrs',
        changePercentage: 20.0,
      },
    ]
    render(<YearComparisonSlide comparisonYear="2024" metrics={fourMetrics} />)
    expect(screen.getByText(/FULL/)).toBeInTheDocument()
    expect(screen.getByText(/GROWTH/)).toBeInTheDocument()
  })

  it('renders single metric layout correctly', () => {
    const singleMetric = [mockMetrics[0]]
    render(<YearComparisonSlide comparisonYear="2024" metrics={singleMetric} />)
    expect(screen.getByText('Total Plays')).toBeInTheDocument()
    expect(screen.getByText('2451')).toBeInTheDocument()
    expect(screen.getByText('+631')).toBeInTheDocument()
    expect(screen.getByText('vs 1820 in 2024')).toBeInTheDocument()
  })

  it('renders 2-3 metrics layout correctly', () => {
    render(<YearComparisonSlide comparisonYear="2024" metrics={mockMetrics} />)
    expect(screen.getByText('Total Plays')).toBeInTheDocument()
    expect(screen.getByText('2451')).toBeInTheDocument()
    expect(screen.getByText('+631')).toBeInTheDocument()
    expect(screen.getByText('Sessions')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('+7')).toBeInTheDocument()
  })

  it('renders 4 metrics in compact grid layout', () => {
    const fourMetrics: ComparisonMetric[] = [
      ...mockMetrics,
      {
        label: 'Library Size',
        current: 5000,
        previous: 4500,
        change: '+500',
        changePercentage: 11.1,
      },
      {
        label: 'Longest Session',
        current: '4.2 hrs',
        previous: '3.5 hrs',
        change: '+0.7 hrs',
        changePercentage: 20.0,
      },
    ]
    render(<YearComparisonSlide comparisonYear="2024" metrics={fourMetrics} />)
    expect(screen.getByText('Total Plays')).toBeInTheDocument()
    expect(screen.getByText('Sessions')).toBeInTheDocument()
    expect(screen.getByText('Library Size')).toBeInTheDocument()
    expect(screen.getByText('Longest Session')).toBeInTheDocument()
  })

  it('handles string values for current and previous', () => {
    const metricsWithStrings: ComparisonMetric[] = [
      {
        label: 'Longest Session',
        current: '4.2 hrs',
        previous: '3.5 hrs',
        change: '+0.7 hrs',
        changePercentage: 20.0,
      },
    ]
    render(<YearComparisonSlide comparisonYear="2024" metrics={metricsWithStrings} />)
    expect(screen.getByText('4.2 hrs')).toBeInTheDocument()
    expect(screen.getByText('vs 3.5 hrs in 2024')).toBeInTheDocument()
  })

  it('renders in different aspect ratios', () => {
    const { rerender } = render(
      <YearComparisonSlide comparisonYear="2024" metrics={mockMetrics} aspectRatio="9:16" />
    )
    expect(screen.getByText('Total Plays')).toBeInTheDocument()

    rerender(<YearComparisonSlide comparisonYear="2024" metrics={mockMetrics} aspectRatio="4:5" />)
    expect(screen.getByText('Total Plays')).toBeInTheDocument()

    rerender(<YearComparisonSlide comparisonYear="2024" metrics={mockMetrics} aspectRatio="1:1" />)
    expect(screen.getByText('Total Plays')).toBeInTheDocument()
  })
})
