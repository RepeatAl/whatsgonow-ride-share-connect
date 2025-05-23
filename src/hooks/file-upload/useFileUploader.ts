import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { ItemAnalysisResult } from "@/hooks/useItemAnalysis";

interface UseFileUploaderProps {
  onProgress?: (progress: number) => void;
  bucketName?: string;
}

export const useFileUploader = (props?: UseFileUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { onProgress, bucketName = 'order-images' } = props || {};

  const uploadFile = async (file: File, userId?: string): Promise<string | null> => {
    try {
      setIsUploading(true);

      const fileName = `${uuidv4()}-${file.name}`;
      let filePath = fileName;
      if (userId) {
        filePath = `${userId}/${fileName}`;
      }

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
          metadata: { owner: userId || '' }
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      if (onProgress) onProgress(100);
      setUploadProgress(100);

      return urlData.publicUrl;
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
    files: File[],
    customBucket?: string
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
    const bucket = customBucket || bucketName;

    try {
      for (const [index, file] of files.entries()) {
        const filePath = userId
          ? `${userId}/${orderId}/${uuidv4()}-${file.name}`
          : `${orderId}/${uuidv4()}-${file.name}`;

        const { error: uploadError, data } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type,
            metadata: { owner: userId || '', orderId }
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);
        const progress = ((index + 1) / files.length) * 100;
        setUploadProgress(progress);
        if (onProgress) onProgress(progress);
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

  // Phase 4.5: Bulk Item Upload mit Analyse
  const uploadAndAnalyzeImages = async (
    files: File[],
    userId?: string
  ): Promise<{ fileUrl: string; analysis: ItemAnalysisResult | null }[]> => {
    if (files.length === 0) {
      return [];
    }

    setIsUploading(true);
    setUploadProgress(0);
    const results: { fileUrl: string; analysis: ItemAnalysisResult | null }[] = [];
    const tempOrderId = uuidv4();

    try {
      for (const [index, file] of files.entries()) {
        try {
          const filePath = userId
            ? `${userId}/temp/${tempOrderId}/${uuidv4()}-${file.name}`
            : `temp/${tempOrderId}/${uuidv4()}-${file.name}`;

          const { error: uploadError, data } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false,
              contentType: file.type,
              metadata: { owner: userId || '' }
            });

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

          if (!urlData.publicUrl) throw new Error("Konnte keine öffentliche URL für das Bild erhalten");

          const response = await supabase.functions.invoke("analyze-item-photo", {
            body: {
              item_id: crypto.randomUUID(),
              photo_url: urlData.publicUrl
            }
          });

          let analysisResult: ItemAnalysisResult | null = null;
          if (response.error) {
            console.error("Fehler bei der Bildanalyse:", response.error);
            toast.error(`Analyse für Bild ${index + 1} fehlgeschlagen`);
          } else {
            analysisResult = response.data as ItemAnalysisResult;
          }

          results.push({ fileUrl: urlData.publicUrl, analysis: analysisResult });
          const progress = ((index + 1) / files.length) * 100;
          setUploadProgress(progress);
          if (onProgress) onProgress(progress);

        } catch (error) {
          console.error(`Fehler bei Bild ${index + 1}:`, error);
          toast.error(`Bild ${index + 1} konnte nicht verarbeitet werden`);
        }
      }
      return results;
    } catch (error) {
      console.error('Fehler beim Hochladen und Analysieren:', error);
      toast.error("Der Prozess konnte nicht abgeschlossen werden");
      return results;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    uploadFiles,
    uploadAndAnalyzeImages,
    isUploading,
    uploadProgress
  };
};
