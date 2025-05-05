
import { useState, useCallback, useEffect, useMemo } from "react";
import { useFilePreviews } from "./useFilePreviews";
import { useFileSelection } from "./useFileSelection";
import { useFileUploader } from "./useFileUploader";
import { toast } from "sonner";
import { MAX_FILES } from "./constants";

export const useFileUpload = (orderId?: string, existingUrls: string[] = []) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(!!existingUrls.length);
  
  // Initialize with fixed structure for previews
  const { 
    previews, 
    updatePreviews, 
    removePreview, 
    clearPreviews, 
    canTakeMore,
    nextPhotoIndex,
    previewsRef,
    initializeWithExistingUrls
  } = useFilePreviews(existingUrls);
  
  const { 
    fileInputRef,
    selectedFiles,
    handleFileSelect,
    handleFileChange,
    handleCapture,
    removeFile
  } = useFileSelection(updatePreviews);
  
  const { uploadFile, uploadFiles: uploaderUploadFiles } = useFileUploader({
    onProgress: (progress) => setUploadProgress(progress)
  });
  
  // Stable callback function for handling mobile photo uploads
  const handleMobilePhotosComplete = useCallback((files: string[]) => {
    updatePreviews(files);
  }, [updatePreviews]);
  
  // Effect for initializing with existing URLs - run only once
  useEffect(() => {
    if (existingUrls?.length > 0 && isLoading) {
      initializeWithExistingUrls(existingUrls);
      setIsLoading(false);
    }
  }, [existingUrls, initializeWithExistingUrls, isLoading]);
  
  // Stable uploadFiles function to optimize renders
  const uploadFiles = useCallback(async (userId?: string): Promise<string[]> => {
    // If no new files and we already have previews, just return those
    if (!selectedFiles.length) {
      return previews.filter(Boolean) as string[];
    }
    
    if (!orderId) {
      toast.error("Bitte speichern Sie zuerst den Auftrag");
      return [];
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Filter out only selected files that aren't already in previewsRef
      const filesToUpload = selectedFiles.filter(() => {
        // Skip files that would exceed our limit
        return previews.filter(Boolean).length < MAX_FILES;
      });
      
      if (filesToUpload.length === 0) {
        // Just return the existing previews if no new files
        return previews.filter(Boolean) as string[];
      }
      
      // Upload new files
      const uploadedUrls = await uploaderUploadFiles(
        orderId,
        userId,
        filesToUpload
      );
      
      // Combine with existing URLs, but filter out any that might be duplicates
      const previewUrls = previews.filter(Boolean) as string[];
      const combinedUrls = [...uploadedUrls, ...previewUrls];
      const uniqueUrls = Array.from(new Set(combinedUrls));
      
      return uniqueUrls.slice(0, MAX_FILES); // Limit to MAX_FILES images
    } catch (error) {
      console.error("Error in uploadFiles:", error);
      toast.error("Fehler beim Hochladen der Dateien");
      return [];
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
    }
  }, [orderId, previews, selectedFiles, uploaderUploadFiles]);
  
  return {
    fileInputRef,
    handleFileSelect,
    handleFileChange,
    handleCapture,
    handleMobilePhotosComplete,
    removeFile,
    uploadFiles,
    isUploading,
    isLoading,
    uploadProgress,
    previews,
    canTakeMore,
    nextPhotoIndex,
    initializeWithExistingUrls
  };
};
