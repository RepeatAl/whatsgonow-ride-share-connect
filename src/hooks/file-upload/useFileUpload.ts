
import { useState, useRef, useCallback } from "react";
import { useUploadHandler } from "../useUploadHandler";
import { useFileUploader } from "./useFileUploader";
import { useFilePreviews } from "./useFilePreviews";
import { validateFile } from "./fileValidation";
import { v4 as uuidv4 } from "uuid";
import { MAX_FILES } from "./constants";
import { toast } from "sonner";
import { ItemAnalysisResult } from "@/hooks/useItemAnalysis";

export interface FileUploadResult {
  fileUrl: string;
  analysis: ItemAnalysisResult | null;
}

// Phase 4.5: Bulk Item Upload – vgl. docs/modules/item-upload-multiphoto.md
export function useFileUpload(orderId?: string, initialUrls: string[] = []) {
  // Get a session ID for upload tracking
  const sessionId = uuidv4();
  
  // Basic file input handling
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Neuer Status für analysierte Bilder (Phase 4.5)
  const [analyzedFiles, setAnalyzedFiles] = useState<FileUploadResult[]>([]);

  // Initialize the file uploader hook
  const { 
    uploadFile, 
    uploadFiles: uploadFilesToStorage, 
    uploadAndAnalyzeImages, 
    isUploading, 
    uploadProgress 
  } = useFileUploader();
  
  // Initialize the file previews hook
  const { 
    previews, 
    updatePreviews, 
    removePreview: removeFile, 
    clearPreviews,
    canTakeMore,
    nextPhotoIndex
  } = useFilePreviews(initialUrls);
  
  // From uploadHandler - keep this for compatibility
  const { error } = useUploadHandler({
    sessionId,
    onProgress: (progress) => console.log("Upload progress:", progress),
  });

  // Handle file select button click
  const handleFileSelect = useCallback(() => {
    if (!canTakeMore) {
      toast.error(`Maximal ${MAX_FILES} Bilder erlaubt`);
      return;
    }
    fileInputRef.current?.click();
  }, [canTakeMore]);

  // Handle file input change
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const newFiles: File[] = [];
    const newUrls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        newFiles.push(files[i]);
        const url = URL.createObjectURL(files[i]);
        newUrls.push(url);
      }
    }
    
    updatePreviews(newUrls);
    
    // Reset the file input
    e.target.value = '';
  }, [updatePreviews]);

  // Handle capture from camera
  const handleCapture = useCallback((file: File, previewUrl: string) => {
    if (validateFile(file)) {
      updatePreviews([previewUrl]);
    }
  }, [updatePreviews]);

  // Handle mobile photos upload completion
  const handleMobilePhotosComplete = useCallback((urls: string[]) => {
    updatePreviews(urls);
  }, [updatePreviews]);

  // Upload all files
  const uploadFiles = async (userId?: string): Promise<string[]> => {
    try {
      setIsLoading(true);
      
      if (!fileInputRef.current?.files?.length && previews.length === 0) {
        return [];
      }
      
      // Get files from file input
      const files = fileInputRef.current?.files 
        ? Array.from(fileInputRef.current.files) 
        : [];
      
      // Make sure we have a valid order ID
      const effectiveOrderId = orderId || uuidv4();
      
      // Upload the files to storage
      const uploadedUrls = await uploadFilesToStorage(
        effectiveOrderId, 
        userId, 
        files
      );
      
      return uploadedUrls;
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Fehler beim Hochladen der Dateien");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Neue Funktion für Phase 4.5: Upload und Analyse mehrerer Bilder
  const uploadAndAnalyzeMultipleImages = useCallback(async (userId?: string): Promise<FileUploadResult[]> => {
    try {
      setIsLoading(true);
      
      // Holen Sie die Dateien aus dem Datei-Eingabefeld
      if (!fileInputRef.current?.files?.length) {
        toast.error("Keine Dateien zum Hochladen ausgewählt");
        return [];
      }
      
      const files = Array.from(fileInputRef.current.files);
      
      // Analysiere jedes Bild einzeln
      const results = await uploadAndAnalyzeImages(files, userId);
      
      // Speichere die Ergebnisse im lokalen Zustand
      setAnalyzedFiles(results);
      
      return results;
    } catch (error) {
      console.error("Error uploading and analyzing files:", error);
      toast.error("Fehler beim Hochladen und Analysieren der Dateien");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [uploadAndAnalyzeImages]);

  return {
    fileInputRef,
    handleFileSelect,
    handleFileChange,
    handleCapture,
    handleMobilePhotosComplete,
    removeFile,
    uploadFiles,
    previews,
    isUploading,
    isLoading,
    uploadProgress,
    currentProgress: uploadProgress,
    canTakeMore,
    nextPhotoIndex,
    error,
    // Neue Funktionen für Phase 4.5
    uploadAndAnalyzeMultipleImages,
    analyzedFiles
  };
}
