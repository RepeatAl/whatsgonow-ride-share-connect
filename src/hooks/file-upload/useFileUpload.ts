
import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useFilePreviews } from "./useFilePreviews";
import { useFileSelection } from "./useFileSelection";
import { useFileUploader } from "./useFileUploader";
import { MAX_FILES } from "./constants";

export function useFileUpload(orderId?: string, existingUrls: string[] = []) {
  const [isLoading, setIsLoading] = useState(true);
  const { previews, updatePreviews, removePreview, clearPreviews, canTakeMore, nextPhotoIndex } = useFilePreviews();
  const { selectedFiles, fileInputRef, handleFileSelect, addFiles, removeFile } = useFileSelection();
  const { uploadFiles, isUploading, uploadProgress } = useFileUploader();
  
  // Track if we've already loaded photos to avoid redundant loading
  const hasLoadedPhotosRef = useRef(false);
  // Cache loaded URLs to avoid refetching
  const cachedUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    // Only load photos if we haven't already loaded them
    if (hasLoadedPhotosRef.current) {
      return;
    }

    const loadExistingPhotos = async () => {
      setIsLoading(true);
      
      try {
        let photoUrls: string[] = [];
        
        // First add any existing URLs passed directly to the component
        if (existingUrls && existingUrls.length > 0) {
          photoUrls = [...existingUrls];
        }
        
        // Then check storage for any additional photos if we have an orderId
        if (orderId) {
          const { data: files, error } = await supabase.storage
            .from('order-photos')
            .list(orderId);
  
          if (error) throw error;
  
          if (files && files.length > 0) {
            const storageUrls = files.map(file => {
              const { data } = supabase.storage
                .from('order-photos')
                .getPublicUrl(`${orderId}/${file.name}`);
              return data.publicUrl;
            });
  
            photoUrls = [...photoUrls, ...storageUrls];
          }
        }

        // Cache the loaded URLs
        cachedUrlsRef.current = photoUrls;
        updatePreviews(photoUrls);
        hasLoadedPhotosRef.current = true;
      } catch (error) {
        console.error('Error loading photos:', error);
        toast.error("Fehler beim Laden der gespeicherten Fotos");
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingPhotos();
  }, [orderId, updatePreviews, existingUrls]);

  // Preserve loaded photos during form updates
  useEffect(() => {
    // If we've loaded photos before but previews are empty now (possibly due to form rerender)
    // restore from our cache
    if (hasLoadedPhotosRef.current && cachedUrlsRef.current.length > 0 && previews.length === 0) {
      updatePreviews(cachedUrlsRef.current);
    }
  }, [previews.length, updatePreviews]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + previews.length >= MAX_FILES + 1) {
      toast.error(`Maximal ${MAX_FILES} Bilder erlaubt`);
      return;
    }

    const urls = files.map(file => URL.createObjectURL(file));
    updatePreviews(urls);
    addFiles(files);
    
    // Update our cache as well
    cachedUrlsRef.current = [...cachedUrlsRef.current, ...urls].slice(0, MAX_FILES);
  }, [previews.length, updatePreviews, addFiles]);

  const handleCapture = useCallback((file: File, url: string) => {
    if (previews.length >= MAX_FILES) {
      toast.error(`Maximal ${MAX_FILES} Fotos erlaubt`);
      return;
    }

    updatePreviews([url]);
    addFiles([file]);
    
    // Update our cache
    cachedUrlsRef.current = [...cachedUrlsRef.current, url].slice(0, MAX_FILES);
    
    toast.success(`Foto ${nextPhotoIndex} erfolgreich aufgenommen!`);
  }, [previews.length, nextPhotoIndex, updatePreviews, addFiles]);

  const handleMobilePhotosComplete = useCallback(async (files: string[]) => {
    const newUrls: string[] = [];
    
    for (const url of files) {
      if (previews.length + newUrls.length >= MAX_FILES) {
        toast.error(`Maximal ${MAX_FILES} Fotos erlaubt`);
        break;
      }

      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], `mobile-photo-${Date.now()}.jpg`, {
          type: 'image/jpeg'
        });

        addFiles([file]);
        newUrls.push(url);
      } catch (error) {
        console.error('Error processing mobile photo:', error);
        toast.error('Fehler beim Verarbeiten des Fotos');
      }
    }
    
    if (newUrls.length > 0) {
      updatePreviews(newUrls);
      cachedUrlsRef.current = [...cachedUrlsRef.current, ...newUrls].slice(0, MAX_FILES);
    }
  }, [previews.length, updatePreviews, addFiles]);

  const removeFileHandlerMemoized = useCallback((index: number) => {
    removeFile(index);
    removePreview(index);
    
    // Update cache by removing the URL at this index
    const newCache = [...cachedUrlsRef.current];
    newCache.splice(index, 1);
    cachedUrlsRef.current = newCache;
    
    toast.success("Bild erfolgreich entfernt");
  }, [removeFile, removePreview]);

  const uploadFilesMemoized = useCallback(async (userId?: string) => {
    if (!orderId) {
      toast.error("Keine Auftrags-ID vorhanden");
      return null;
    }

    const urls = await uploadFiles(orderId, userId, selectedFiles);
    
    if (urls) {
      // Update cache with the new permanent URLs
      cachedUrlsRef.current = [...urls];
      // Update the previews with the permanent URLs
      updatePreviews(urls);
      return urls;
    }
    
    return null;
  }, [orderId, uploadFiles, selectedFiles, updatePreviews]);

  return {
    selectedFiles,
    previews,
    fileInputRef,
    handleFileSelect,
    handleFileChange,
    handleCapture,
    handleMobilePhotosComplete,
    removeFile: removeFileHandlerMemoized,
    uploadFiles: uploadFilesMemoized,
    isUploading,
    isLoading,
    uploadProgress,
    canTakeMore,
    nextPhotoIndex,
    cachedUrls: cachedUrlsRef.current, // Expose cached URLs if needed
  };
}

export * from './constants';
