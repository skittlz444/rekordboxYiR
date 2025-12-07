import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ConfigurationState {
  // Year configuration
  targetYear: number
  comparisonYear: number | null
  
  // User preferences
  djName: string
  
  // Trend slide configuration
  disableGenresInTrends: boolean
  
  // Playtime estimation
  averageTrackPlayedPercent: number
  
  // Actions
  setTargetYear: (year: number) => void
  setComparisonYear: (year: number | null) => void
  setDjName: (name: string) => void
  setDisableGenresInTrends: (value: boolean) => void
  setAverageTrackPlayedPercent: (value: number) => void
  resetToDefaults: () => void
}

const currentYear = new Date().getFullYear()

const defaultState = {
  targetYear: currentYear,
  comparisonYear: currentYear - 1,
  djName: '',
  disableGenresInTrends: false,
  averageTrackPlayedPercent: 0.75,
}

export const useConfigStore = create<ConfigurationState>()(
  persist(
    (set) => ({
      ...defaultState,
      
      setTargetYear: (year) => set({ targetYear: year }),
      setComparisonYear: (year) => set({ comparisonYear: year }),
      setDjName: (name) => set({ djName: name }),
      setDisableGenresInTrends: (value) => set({ disableGenresInTrends: value }),
      setAverageTrackPlayedPercent: (value) => set({ averageTrackPlayedPercent: value }),
      resetToDefaults: () => set(defaultState),
    }),
    {
      name: 'rekordbox-yir-config',
    }
  )
)
