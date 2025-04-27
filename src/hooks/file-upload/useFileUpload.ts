import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { useFilePreviews } from "./useFilePreviews";
import { useFileSelection } from "./useFileSelection";
import { useFileUploader } from "./useFileUploader";
import { toast } from "sonner";

export const useFileUpload = (orderId?: string, existingUrls: string[] = []) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    previews, 
    updatePreviews, 
    removePreview, 
    clearPreviews, 
    canTakeMore,
    nextPhotoIndex,
    previewsRef,
    initializeWithExistingUrls
  } = useFilePreviews();
  
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

  // Initialize with existing URLs if provided
  useEffect(() => {
    if (existingUrls?.length > 0) {
      initializeWithExistingUrls(existingUrls);
    }
  }, [existingUrls, initializeWithExistingUrls]);
  
  const handleMobilePhotosComplete = useCallback((files: string[]) => {
    updatePreviews(files);
  }, [updatePreviews]);
  
  const uploadFiles = async (userId?: string): Promise<string[]> => {
    if (!selectedFiles.length && !previews.length) {
      return existingUrls;
    }
    
    if (!orderId) {
      toast.error("Bitte speichern Sie zuerst den Auftrag");
      return [];
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Filter out only selected files that aren't already in previewsRef
      const filesToUpload = selectedFiles.filter(file => {
        // Generate a temporary object URL for this file to check
        const tempUrl = URL.createObjectURL(file);
        URL.revokeObjectURL(tempUrl); // Clean up immediately
        return !previewsRef.current.some(url => url === tempUrl);
      });
      
      if (filesToUpload.length === 0) {
        // Just return the existing previews if no new files
        return [...previews.filter(Boolean), ...existingUrls];
      }
      
      // Upload new files
      const uploadedUrls = await uploaderUploadFiles(
        orderId,
        userId,
        filesToUpload
      );
      
      // Combine with existing URLs, but filter out any that might be duplicates
      const combinedUrls = [...uploadedUrls, ...existingUrls];
      const uniqueUrls = Array.from(new Set(combinedUrls));
      
      return uniqueUrls.slice(0, 4); // Limit to 4 images
    } catch (error) {
      console.error("Error in uploadFiles:", error);
      toast.error("Fehler beim Hochladen der Dateien");
      return [];
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
    }
  };
  
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
