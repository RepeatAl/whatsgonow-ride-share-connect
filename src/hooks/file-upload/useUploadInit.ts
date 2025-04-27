
import { useEffect, useCallback } from 'react';

interface UseUploadInitProps {
  existingUrls: string[];
  initializeWithExistingUrls: (urls: string[]) => void;
}

export const useUploadInit = ({ existingUrls, initializeWithExistingUrls }: UseUploadInitProps) => {
  const initializeUploads = useCallback(() => {
    if (existingUrls?.length > 0) {
      initializeWithExistingUrls(existingUrls);
    }
  }, [existingUrls, initializeWithExistingUrls]);

  useEffect(() => {
    initializeUploads();
  }, [initializeUploads]);

  return { initializeUploads };
};
