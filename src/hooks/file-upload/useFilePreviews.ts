
import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { MAX_FILES } from "./constants";

export const useFilePreviews = () => {
  const [previews, setPreviews] = useState<string[]>([]);
  const previewUrlsRef = useRef<string[]>([]);

  const updatePreviews = useCallback((newUrls: string[]) => {
    setPreviews(prev => {
      const newPreviews = [...prev];
      newUrls.forEach((url, idx) => {
        const nextEmptySlot = newPreviews.findIndex(p => !p);
        if (nextEmptySlot !== -1) {
          newPreviews[nextEmptySlot] = url;
          previewUrlsRef.current[nextEmptySlot] = url;
        } else if (newPreviews.length < MAX_FILES) {
          newPreviews.push(url);
          previewUrlsRef.current.push(url);
        }
      });
      return newPreviews.slice(0, MAX_FILES);
    });
  }, []);

  const removePreview = useCallback((index: number) => {
    setPreviews(prev => {
      const newPreviews = [...prev];
      const urlToRevoke = previewUrlsRef.current[index];
      
      // Only revoke if it's a blob URL
      if (urlToRevoke?.startsWith('blob:')) {
        URL.revokeObjectURL(urlToRevoke);
      }
      
      newPreviews[index] = undefined;
      previewUrlsRef.current[index] = undefined;
      
      return newPreviews.filter(Boolean);
    });
  }, []);

  const clearPreviews = useCallback(() => {
    previewUrlsRef.current.forEach(url => {
      if (url?.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    setPreviews([]);
    previewUrlsRef.current = [];
  }, []);

  return {
    previews,
    updatePreviews,
    removePreview,
    clearPreviews,
    canTakeMore: previews.filter(Boolean).length < MAX_FILES,
    nextPhotoIndex: previews.filter(Boolean).length + 1
  };
};
