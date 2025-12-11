import { useFileUpload } from './hooks/useFileUpload';
import { FileDropzone } from './components/FileDropzone';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { StatsResponse } from '@/shared/types';
import { useConfigStore } from '@/client/lib/store';
import { UploadLoadingOverlay } from '@/client/components/LoadingStates';
import { AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { HelpCircle } from "lucide-react"

interface UploadContainerProps {
  onUploadSuccess: (data: StatsResponse) => void;
}

export function UploadContainer({ onUploadSuccess }: UploadContainerProps) {
  const { file, error, isUploading, handleFileSelect, uploadFile, reset } = useFileUpload();

  // Use configuration store
  const targetYear = useConfigStore((state) => state.targetYear);
  const comparisonYear = useConfigStore((state) => state.comparisonYear);
  const djName = useConfigStore((state) => state.djName);
  const averageTrackPlayedPercent = useConfigStore((state) => state.averageTrackPlayedPercent);
  const setTargetYear = useConfigStore((state) => state.setTargetYear);
  const setComparisonYear = useConfigStore((state) => state.setComparisonYear);
  const setDjName = useConfigStore((state) => state.setDjName);
  const logo = useConfigStore((state) => state.logo);
  const setLogo = useConfigStore((state) => state.setLogo);
  const setAverageTrackPlayedPercent = useConfigStore((state) => state.setAverageTrackPlayedPercent);

  const handleUpload = async () => {
    try {
      const data = await uploadFile(
        targetYear.toString(),
        comparisonYear?.toString() || ''
      );
      if (data) {
        onUploadSuccess(data);
      }
    } catch {
      // Error is handled in hook
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-[50vh] p-4">
        <Card className="w-full max-w-lg backdrop-blur-sm bg-card/95">
          <CardHeader>
            <CardTitle>Upload Library</CardTitle>
            <CardDescription className="flex items-center gap-2">
              Upload your Rekordbox master.db file to generate your Year in Review.
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" title="Where is my master.db?">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    <span className="sr-only">Where is my master.db?</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>How to find your master.db</DialogTitle>
                    <DialogDescription>
                      Follow these steps to locate your Rekordbox database file.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 text-sm">
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <span className="text-xl">🪟</span> Windows
                      </h4>
                      <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
                        <li>Press <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-xs">Win + R</kbd> to open Run</li>
                        <li>Paste <code className="px-1 py-0.5 rounded bg-muted font-mono text-xs text-primary">%AppData%\Pioneer\rekordbox</code></li>
                        <li>Locate the <span className="font-medium text-foreground">master.db</span> file</li>
                      </ol>
                    </div>

                    <div className="space-y-2 border-t pt-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <span className="text-xl">🍎</span> macOS
                      </h4>
                      <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
                        <li>Open Finder and press <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-xs">Cmd + Shift + G</kbd></li>
                        <li>Paste <code className="px-1 py-0.5 rounded bg-muted font-mono text-xs text-primary">~/Library/Pioneer/rekordbox</code></li>
                        <li>Locate the <span className="font-medium text-foreground">master.db</span> file</li>
                      </ol>
                    </div>

                    <div className="space-y-2 border-t pt-4 bg-muted/30 p-3 rounded-md">
                      <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Custom Drive Location</h4>
                      <p className="text-muted-foreground">
                        If you&apos;ve moved your database to a different drive (e.g. D:), check:
                        <br />
                        <code className="px-1 py-0.5 rounded bg-muted font-mono text-xs mt-1 block w-fit">
                          &lt;DriveLetter&gt;:\PIONEER\Master\master.db
                        </code>
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FileDropzone
              file={file}
              error={error}
              onFileSelect={handleFileSelect}
              onClear={reset}
              disabled={isUploading}
            />

            <div className="space-y-4">
              <div className="flex gap-2 items-end">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="djName">DJ Name (Optional)</Label>
                  <Input
                    id="djName"
                    type="text"
                    value={djName}
                    onChange={(e) => setDjName(e.target.value)}
                    placeholder="Enter your DJ name"
                    disabled={isUploading}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="upload-logo-input"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading}
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
                    htmlFor="upload-logo-input"
                    className={`cursor-pointer px-3 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-700 flex items-center gap-2 h-10 whitespace-nowrap mb-0.5 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    📷 Logo
                  </Label>
                  {logo && (
                    <button
                      onClick={() => setLogo(null)}
                      disabled={isUploading}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md h-10 w-10 flex items-center justify-center border border-red-200 mb-0.5"
                      title="Remove Logo"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              {logo && (
                <p className="text-xs text-muted-foreground mt-1">
                  Logo uploaded! It will replace your DJ Name on slides.
                </p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Target Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={targetYear}
                    onChange={(e) => setTargetYear(parseInt(e.target.value) || targetYear)}
                    disabled={isUploading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comparisonYear">Comparison Year</Label>
                  <Input
                    id="comparisonYear"
                    type="number"
                    value={comparisonYear || ''}
                    onChange={(e) => setComparisonYear(e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="Optional"
                    disabled={isUploading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="averageTrackPercent">Average Track Played %</Label>
                <Input
                  id="averageTrackPercent"
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
                  disabled={isUploading}
                />
                <p className="text-xs text-muted-foreground">
                  Adjust how much of each track is played on average (default: 0.75 = 75%)
                </p>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleUpload}
              disabled={!file || isUploading}
            >
              {isUploading ? "Uploading..." : "Generate Report"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <AnimatePresence>
        {isUploading && <UploadLoadingOverlay />}
      </AnimatePresence>
    </>
  );
}
