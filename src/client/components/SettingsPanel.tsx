import { Label } from '@/client/components/ui/label'
import { Input } from '@/client/components/ui/input'
import { Switch } from '@/client/components/ui/switch'
import { useConfigStore } from '@/client/lib/store'

interface SettingsPanelProps {
  className?: string
}

export function SettingsPanel({ className = '' }: SettingsPanelProps) {
  const targetYear = useConfigStore((state) => state.targetYear)
  const comparisonYear = useConfigStore((state) => state.comparisonYear)
  const djName = useConfigStore((state) => state.djName)
  const averageTrackPlayedPercent = useConfigStore((state) => state.averageTrackPlayedPercent)
  const disableGenresInTrends = useConfigStore((state) => state.disableGenresInTrends)
  
  const setTargetYear = useConfigStore((state) => state.setTargetYear)
  const setComparisonYear = useConfigStore((state) => state.setComparisonYear)
  const setDjName = useConfigStore((state) => state.setDjName)
  const setAverageTrackPlayedPercent = useConfigStore((state) => state.setAverageTrackPlayedPercent)
  const setDisableGenresInTrends = useConfigStore((state) => state.setDisableGenresInTrends)

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="settings-djName">DJ Name</Label>
        <Input
          id="settings-djName"
          type="text"
          value={djName}
          onChange={(e) => setDjName(e.target.value)}
          placeholder="Enter your DJ name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="settings-year">Target Year</Label>
          <Input
            id="settings-year"
            type="number"
            value={targetYear}
            onChange={(e) => setTargetYear(parseInt(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="settings-comparisonYear">Comparison Year</Label>
          <Input
            id="settings-comparisonYear"
            type="number"
            value={comparisonYear || ''}
            onChange={(e) => setComparisonYear(e.target.value ? parseInt(e.target.value) : null)}
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="settings-averageTrackPercent">Average Track Played %</Label>
        <Input
          id="settings-averageTrackPercent"
          type="number"
          step="0.05"
          min="0"
          max="1"
          value={averageTrackPlayedPercent}
          onChange={(e) => setAverageTrackPlayedPercent(parseFloat(e.target.value))}
        />
        <p className="text-xs text-muted-foreground">
          Adjust how much of each track is played on average (default: 0.75 = 75%)
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="settings-disableGenres" className="cursor-pointer">
            Hide Genres in Trends Slide
          </Label>
          <Switch
            id="settings-disableGenres"
            checked={disableGenresInTrends}
            onCheckedChange={setDisableGenresInTrends}
          />
        </div>
      </div>
    </div>
  )
}
