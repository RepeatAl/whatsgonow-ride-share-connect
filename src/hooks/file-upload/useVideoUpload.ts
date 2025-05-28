
import { useState, useRef, useCallback } from "react";
import { validateVideoFile } from "./videoValidation";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";

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
      const fileName = `admin-${uuidv4()}.${file.name.split('.').pop()}`;
      const filePath = `videos/${fileName}`;

      // Create videos bucket if it doesn't exist
      const { data: buckets } = await supabase.storage.listBuckets();
      const videoBucketExists = buckets?.some(bucket => bucket.name === 'videos');
      
      if (!videoBucketExists) {
        await supabase.storage.createBucket('videos', {
          public: true,
          allowedMimeTypes: ['video/mp4', 'video/webm', 'video/mov', 'video/quicktime'],
          fileSizeLimit: 52428800 // 50MB
        });
      }

      // Upload file with progress tracking
      const { data, error } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
          metadata: { 
            type: 'admin-video',
            uploadedBy: 'admin'
          }
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('videos')
        .getPublicUrl(data.path);

      setUploadedVideoUrl(urlData.publicUrl);
      setUploadProgress(100);
      
      toast({
        title: "Upload erfolgreich",
        description: `Video "${file.name}" wurde hochgeladen`,
      });
      
    } catch (error) {
      console.error('Video upload error:', error);
      toast({
        title: "Upload fehlgeschlagen",
        description: "Bitte versuche es erneut",
        variant: "destructive"
      });
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
