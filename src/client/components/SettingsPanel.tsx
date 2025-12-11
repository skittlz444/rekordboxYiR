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
  const logo = useConfigStore((state) => state.logo)
  const averageTrackPlayedPercent = useConfigStore((state) => state.averageTrackPlayedPercent)
  const disableGenresInTrends = useConfigStore((state) => state.disableGenresInTrends)

  const setTargetYear = useConfigStore((state) => state.setTargetYear)
  const setComparisonYear = useConfigStore((state) => state.setComparisonYear)
  const setDjName = useConfigStore((state) => state.setDjName)
  const setLogo = useConfigStore((state) => state.setLogo)
  const setAverageTrackPlayedPercent = useConfigStore((state) => state.setAverageTrackPlayedPercent)
  const setDisableGenresInTrends = useConfigStore((state) => state.setDisableGenresInTrends)

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-4">
        <Label htmlFor="settings-djName">Identity</Label>
        <div className="flex gap-2">
          <Input
            id="settings-djName"
            type="text"
            value={djName}
            onChange={(e) => setDjName(e.target.value)}
            placeholder="Enter your DJ name"
            className="flex-1"
          />
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="logo-upload"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (event) => {
                    const result = event.target?.result as string
                    setLogo(result)
                  }
                  reader.readAsDataURL(file)
                }
              }}
            />
            <Label
              htmlFor="logo-upload"
              className="cursor-pointer px-3 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700 flex items-center gap-2 h-10 whitespace-nowrap"
            >
              📷 Logo
            </Label>
            {logo && (
              <button
                onClick={() => setLogo(null)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-md h-10 w-10 flex items-center justify-center border border-red-200"
                title="Remove Logo"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Upload a transparent PNG to replace your DJ Name on slides.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="settings-year">Target Year</Label>
          <Input
            id="settings-year"
            type="number"
            value={targetYear}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setTargetYear(isNaN(value) ? targetYear : value);
            }}
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
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value) && value >= 0 && value <= 1) {
              setAverageTrackPlayedPercent(value);
            }
          }}
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
