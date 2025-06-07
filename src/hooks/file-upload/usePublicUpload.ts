
import { useState, useCallback } from "react";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";
import { useGuestUpload } from "./useGuestUpload";
import { useFileUploader } from "./useFileUploader";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface UsePublicUploadProps {
  orderId?: string;
  onProgress?: (progress: number) => void;
}

export function usePublicUpload({ orderId, onProgress }: UsePublicUploadProps = {}) {
  const { user } = useOptimizedAuth();
  const { t } = useTranslation(['upload']);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Initialize both upload methods
  const guestUpload = useGuestUpload({ onProgress });
  const authenticatedUpload = useFileUploader({ onProgress });

  // Smart upload that chooses method based on auth status
  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      if (user) {
        // Authenticated user - upload directly to order-images
        const url = await authenticatedUpload.uploadFile(file, user.id);
        if (url) {
          toast.success(t('upload:authenticated_upload_success', 'Bild erfolgreich hochgeladen'));
        }
        return url;
      } else {
        // Guest user - upload to guest bucket
        return await guestUpload.uploadGuestFile(file);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(t('upload:upload_error', 'Fehler beim Hochladen'));
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [user, authenticatedUpload, guestUpload, t]);

  // Handle multiple files upload
  const uploadFiles = useCallback(async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];

    const uploadedUrls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const progress = ((i + 1) / files.length) * 100;
      setUploadProgress(progress);
      if (onProgress) onProgress(progress);

      const url = await uploadFile(file);
      if (url) {
        uploadedUrls.push(url);
      }
    }

    return uploadedUrls;
  }, [uploadFile, onProgress]);

  // Migrate guest uploads after login
  const handlePostLoginMigration = useCallback(async (userId: string): Promise<string[]> => {
    if (!user || user.id !== userId) {
      console.warn('Migration called but user not matching');
      return [];
    }

    return await guestUpload.migrateToUserAccount(userId);
  }, [user, guestUpload]);

  // Generate QR code for mobile upload
  const generateQrCodeUrl = useCallback(async () => {
    return await guestUpload.generateMobileUploadUrl();
  }, [guestUpload]);

  return {
    uploadFile,
    uploadFiles,
    handlePostLoginMigration,
    generateQrCodeUrl,
    isUploading: isUploading || guestUpload.isUploading || authenticatedUpload.isUploading,
    uploadProgress: Math.max(uploadProgress, guestUpload.uploadProgress, authenticatedUpload.uploadProgress),
    isGuest: !user,
    guestSession: guestUpload.currentSession
  };
}
