
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import imageCompression from "browser-image-compression";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_FILES = 4;
const TARGET_FILE_SIZE = 1024 * 1024; // 1MB

interface UseUploadHandlerProps {
  sessionId: string;
  onProgress?: (progress: number) => void;
}

export function useUploadHandler({ sessionId, onProgress }: UseUploadHandlerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);

  const uploadFile = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      setError(null);

      if (file.size > MAX_FILE_SIZE) {
        throw new Error('Datei ist zu groß (max 2MB)');
      }

      // Komprimiere das Bild
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      const fileName = `${sessionId}/${Date.now()}.${file.name.split('.').pop()}`;

      // Upload the file without the onUploadProgress option
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, compressedFile);

      if (uploadError) throw uploadError;

      // Use separate progress tracking (we'll update it manually since the API doesn't support progress)
      setCurrentProgress(100);
      onProgress?.(100); // Indicate completion

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      await supabase.from('upload_events').insert({
        session_id: sessionId,
        event_type: 'file_uploaded',
        payload: { file_url: publicUrl }
      });

      return publicUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload fehlgeschlagen';
      setError(message);
      throw new Error(message);
    } finally {
      setIsUploading(false);
      setCurrentProgress(0);
    }
  };

  return { uploadFile, isUploading, currentProgress, error };
}
