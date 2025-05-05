
import { useState, useRef, useCallback, useEffect } from "react";
import { MAX_FILES } from "./constants";

export const useFilePreviews = (initialUrls: string[] = []) => {
  // Always use a fixed-length array with MAX_FILES slots
  const [previews, setPreviews] = useState<(string | undefined)[]>(() => {
    // Initialize with fixed length array
    const initialArray = Array(MAX_FILES).fill(undefined);
    
    // Fill in initial values if provided
    initialUrls.forEach((url, index) => {
      if (index < MAX_FILES) {
        initialArray[index] = url;
      }
    });
    
    return initialArray;
  });
  
  const previewUrlsRef = useRef<(string | undefined)[]>(Array(MAX_FILES).fill(undefined));
  const initialLoadDoneRef = useRef(false);
  const restoredFromStorageRef = useRef(false);

  // Initial setup - clear previews when component mounts or initialize with provided URLs
  useEffect(() => {
    if (!initialLoadDoneRef.current) {
      if (initialUrls.length > 0) {
        const initialArray = Array(MAX_FILES).fill(undefined);
        
        initialUrls.forEach((url, index) => {
          if (index < MAX_FILES) {
            initialArray[index] = url;
          }
        });
        
        setPreviews(initialArray);
        previewUrlsRef.current = [...initialArray];
        restoredFromStorageRef.current = true;
      }
      
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
  }, [initialUrls]);

  // Function to update previews with new URLs
  const updatePreviews = useCallback((newUrls: string[]) => {
    if (newUrls.length === 0) return;
    
    setPreviews(prev => {
      const newPreviews = [...prev];
      
      newUrls.forEach((url) => {
        // Check if this URL already exists in our previews
        const existingIndex = previewUrlsRef.current.findIndex(existing => existing === url);
        
        if (existingIndex !== -1) {
          return; // Skip if already exists
        }
        
        // Find the first empty slot
        const nextEmptySlot = newPreviews.findIndex(p => !p);
        
        if (nextEmptySlot !== -1) {
          // Insert into empty slot
          newPreviews[nextEmptySlot] = url;
          previewUrlsRef.current[nextEmptySlot] = url;
        } else if (newPreviews.filter(Boolean).length < MAX_FILES) {
          // If array isn't full yet, find first undefined
          for (let i = 0; i < MAX_FILES; i++) {
            if (newPreviews[i] === undefined) {
              newPreviews[i] = url;
              previewUrlsRef.current[i] = url;
              break;
            }
          }
        }
      });
      
      // Ensure we always maintain MAX_FILES length
      while (newPreviews.length < MAX_FILES) {
        newPreviews.push(undefined);
      }
      
      return newPreviews.slice(0, MAX_FILES);
    });
  }, []);

  // Function to initialize previews with existing URLs
  const initializeWithExistingUrls = useCallback((existingUrls: string[]) => {
    if (!existingUrls.length || restoredFromStorageRef.current) return;
    
    const initialArray = Array(MAX_FILES).fill(undefined);
    
    existingUrls.forEach((url, index) => {
      if (index < MAX_FILES) {
        initialArray[index] = url;
      }
    });
    
    setPreviews(initialArray);
    previewUrlsRef.current = [...initialArray];
    restoredFromStorageRef.current = true;
  }, []);

  // Function to remove preview at specified index
  const removePreview = useCallback((index: number) => {
    setPreviews(prev => {
      const newPreviews = [...prev];
      
      if (index >= 0 && index < newPreviews.length) {
        const urlToRevoke = previewUrlsRef.current[index];
        
        if (urlToRevoke?.startsWith('blob:')) {
          URL.revokeObjectURL(urlToRevoke);
        }
        
        newPreviews[index] = undefined;
        previewUrlsRef.current[index] = undefined;
      }
      
      return newPreviews;
    });
  }, []);

  // Function to clear all previews
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
