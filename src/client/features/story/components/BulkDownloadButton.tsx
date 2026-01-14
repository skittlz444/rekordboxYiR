import { useState } from 'react'
import { Button } from '@/client/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/client/components/ui/dialog'
import { Label } from '@/client/components/ui/label'
import { Switch } from '@/client/components/ui/switch'
import { Download } from 'lucide-react'

interface BulkDownloadButtonProps {
  onDownload: (options: { allSizes: boolean; allThemes: boolean }) => void
  disabled?: boolean
}

export function BulkDownloadButton({ onDownload, disabled = false }: BulkDownloadButtonProps) {
  const [open, setOpen] = useState(false)
  const [allSizes, setAllSizes] = useState(false)
  const [allThemes, setAllThemes] = useState(false)

  const handleDownload = () => {
    onDownload({ allSizes, allThemes })
    setOpen(false)
  }

  const getDownloadDescription = () => {
    if (allSizes && allThemes) {
      return 'All sizes (9:16, 4:5, 1:1) × All themes (Pastel, Club, Clean, Dark)'
    } else if (allSizes) {
      return 'All sizes (9:16, 4:5, 1:1) in current theme'
    } else if (allThemes) {
      return 'All themes (Pastel, Club, Clean, Dark) in current size'
    }
    return 'All slides in current size and theme'
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="lg"
          disabled={disabled}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <Download className="w-5 h-5 mr-2" />
          Bulk Download
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Download Options</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="all-sizes" className="flex flex-col space-y-1 cursor-pointer">
                <span className="font-medium">Download all sizes</span>
                <span className="text-sm text-muted-foreground">
                  9:16 (Story), 4:5 (Portrait), 1:1 (Square)
                </span>
              </Label>
              <Switch
                id="all-sizes"
                checked={allSizes}
                onCheckedChange={setAllSizes}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="all-themes" className="flex flex-col space-y-1 cursor-pointer">
                <span className="font-medium">Download all themes</span>
                <span className="text-sm text-muted-foreground">
                  Pastel, Club, Clean, Dark
                </span>
              </Label>
              <Switch
                id="all-themes"
                checked={allThemes}
                onCheckedChange={setAllThemes}
              />
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm">
              <span className="font-medium">Will download:</span>
              <br />
              {getDownloadDescription()}
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
