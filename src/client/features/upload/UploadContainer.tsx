import { useFileUpload } from './hooks/useFileUpload';
import { FileDropzone } from './components/FileDropzone';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { StatsResponse } from '@/shared/types';
import { useConfigStore } from '@/client/lib/store';

interface UploadContainerProps {
  onUploadSuccess: (data: StatsResponse) => void;
}

export function UploadContainer({ onUploadSuccess }: UploadContainerProps) {
  const { file, error, isUploading, handleFileSelect, uploadFile, reset } = useFileUpload();
  
  // Use configuration store
  const targetYear = useConfigStore((state) => state.targetYear);
  const comparisonYear = useConfigStore((state) => state.comparisonYear);
  const unknownArtistFilter = useConfigStore((state) => state.unknownArtistFilter);
  const unknownGenreFilter = useConfigStore((state) => state.unknownGenreFilter);
  const djName = useConfigStore((state) => state.djName);
  const averageTrackPlayedPercent = useConfigStore((state) => state.averageTrackPlayedPercent);
  const setTargetYear = useConfigStore((state) => state.setTargetYear);
  const setComparisonYear = useConfigStore((state) => state.setComparisonYear);
  const setUnknownArtistFilter = useConfigStore((state) => state.setUnknownArtistFilter);
  const setUnknownGenreFilter = useConfigStore((state) => state.setUnknownGenreFilter);
  const setDjName = useConfigStore((state) => state.setDjName);
  const setAverageTrackPlayedPercent = useConfigStore((state) => state.setAverageTrackPlayedPercent);

  const handleUpload = async () => {
    try {
      const options = {
        unknownArtist: unknownArtistFilter,
        unknownGenre: unknownGenreFilter,
      };
      const data = await uploadFile(
        targetYear.toString(), 
        options, 
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
    <div className="flex items-center justify-center min-h-[50vh] p-4">
      <Card className="w-full max-w-lg backdrop-blur-sm bg-card/95">
        <CardHeader>
          <CardTitle>Upload Library</CardTitle>
          <CardDescription>
            Upload your Rekordbox master.db file to generate your Year in Review.
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
            <div className="space-y-2">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Target Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={targetYear}
                  onChange={(e) => setTargetYear(parseInt(e.target.value))}
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
              <Label htmlFor="averageTrackPercent">Average Track Played % (for playtime estimation)</Label>
              <Input
                id="averageTrackPercent"
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={averageTrackPlayedPercent}
                onChange={(e) => setAverageTrackPlayedPercent(parseFloat(e.target.value))}
                disabled={isUploading}
              />
              <p className="text-xs text-muted-foreground">
                Default: 0.75 (75% of each track played on average)
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="unknownArtist"
                className="rounded border-gray-300 text-primary focus:ring-primary"
                checked={unknownArtistFilter}
                onChange={(e) => setUnknownArtistFilter(e.target.checked)}
                disabled={isUploading}
              />
              <Label htmlFor="unknownArtist">Include Unknown Artists</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="unknownGenre"
                className="rounded border-gray-300 text-primary focus:ring-primary"
                checked={unknownGenreFilter}
                onChange={(e) => setUnknownGenreFilter(e.target.checked)}
                disabled={isUploading}
              />
              <Label htmlFor="unknownGenre">Include Unknown Genres</Label>
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
  );
}
