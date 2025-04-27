
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

export const useFileUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFiles = async (
    orderId: string,
    userId: string | undefined,
    files: File[]
  ) => {
    if (!orderId) {
      toast.error("Keine Auftrags-ID vorhanden");
      return null;
    }

    if (files.length === 0) {
      toast.error("Bitte mindestens ein Foto hochladen");
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);
    const uploadedUrls: string[] = [];

    try {
      for (const [index, file] of files.entries()) {
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
        setUploadProgress(((index + 1) / files.length) * 100);
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

  return {
    uploadFiles,
    isUploading,
    uploadProgress
  };
};
