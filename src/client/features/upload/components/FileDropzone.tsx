import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File as FileIcon, X, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert';
import { cn } from '../../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FileDropzoneProps {
  file: File | null;
  error: string | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  disabled?: boolean;
}

export function FileDropzone({ file, error, onFileSelect, onClear, disabled }: FileDropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/x-sqlite3': ['.db'],
      'application/octet-stream': ['.db'],
    },
    maxFiles: 1,
    disabled: disabled || !!file,
  });

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors hover:bg-muted/50",
              isDragActive ? "border-primary bg-muted" : "border-muted-foreground/25",
              disabled && "opacity-50 cursor-not-allowed hover:bg-transparent"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-background rounded-full shadow-sm">
                <UploadCloud className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {isDragActive ? "Drop the file here" : "Click or drag to upload"}
                </p>
                <p className="text-xs text-muted-foreground">
                  master.db (Max 100MB)
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="file-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <FileIcon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear();
                  }}
                  disabled={disabled}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
