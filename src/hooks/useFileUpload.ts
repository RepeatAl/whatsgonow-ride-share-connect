import { useState, useRef, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

        setPreviews(urls);
      } catch (error) {
        console.error('Error loading photos:', error);
        toast.error("Fehler beim Laden der gespeicherten Fotos");
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingPhotos();
  }, [orderId]);

  const handleFileSelect = () => {
    if (previews.length >= MAX_FILES) {
      toast.error(`Maximal ${MAX_FILES} Bilder erlaubt`);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + previews.length >= MAX_FILES + 1) {
      toast.error(`Maximal ${MAX_FILES} Bilder erlaubt`);
      return;
    }

    const validFiles: File[] = [];
    const validUrls: string[] = [];

    files.forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} ist größer als 2 MB`);
        return;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name} ist kein unterstütztes Format`);
        return;
      }

      validFiles.push(file);
      const url = URL.createObjectURL(file);
      validUrls.push(url);
    });

    setSelectedFiles(prev => {
      const newFiles = [...prev];
      validFiles.forEach((file, idx) => {
        const nextEmptySlot = newFiles.findIndex(f => !f);
        if (nextEmptySlot !== -1) {
          newFiles[nextEmptySlot] = file;
        } else {
          newFiles.push(file);
        }
      });
      return newFiles.slice(0, MAX_FILES);
    });

    setPreviews(prev => {
      const newPreviews = [...prev];
      validUrls.forEach((url, idx) => {
        const nextEmptySlot = newPreviews.findIndex(p => !p);
        if (nextEmptySlot !== -1) {
          newPreviews[nextEmptySlot] = url;
        } else {
          newPreviews.push(url);
        }
      });
      return newPreviews.slice(0, MAX_FILES);
    });
  };

  const handleCapture = (file: File, url: string) => {
    if (previews.length >= MAX_FILES) {
      toast.error(`Maximal ${MAX_FILES} Fotos erlaubt`);
      return;
    }

    const nextEmptySlot = previews.findIndex(p => !p);
    if (nextEmptySlot === -1) {
      toast.error(`Maximal ${MAX_FILES} Fotos erlaubt`);
      return;
    }

    setSelectedFiles(prev => {
      const newFiles = [...prev];
      newFiles[nextEmptySlot] = file;
      return newFiles;
    });

    setPreviews(prev => {
      const newPreviews = [...prev];
      newPreviews[nextEmptySlot] = url;
      return newPreviews;
    });

    toast.success(`Foto ${nextEmptySlot + 1} erfolgreich aufgenommen!`);
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

        const nextEmptySlot = previews.findIndex(p => !p);
        if (nextEmptySlot === -1) break;

        setSelectedFiles(prev => {
          const newFiles = [...prev];
          newFiles[nextEmptySlot] = file;
          return newFiles;
        });

        setPreviews(prev => {
          const newPreviews = [...prev];
          newPreviews[nextEmptySlot] = url;
          return newPreviews;
        });
      } catch (error) {
        console.error('Error processing mobile photo:', error);
        toast.error('Fehler beim Verarbeiten des Fotos');
      }
    }
  };

  const uploadFiles = async (userId?: string) => {
    if (!orderId) {
      toast.error("Keine Auftrags-ID vorhanden");
      return;
    }

    if (previews.length === 0) {
      toast.error("Bitte mindestens ein Foto hochladen");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    const uploadedUrls: string[] = [];

    try {
      const validFiles = selectedFiles.filter(Boolean);
      for (const [index, file] of validFiles.entries()) {
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `${orderId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('order-photos')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            metadata: {
              user_id: userId,
              order_id: orderId
            }
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('order-photos')
          .getPublicUrl(filePath);

        uploadedUrls.push(data.publicUrl);
        setUploadProgress(((index + 1) / validFiles.length) * 100);
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
    
    if (newPreviews[index]) {
      URL.revokeObjectURL(newPreviews[index]);
    }
    
    newFiles[index] = undefined;
    newPreviews[index] = undefined;
    
    setSelectedFiles(newFiles.filter(Boolean));
    setPreviews(newPreviews.filter(Boolean));
    
    toast.success("Bild erfolgreich entfernt");
  };

  return {
    selectedFiles,
    previews,
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
    canTakeMore: previews.filter(Boolean).length < MAX_FILES,
    nextPhotoIndex: previews.filter(Boolean).length + 1
  };
}
