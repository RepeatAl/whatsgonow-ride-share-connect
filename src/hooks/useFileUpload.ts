import { useState, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

const MAX_FILES = 4;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function useFileUpload(orderId?: string) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > MAX_FILES) {
      toast.error(`Maximal ${MAX_FILES} Bilder erlaubt.`);
      return;
    }

    const validFiles: File[] = [];
    const validPreviews: string[] = [];

    files.forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} ist größer als 2 MB.`);
        return;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name} ist kein unterstütztes Format.`);
        return;
      }
      validFiles.push(file);
      const url = URL.createObjectURL(file);
      validPreviews.push(url);
    });

    setSelectedFiles([...selectedFiles, ...validFiles]);
    setPreviews([...previews, ...validPreviews]);
  };

  const handleCapture = (file: File, url: string) => {
    if (selectedFiles.length < MAX_FILES) {
      setSelectedFiles([...selectedFiles, file]);
      setPreviews([...previews, url]);
      toast.success(`Foto ${selectedFiles.length + 1} erfolgreich aufgenommen!`);
    } else {
      toast.error(`Maximal ${MAX_FILES} Fotos erlaubt.`);
    }
  };

  const handleMobilePhotosComplete = (files: string[]) => {
    files.forEach(async url => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], `mobile-photo-${Date.now()}.jpg`, {
          type: 'image/jpeg'
        });
        
        if (selectedFiles.length + 1 <= MAX_FILES) {
          setSelectedFiles([...selectedFiles, file]);
          setPreviews([...previews, url]);
        } else {
          toast.error(`Maximal ${MAX_FILES} Fotos erlaubt.`);
        }
      } catch (error) {
        console.error('Error processing mobile photo:', error);
        toast.error('Fehler beim Verarbeiten des Fotos');
      }
    });
  };

  const uploadFiles = async () => {
    if (!orderId) {
      toast.error("Keine Auftrags-ID vorhanden");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    const uploadedUrls: string[] = [];

    try {
      for (const [index, file] of selectedFiles.entries()) {
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `${orderId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('order-photos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('order-photos')
          .getPublicUrl(filePath);

        uploadedUrls.push(data.publicUrl);
        setUploadProgress(((index + 1) / selectedFiles.length) * 100);
      }

      toast.success("Fotos erfolgreich hochgeladen!");
      return uploadedUrls;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Fehler beim Hochladen der Fotos");
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...previews];
    
    URL.revokeObjectURL(newPreviews[index]);
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
    
    toast.success("Bild erfolgreich entfernt");
  };

  return {
    selectedFiles,
    setSelectedFiles,
    previews,
    setPreviews,
    fileInputRef,
    handleFileSelect,
    handleFileChange,
    handleCapture,
    handleMobilePhotosComplete,
    removeFile,
    uploadFiles,
    isUploading,
    uploadProgress,
    canTakeMore: selectedFiles.length < MAX_FILES,
    nextPhotoIndex: selectedFiles.length + 1
  };
}
