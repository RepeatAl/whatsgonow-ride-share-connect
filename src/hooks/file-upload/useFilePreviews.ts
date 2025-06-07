
import { useState, useRef, useCallback, useMemo } from "react";
import { MAX_FILES } from "./constants";

/**
 * useFilePreviews – Handles preview URLs for image upload slots
 * Always returns a fixed-length array (MAX_FILES) and provides utilities to update, remove, clear and initialize previews.
 */
export const useFilePreviews = (initialUrls: string[] = []) => {
  // Stable reference for the initial array (for SSR and repeated renders)
  const initialArray = useMemo(() => {
    const array = Array(MAX_FILES).fill(undefined);
    initialUrls.forEach((url, index) => {
      if (index < MAX_FILES) array[index] = url;
    });
    return array;
  }, [initialUrls]);
  
  const [previews, setPreviews] = useState<(string | undefined)[]>(initialArray);
  const previewUrlsRef = useRef<(string | undefined)[]>(Array(MAX_FILES).fill(undefined));
  const restoredFromStorageRef = useRef(false);

  // Adds new preview URLs if slots are available
  const updatePreviews = useCallback((newUrls: string[]) => {
    if (newUrls.length === 0) return;
    setPreviews(prev => {
      const newPreviews = [...prev];
      let changed = false;
      for (const url of newUrls) {
        if (newPreviews.includes(url)) continue;
        const emptyIndex = newPreviews.findIndex(p => !p);
        if (emptyIndex !== -1) {
          newPreviews[emptyIndex] = url;
          previewUrlsRef.current[emptyIndex] = url;
          changed = true;
        }
      }
      return changed ? newPreviews : prev;
    });
  }, []);

  // Initialize previews only once from existing URLs (e.g. from local storage)
  const initializeWithExistingUrls = useCallback((existingUrls: string[]) => {
    if (!existingUrls.length || restoredFromStorageRef.current) return;
    setPreviews(() => {
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

  // Remove a preview at a given index
  const removePreview = useCallback((index: number) => {
    if (index < 0 || index >= MAX_FILES) return;
    setPreviews(prev => {
      const newPreviews = [...prev];
      const urlToRevoke = previewUrlsRef.current[index];
      if (urlToRevoke?.startsWith("blob:")) URL.revokeObjectURL(urlToRevoke);
      newPreviews[index] = undefined;
      previewUrlsRef.current[index] = undefined;
      return newPreviews;
    });
  }, []);

  // Clear all previews
  const clearPreviews = useCallback(() => {
    previewUrlsRef.current.forEach(url => {
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    });
    setPreviews(Array(MAX_FILES).fill(undefined));
    previewUrlsRef.current = Array(MAX_FILES).fill(undefined);
    restoredFromStorageRef.current = false;
  }, []);

  const canTakeMore = useMemo(
    () => previews.filter(Boolean).length < MAX_FILES,
    [previews]
  );
  const nextPhotoIndex = useMemo(
    () => previews.filter(Boolean).length + 1,
    [previews]
  );

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
