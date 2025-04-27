
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useFilePreviews } from "./useFilePreviews";
import { useFileSelection } from "./useFileSelection";
import { useFileUploader } from "./useFileUploader";
import { MAX_FILES } from "./constants"; // Added import for MAX_FILES

export function useFileUpload(orderId?: string) {
  const [isLoading, setIsLoading] = useState(true);
  const { previews, updatePreviews, removePreview, canTakeMore, nextPhotoIndex } = useFilePreviews();
  const { selectedFiles, fileInputRef, handleFileSelect, addFiles, removeFile } = useFileSelection();
  const { uploadFiles, isUploading, uploadProgress } = useFileUploader();

  useEffect(() => {
    const loadExistingPhotos = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: files, error } = await supabase.storage
          .from('order-photos')
          .list(orderId);

        if (error) throw error;

        const urls = files.map(file => {
          const { data } = supabase.storage
            .from('order-photos')
            .getPublicUrl(`${orderId}/${file.name}`);
          return data.publicUrl;
        });

        updatePreviews(urls);
      } catch (error) {
        console.error('Error loading photos:', error);
        toast.error("Fehler beim Laden der gespeicherten Fotos");
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingPhotos();
  }, [orderId, updatePreviews]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + previews.length >= MAX_FILES + 1) {
      toast.error(`Maximal ${MAX_FILES} Bilder erlaubt`);
      return;
    }

    const urls = files.map(file => URL.createObjectURL(file));
    updatePreviews(urls);
    addFiles(files);
  };

  const handleCapture = (file: File, url: string) => {
    if (previews.length >= MAX_FILES) {
      toast.error(`Maximal ${MAX_FILES} Fotos erlaubt`);
      return;
    }

    updatePreviews([url]);
    addFiles([file]);
    toast.success(`Foto ${nextPhotoIndex} erfolgreich aufgenommen!`);
  };

  const handleMobilePhotosComplete = async (files: string[]) => {
    for (const url of files) {
      if (previews.length >= MAX_FILES) {
        toast.error(`Maximal ${MAX_FILES} Fotos erlaubt`);
        break;
      }

      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], `mobile-photo-${Date.now()}.jpg`, {
          type: 'image/jpeg'
        });

        handleCapture(file, url);
      } catch (error) {
        console.error('Error processing mobile photo:', error);
        toast.error('Fehler beim Verarbeiten des Fotos');
      }
    }
  };

  return {
    selectedFiles,
    previews,
    fileInputRef,
    handleFileSelect,
    handleFileChange,
    handleCapture,
    handleMobilePhotosComplete,
    removeFile: (index: number) => {
      removeFile(index);
      removePreview(index);
      toast.success("Bild erfolgreich entfernt");
    },
    uploadFiles: (userId?: string) => uploadFiles(orderId!, userId, selectedFiles),
    isUploading,
    isLoading,
    uploadProgress,
    canTakeMore,
    nextPhotoIndex
  };
}

export * from './constants';
