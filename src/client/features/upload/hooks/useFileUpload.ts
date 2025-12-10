import { useState, useCallback } from 'react';
import { StatsResponse } from '@/shared/types';
import { compressFile } from '@/client/lib/compression';

interface UseFileUploadReturn {
  file: File | null;
  error: string | null;
  isUploading: boolean;
  handleFileSelect: (selectedFile: File) => void;
  uploadFile: (year: string, comparisonYear?: string) => Promise<StatsResponse>;
  reset: () => void;
}

const MAX_FILE_SIZE_MB = 100;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function useFileUpload(): UseFileUploadReturn {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setError(null);

    // Validate file extension
    if (!selectedFile.name.toLowerCase().endsWith('.db')) {
      setError('Invalid file type. Please upload a .db file.');
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      const errorMsg = `File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`;
      console.error(`[Upload Error] ${errorMsg} File size: ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB`);
      setError(errorMsg);
      return;
    }

    setFile(selectedFile);
  }, []);

  const uploadFile = useCallback(async (year: string, comparisonYear?: string): Promise<StatsResponse> => {
    if (!file) {
      throw new Error('No file selected.');
    }

    setIsUploading(true);
    setError(null);

    try {
      // Compress the file
      const compressedBlob = await compressFile(file);

      const formData = new FormData();
      // Send the compressed blob, but keep the original filename so the server knows it's the db
      formData.append('file', compressedBlob, file.name);
      formData.append('year', year);
      if (comparisonYear) {
        formData.append('comparisonYear', comparisonYear);
      }

      const response = await fetch('/upload', {
        method: 'POST',
        headers: {
          // Signal to the worker that this file is gzipped
          'X-File-Content-Encoding': 'gzip'
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      return data as StatsResponse;
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload file. Please try again.');
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [file]);

  const reset = useCallback(() => {
    setFile(null);
    setError(null);
    setIsUploading(false);
  }, []);

  return {
    file,
    error,
    isUploading,
    handleFileSelect,
    uploadFile,
    reset,
  };
}
