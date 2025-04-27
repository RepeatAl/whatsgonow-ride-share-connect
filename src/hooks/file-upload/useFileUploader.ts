
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

interface UseFileUploaderProps {
  onProgress?: (progress: number) => void;
}

export const useFileUploader = (props?: UseFileUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { onProgress } = props || {};

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      
      const fileName = `${uuidv4()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('order-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('order-images')
        .getPublicUrl(data.path);
      
      // Update progress
      if (onProgress) {
        onProgress(100);
      }
      setUploadProgress(100);
      
      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Fehler beim Hochladen der Datei");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadFiles = async (
    orderId: string, 
    userId: string | undefined, 
    files: File[]
  ): Promise<string[]> => {
    if (!orderId) {
      toast.error("Keine Auftrags-ID vorhanden");
      return [];
    }

    if (files.length === 0) {
      return [];
    }

    setIsUploading(true);
    setUploadProgress(0);
    const uploadedUrls: string[] = [];

    try {
      for (const [index, file] of files.entries()) {
        const filePath = `${orderId}/${uuidv4()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from('order-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('order-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(data.publicUrl);
        const progress = ((index + 1) / files.length) * 100;
        setUploadProgress(progress);
        if (onProgress) {
          onProgress(progress);
        }
      }

      return uploadedUrls;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Fehler beim Hochladen der Fotos");
      return uploadedUrls;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    uploadFiles,
    isUploading,
    uploadProgress
  };
};
