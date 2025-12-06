import { useState } from 'react';
import { useFileUpload } from './hooks/useFileUpload';
import { FileDropzone } from './components/FileDropzone';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { StatsResponse } from '@/shared/types';

interface UploadContainerProps {
  onUploadSuccess: (data: StatsResponse) => void;
}

export function UploadContainer({ onUploadSuccess }: UploadContainerProps) {
  const { file, error, isUploading, handleFileSelect, uploadFile, reset } = useFileUpload();
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [comparisonYear, setComparisonYear] = useState((new Date().getFullYear() - 1).toString());
  const [options, setOptions] = useState({
    unknownArtist: false,
    unknownGenre: false,
  });

  const handleUpload = async () => {
    try {
      const data = await uploadFile(year, options, comparisonYear);
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Target Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  disabled={isUploading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comparisonYear">Comparison Year</Label>
                <Input
                  id="comparisonYear"
                  type="number"
                  value={comparisonYear}
                  onChange={(e) => setComparisonYear(e.target.value)}
                  disabled={isUploading}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="unknownArtist"
                className="rounded border-gray-300 text-primary focus:ring-primary"
                checked={options.unknownArtist}
                onChange={(e) => setOptions({ ...options, unknownArtist: e.target.checked })}
                disabled={isUploading}
              />
              <Label htmlFor="unknownArtist">Include Unknown Artists</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="unknownGenre"
                className="rounded border-gray-300 text-primary focus:ring-primary"
                checked={options.unknownGenre}
                onChange={(e) => setOptions({ ...options, unknownGenre: e.target.checked })}
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
