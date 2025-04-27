
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
  
  const { uploadFile } = useFileUploader({
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
    if (!selectedFiles.current.length && !previews.length) {
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
      const filesToUpload = selectedFiles.current.filter(file => {
        const fileUrl = URL.createObjectURL(file);
        return !previewsRef.current.includes(fileUrl);
      });
      
      if (filesToUpload.length === 0) {
        // Just return the existing previews if no new files
        return [...previews.filter(Boolean), ...existingUrls];
      }
      
      // Upload new files
      const uploadPromises = filesToUpload.map(async (file) => {
        try {
          const filePath = `${orderId}/${uuidv4()}-${file.name}`;
          const { data, error } = await supabase.storage
            .from("order-images")
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: false
            });
            
          if (error) {
            throw error;
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from("order-images")
            .getPublicUrl(filePath);
            
          return publicUrl;
        } catch (error) {
          console.error("Error uploading file:", error);
          return null;
        }
      });
      
      // Wait for all uploads to complete
      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter(Boolean) as string[];
      
      // Combine with existing URLs, but filter out any that might be duplicates
      const combinedUrls = [...validUrls, ...existingUrls];
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
    nextPhotoIndex
  };
};
