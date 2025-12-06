import { useState, useCallback } from 'react';

interface UseFileUploadReturn {
  file: File | null;
  error: string | null;
  isUploading: boolean;
  handleFileSelect: (selectedFile: File) => void;
  uploadFile: (year: string, options: { unknownArtist: boolean; unknownGenre: boolean }) => Promise<any>;
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

  const uploadFile = useCallback(async (year: string, options: { unknownArtist: boolean; unknownGenre: boolean }) => {
    if (!file) {
      setError('No file selected.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('year', year);
      formData.append('unknownArtist', String(options.unknownArtist));
      formData.append('unknownGenre', String(options.unknownGenre));

      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      return data;
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
