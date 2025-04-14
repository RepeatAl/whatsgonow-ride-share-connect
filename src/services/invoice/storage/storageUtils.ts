
import { supabase } from '@/lib/supabaseClient';
import { toast } from "@/hooks/use-toast";

// File size limit in bytes (10MB)
export const FILE_SIZE_LIMIT = 10 * 1024 * 1024;

// Allowed MIME types
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/xml',
  'text/xml',
  'application/json'
];

/**
 * Utility for handling file uploads to Supabase Storage
 */
export const storageUtils = {
  /**
   * Upload a file to Supabase Storage
   * @param bucket - The bucket name
   * @param path - The file path within the bucket
   * @param file - The file to upload (File, Blob, or Buffer)
   * @param contentType - The content type of the file
   * @returns Promise with the uploaded file URL if successful, null if failed
   */
  uploadFile: async (
    bucket: string,
    path: string,
    file: File | Blob | Buffer,
    contentType: string
  ): Promise<{ url?: string; path: string } | null> => {
    try {
      // Validate file size
      const fileSize = file instanceof Buffer ? file.length : file.size;
      if (fileSize > FILE_SIZE_LIMIT) {
        toast({
          title: "Fehler",
          description: "Die Datei ist zu groß. Maximale Größe ist 10MB.",
          variant: "destructive"
        });
        return null;
      }

      // Validate MIME type
      if (!ALLOWED_MIME_TYPES.includes(contentType)) {
        toast({
          title: "Fehler",
          description: "Dateityp nicht unterstützt. Erlaubte Typen: PDF, XML, JSON",
          variant: "destructive"
        });
        return null;
      }

      // Upload file to Supabase Storage
      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          contentType,
          upsert: true
        });

      if (error) {
        console.error("Error uploading file:", error);
        throw error;
      }

      // Create signed URL for private buckets
      const { data: urlData } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 60 * 60 * 24 * 7); // 7 days expiry

      return {
        url: urlData?.signedUrl,
        path
      };
    } catch (error) {
      console.error("Error in uploadFile:", error);
      toast({
        title: "Fehler",
        description: "Die Datei konnte nicht hochgeladen werden.",
        variant: "destructive"
      });
      return null;
    }
  }
};
