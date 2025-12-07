import { describe, it, expect, beforeEach } from 'vitest'
import { useConfigStore } from './store'

describe('Configuration Store', () => {
  beforeEach(() => {
    // Reset the store before each test
    useConfigStore.getState().resetToDefaults()
  })

  it('should initialize with default values', () => {
    const state = useConfigStore.getState()
    const currentYear = new Date().getFullYear()
    
    expect(state.targetYear).toBe(currentYear)
    expect(state.comparisonYear).toBe(currentYear - 1)
    expect(state.djName).toBe('')
    expect(state.unknownArtistFilter).toBe(false)
    expect(state.unknownGenreFilter).toBe(false)
    expect(state.disableGenresInTrends).toBe(false)
    expect(state.averageTrackPlayedPercent).toBe(0.75)
  })

  it('should update target year', () => {
    const { setTargetYear } = useConfigStore.getState()
    setTargetYear(2023)
    expect(useConfigStore.getState().targetYear).toBe(2023)
  })

  it('should update comparison year', () => {
    const { setComparisonYear } = useConfigStore.getState()
    setComparisonYear(2022)
    expect(useConfigStore.getState().comparisonYear).toBe(2022)
  })

  it('should allow null comparison year', () => {
    const { setComparisonYear } = useConfigStore.getState()
    setComparisonYear(null)
    expect(useConfigStore.getState().comparisonYear).toBeNull()
  })

  it('should update DJ name', () => {
    const { setDjName } = useConfigStore.getState()
    setDjName('DJ Test')
    expect(useConfigStore.getState().djName).toBe('DJ Test')
  })

  it('should toggle unknown artist filter', () => {
    const { setUnknownArtistFilter } = useConfigStore.getState()
    setUnknownArtistFilter(true)
    expect(useConfigStore.getState().unknownArtistFilter).toBe(true)
    setUnknownArtistFilter(false)
    expect(useConfigStore.getState().unknownArtistFilter).toBe(false)
  })

  it('should toggle unknown genre filter', () => {
    const { setUnknownGenreFilter } = useConfigStore.getState()
    setUnknownGenreFilter(true)
    expect(useConfigStore.getState().unknownGenreFilter).toBe(true)
    setUnknownGenreFilter(false)
    expect(useConfigStore.getState().unknownGenreFilter).toBe(false)
  })

  it('should toggle disable genres in trends', () => {
    const { setDisableGenresInTrends } = useConfigStore.getState()
    setDisableGenresInTrends(true)
    expect(useConfigStore.getState().disableGenresInTrends).toBe(true)
    setDisableGenresInTrends(false)
    expect(useConfigStore.getState().disableGenresInTrends).toBe(false)
  })

  it('should update average track played percent', () => {
    const { setAverageTrackPlayedPercent } = useConfigStore.getState()
    setAverageTrackPlayedPercent(0.85)
    expect(useConfigStore.getState().averageTrackPlayedPercent).toBe(0.85)
  })

  it('should reset to defaults', () => {
    const currentYear = new Date().getFullYear()
    const store = useConfigStore.getState()
    
    // Change all values
    store.setTargetYear(2020)
    store.setComparisonYear(2019)
    store.setDjName('Test')
    store.setUnknownArtistFilter(true)
    store.setUnknownGenreFilter(true)
    store.setDisableGenresInTrends(true)
    store.setAverageTrackPlayedPercent(0.5)
    
    // Reset to defaults
    store.resetToDefaults()
    
    const state = useConfigStore.getState()
    expect(state.targetYear).toBe(currentYear)
    expect(state.comparisonYear).toBe(currentYear - 1)
    expect(state.djName).toBe('')
    expect(state.unknownArtistFilter).toBe(false)
    expect(state.unknownGenreFilter).toBe(false)
    expect(state.disableGenresInTrends).toBe(false)
    expect(state.averageTrackPlayedPercent).toBe(0.75)
  })
})
