import { useState, useCallback } from 'react';
import { StatsResponse } from '@/shared/types';
import { MAX_FILE_SIZE_BYTES, getFileSizeLimitErrorMessage } from '@/shared/constants';

interface UseFileUploadReturn {
  file: File | null;
  error: string | null;
  isUploading: boolean;
  handleFileSelect: (selectedFile: File) => void;
  uploadFile: (year: string, comparisonYear?: string) => Promise<StatsResponse>;
  reset: () => void;
}

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
      const fileSizeMB = (selectedFile.size / 1024 / 1024).toFixed(2);
      const errorMsg = getFileSizeLimitErrorMessage(fileSizeMB);
      console.error(`[Upload Error] File size exceeds limit. File size: ${fileSizeMB}MB`);
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
      const formData = new FormData();
      formData.append('file', file);
      formData.append('year', year);
      if (comparisonYear) {
        formData.append('comparisonYear', comparisonYear);
      }

      const response = await fetch('/upload', {
        method: 'POST',
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
