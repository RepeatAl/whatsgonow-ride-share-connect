
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import type { GuestUploadSession, GeoLocation } from "@/types/upload";
import { createGuestSession } from "./guest/createGuestSession";
import { updateGuestSessionGeolocation, requestGeolocationPermission } from "./guest/updateGuestSessionGeolocation";
import { migrateGuestUploadsToUserAccount } from "./guest/migrateToUserAccount";
import { generateGuestFileName, generateGuestFilePath, generateMobileUploadUrl as generateUploadUrlUtility, cleanupGuestSession } from "./guest/guestUploadUtils";

interface UseGuestUploadProps {
  onProgress?: (progress: number) => void;
}

export function useGuestUpload(props?: UseGuestUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentSession, setCurrentSession] = useState<GuestUploadSession | null>(null);
  const [currentLocation, setCurrentLocation] = useState<GeoLocation | null>(null);
  const { onProgress } = props || {};
  const { t } = useTranslation(['upload', 'common']);
  const translate: TFunction = t;

  // Initialize session
  const initializeSession = useCallback(async () => {
    const result = await createGuestSession();
    if (result) {
      setCurrentSession(result.session);
      return result.sessionId;
    }
    toast.error(translate('upload:session_error', 'Fehler beim Erstellen der Upload-Session'));
    return null;
  }, [translate]);

  // Update session location
  const updateSessionLocation = useCallback(async (location: GeoLocation | null) => {
    if (!currentSession) return false;

    const result = await updateGuestSessionGeolocation(currentSession, location, translate);
    
    if (result.success) {
      setCurrentSession(result.session);
      setCurrentLocation(result.location);
      return true;
    }
    
    return false;
  }, [currentSession, translate]);

  // Request geolocation
  const requestLocation = useCallback(async () => {
    const location = await requestGeolocationPermission(translate);
    if (location && currentSession) {
      await updateSessionLocation(location);
    }
    return location;
  }, [currentSession, updateSessionLocation, translate]);

  // Upload file to guest bucket
  const uploadGuestFile = useCallback(async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const sessionId = await initializeSession();
      if (!sessionId) return null;

      console.log('📤 Starting guest file upload:', file.name);

      // Create file path with session
      const fileName = generateGuestFileName(file.name);
      const filePath = generateGuestFilePath(sessionId, fileName);

      const { data, error } = await supabase.storage
        .from('guest-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
          metadata: { 
            sessionId: sessionId,
            originalName: file.name,
            uploadedAt: new Date().toISOString()
          }
        });

      if (error) throw error;

      // Update session file count
      if (currentSession) {
        await supabase
          .from('guest_upload_sessions')
          .update({ file_count: (currentSession.file_count || 0) + 1 })
          .eq('session_id', sessionId);

        setCurrentSession(prev => prev ? { 
          ...prev, 
          file_count: (prev.file_count || 0) + 1 
        } : null);
      }

      const { data: urlData } = supabase.storage
        .from('guest-uploads')
        .getPublicUrl(data.path);

      setUploadProgress(100);
      if (onProgress) onProgress(100);

      console.log('✅ Guest file uploaded successfully');
      toast.success(translate('upload:guest_upload_success', 'Bild erfolgreich hochgeladen (temporär)'));
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('❌ Guest upload error:', error);
      toast.error(translate('upload:guest_upload_error', 'Fehler beim Upload'));
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [currentSession, initializeSession, onProgress, translate]);

  // Migrate guest uploads to user account
  const migrateToUserAccount = useCallback(async (userId: string): Promise<string[]> => {
    if (!currentSession) {
      console.warn('⚠️ Migration called but no session available');
      return [];
    }

    console.log('🔄 Starting migration to user account:', userId);
    const result = await migrateGuestUploadsToUserAccount(currentSession, userId, translate);
    
    if (result.success) {
      // Clear local state
      setCurrentSession(null);
      setCurrentLocation(null);
      return result.migratedUrls;
    }
    
    return [];
  }, [currentSession, translate]);

  // Generate QR code URL for mobile upload
  const generateMobileUploadUrl = useCallback(async () => {
    const sessionId = await initializeSession();
    if (!sessionId) return null;

    return generateUploadUrlUtility(sessionId);
  }, [initializeSession]);

  return {
    uploadGuestFile,
    migrateToUserAccount,
    generateMobileUploadUrl,
    initializeSession,
    updateSessionLocation,
    requestLocation,
    currentSession,
    currentLocation,
    isUploading,
    uploadProgress
  };
}
