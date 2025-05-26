
import { useState, useRef, useCallback } from "react";
import { validateVideoFile } from "./videoValidation";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export function useVideoUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);

  const handleVideoSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleVideoChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateVideoFile(file)) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileName = `howItWorks-${uuidv4()}.${file.name.split('.').pop()}`;
      const filePath = `videos/${fileName}`;

      const { data, error } = await supabase.storage
        .from('order-images') // Verwende existierenden Bucket
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
          metadata: { type: 'howItWorks-video' }
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('order-images')
        .getPublicUrl(data.path);

      setUploadedVideoUrl(urlData.publicUrl);
      setUploadProgress(100);
      toast.success("Video erfolgreich hochgeladen!");
      
    } catch (error) {
      console.error('Video upload error:', error);
      toast.error("Fehler beim Hochladen des Videos");
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  }, []);

  return {
    fileInputRef,
    handleVideoSelect,
    handleVideoChange,
    isUploading,
    uploadProgress,
    uploadedVideoUrl
  };
}
