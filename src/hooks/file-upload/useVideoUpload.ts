
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
      const filePath = `admin/${fileName}`;

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 300);

      // Upload to videos bucket
      const { data, error } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
          metadata: { 
            type: 'admin-video',
            uploadedBy: 'admin',
            originalName: file.name
          }
        });

      clearInterval(progressInterval);

      if (error) {
        console.error('Storage upload error:', error);
        throw new Error('Upload fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }

      const { data: urlData } = supabase.storage
        .from('videos')
        .getPublicUrl(data.path);

      // Store metadata in admin_videos table
      const { error: dbError } = await supabase
        .from('admin_videos')
        .insert({
          filename: fileName,
          original_name: file.name,
          file_path: data.path,
          file_size: file.size,
          mime_type: file.type,
          public_url: urlData.publicUrl,
          description: `Admin-Upload: ${file.name}`,
          tags: ['admin', 'howto'],
          uploaded_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (dbError) {
        console.error('Metadata storage error:', dbError);
        toast({
          title: "Warnung",
          description: "Video hochgeladen, aber Metadaten konnten nicht gespeichert werden.",
          variant: "destructive"
        });
      }

      setUploadedVideoUrl(urlData.publicUrl);
      setUploadProgress(100);
      
      toast({
        title: "Upload erfolgreich",
        description: `Video "${file.name}" wurde hochgeladen`,
      });
      
    } catch (error) {
      console.error('Video upload error:', error);
      const message = error instanceof Error ? error.message : 'Unbekannter Fehler beim Upload';
      
      toast({
        title: "Upload fehlgeschlagen",
        description: message,
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
