
import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { MAX_FILES } from "./constants";

export const useFilePreviews = () => {
  const [previews, setPreviews] = useState<string[]>([]);
  const previewUrlsRef = useRef<string[]>([]);
  const initialLoadDoneRef = useRef(false);
  const restoredFromStorageRef = useRef(false);

  // Initial setup - clear previews when component mounts
  useEffect(() => {
    if (!initialLoadDoneRef.current) {
      setPreviews([]);
      previewUrlsRef.current = [];
      initialLoadDoneRef.current = true;
    }
    
    // Cleanup function to revoke all preview URLs
    return () => {
      previewUrlsRef.current.forEach(url => {
        if (url?.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  // Function to update previews with new URLs
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

  // Function to initialize previews with existing URLs
  const initializeWithExistingUrls = useCallback((existingUrls: string[]) => {
    if (!existingUrls.length || restoredFromStorageRef.current) return;
    
    setPreviews(existingUrls.slice(0, MAX_FILES));
    previewUrlsRef.current = existingUrls.slice(0, MAX_FILES);
    restoredFromStorageRef.current = true;
  }, []);

  // Function to remove preview at specified index
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

  // Function to clear all previews
  const clearPreviews = useCallback(() => {
    previewUrlsRef.current.forEach(url => {
      if (url?.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    setPreviews([]);
    previewUrlsRef.current = [];
    restoredFromStorageRef.current = false;
  }, []);

  const canTakeMore = previews.filter(Boolean).length < MAX_FILES;
  const nextPhotoIndex = previews.filter(Boolean).length + 1;

  return {
    previews,
    updatePreviews,
    initializeWithExistingUrls,
    removePreview,
    clearPreviews,
    canTakeMore,
    nextPhotoIndex,
    previewsRef: previewUrlsRef,
  };
};
