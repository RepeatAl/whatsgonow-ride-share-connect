import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { MAX_FILES } from "./constants";

export const useFilePreviews = () => {
  const [previews, setPreviews] = useState<string[]>([]);
  const previewUrlsRef = useRef<string[]>([]);
  
  const initialLoadDoneRef = useRef(false);
  
  useEffect(() => {
    if (!initialLoadDoneRef.current) {
      setPreviews([]);
      previewUrlsRef.current = [];
      initialLoadDoneRef.current = true;
    }
  }, []);

  const updatePreviews = useCallback((newUrls: string[]) => {
    if (newUrls.length === 0) return;
    
    setPreviews(prev => {
      const newPreviews = [...prev];
      const addedUrls = new Set();
      
      newUrls.forEach((url) => {
        const existingIndex = previewUrlsRef.current.findIndex(existing => existing === url);
        
        if (existingIndex !== -1) {
          addedUrls.add(url);
          return;
        }
        
        const nextEmptySlot = newPreviews.findIndex(p => !p);
        if (nextEmptySlot !== -1) {
          newPreviews[nextEmptySlot] = url;
          previewUrlsRef.current[nextEmptySlot] = url;
          addedUrls.add(url);
        } else if (newPreviews.length < MAX_FILES) {
          newPreviews.push(url);
          previewUrlsRef.current.push(url);
          addedUrls.add(url);
        }
      });
      
      return newPreviews.slice(0, MAX_FILES);
    });
  }, []);

  const removePreview = useCallback((index: number) => {
    setPreviews(prev => {
      const newPreviews = [...prev];
      const urlToRevoke = previewUrlsRef.current[index];
      
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
    nextPhotoIndex: previews.filter(Boolean).length + 1,
    previewsRef: previewUrlsRef,
  };
};
