
import { useState, useRef, useCallback, useMemo } from "react";
import { MAX_FILES } from "./constants";

export const useFilePreviews = (initialUrls: string[] = []) => {
  // Use a stable reference for the initial array
  const initialArray = useMemo(() => {
    const array = Array(MAX_FILES).fill(undefined);
    initialUrls.forEach((url, index) => {
      if (index < MAX_FILES) {
        array[index] = url;
      }
    });
    return array;
  }, []);
  
  // State always maintains a fixed-length array structure
  const [previews, setPreviews] = useState<(string | undefined)[]>(initialArray);
  
  // Track preview URLs with a ref to avoid unnecessary re-renders
  const previewUrlsRef = useRef<(string | undefined)[]>(Array(MAX_FILES).fill(undefined));
  const initialLoadDoneRef = useRef(false);
  const restoredFromStorageRef = useRef(false);

  // Memoized update function to avoid unnecessary closures
  const updatePreviews = useCallback((newUrls: string[]) => {
    if (newUrls.length === 0) return;
    
    setPreviews(prev => {
      // Create a copy to avoid mutating the existing state
      const newPreviews = [...prev];
      let changed = false;
      
      for (const url of newUrls) {
        // Skip if URL already exists
        if (newPreviews.includes(url)) continue;
        
        // Find first empty slot
        const emptyIndex = newPreviews.findIndex(p => !p);
        if (emptyIndex !== -1) {
          newPreviews[emptyIndex] = url;
          previewUrlsRef.current[emptyIndex] = url;
          changed = true;
        } else if (newPreviews.filter(Boolean).length < MAX_FILES) {
          // Fallback - add to end if not full
          for (let i = 0; i < MAX_FILES; i++) {
            if (newPreviews[i] === undefined) {
              newPreviews[i] = url;
              previewUrlsRef.current[i] = url;
              changed = true;
              break;
            }
          }
        }
      }
      
      // Only return new array if we actually made changes
      return changed ? newPreviews : prev;
    });
  }, []);

  // Function to initialize previews with existing URLs - optimized to run only once
  const initializeWithExistingUrls = useCallback((existingUrls: string[]) => {
    if (!existingUrls.length || restoredFromStorageRef.current) return;
    
    setPreviews(prev => {
      const newPreviews = Array(MAX_FILES).fill(undefined);
      
      existingUrls.forEach((url, index) => {
        if (index < MAX_FILES) {
          newPreviews[index] = url;
          previewUrlsRef.current[index] = url;
        }
      });
      
      restoredFromStorageRef.current = true;
      return newPreviews;
    });
  }, []);

  // Optimized removePreview function with stable reference
  const removePreview = useCallback((index: number) => {
    if (index < 0 || index >= MAX_FILES) return;
    
    setPreviews(prev => {
      const newPreviews = [...prev];
      
      // Revoke blob URL if needed
      const urlToRevoke = previewUrlsRef.current[index];
      if (urlToRevoke?.startsWith('blob:')) {
        URL.revokeObjectURL(urlToRevoke);
      }
      
      newPreviews[index] = undefined;
      previewUrlsRef.current[index] = undefined;
      
      return newPreviews;
    });
  }, []);

  // Clear previews function with stable reference
  const clearPreviews = useCallback(() => {
    previewUrlsRef.current.forEach(url => {
      if (url?.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    
    setPreviews(Array(MAX_FILES).fill(undefined));
    previewUrlsRef.current = Array(MAX_FILES).fill(undefined);
    restoredFromStorageRef.current = false;
  }, []);

  // Calculated values using useMemo to avoid unnecessary recalculations
  const canTakeMore = useMemo(() => {
    return previews.filter(Boolean).length < MAX_FILES;
  }, [previews]);
  
  const nextPhotoIndex = useMemo(() => {
    return previews.filter(Boolean).length + 1;
  }, [previews]);

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
