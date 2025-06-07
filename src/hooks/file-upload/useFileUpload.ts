
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analyzedFiles, setAnalyzedFiles] = useState<FileUploadResult[]>([]);

  // Hooks for upload logic, previews, and error tracking
  const { 
    uploadFile, 
    uploadFiles: uploadFilesToStorage, 
    uploadAndAnalyzeImages, 
    isUploading, 
    uploadProgress 
  } = useFileUploader();

  const { 
    previews, 
    updatePreviews, 
    removePreview: removeFile, 
    clearPreviews,
    canTakeMore,
    nextPhotoIndex
  } = useFilePreviews(initialUrls);

  const { error } = useUploadHandler({
    sessionId,
    onProgress: (progress) => console.log("Upload progress:", progress),
  });

  // Select files from input
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

    // Reset input value so that same file can be selected again
    e.target.value = '';
  }, [updatePreviews]);

  // Handle direct camera/photo upload
  const handleCapture = useCallback((file: File, previewUrl: string) => {
    if (validateFile(file)) {
      updatePreviews([previewUrl]);
    }
  }, [updatePreviews]);

  // For mobile uploads
  const handleMobilePhotosComplete = useCallback((urls: string[]) => {
    updatePreviews(urls);
  }, [updatePreviews]);

  // Upload all files (standard, not analysis)
  const uploadFiles = async (userId?: string): Promise<string[]> => {
    try {
      setIsLoading(true);

      if (!fileInputRef.current?.files?.length && previews.length === 0) {
        return [];
      }

      const files = fileInputRef.current?.files 
        ? Array.from(fileInputRef.current.files) 
        : [];

      const effectiveOrderId = orderId || uuidv4();

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

  // Upload and analyze images (Phase 4.5)
  const uploadAndAnalyzeMultipleImages = useCallback(async (userId?: string): Promise<FileUploadResult[]> => {
    try {
      setIsLoading(true);

      if (!fileInputRef.current?.files?.length) {
        toast.error("Keine Dateien zum Hochladen ausgewählt");
        return [];
      }

      const files = Array.from(fileInputRef.current.files);

      const results = await uploadAndAnalyzeImages(files, userId);

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
    uploadAndAnalyzeMultipleImages,
    analyzedFiles
  };
}
