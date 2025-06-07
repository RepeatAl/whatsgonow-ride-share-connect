
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface UseGuestUploadProps {
  onProgress?: (progress: number) => void;
}

interface GuestUploadSession {
  sessionId: string;
  createdAt: string;
  expiresAt: string;
  fileCount: number;
}

export function useGuestUpload(props?: UseGuestUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentSession, setCurrentSession] = useState<GuestUploadSession | null>(null);
  const { onProgress } = props || {};
  const { t } = useTranslation(['upload', 'common']);

  // Create or get existing session
  const initializeSession = useCallback(async () => {
    try {
      // Check if session exists in localStorage
      const existingSessionId = localStorage.getItem('whatsgonow-guest-session');
      
      if (existingSessionId) {
        // Verify session is still valid
        const { data: sessionData } = await supabase
          .from('guest_upload_sessions')
          .select('*')
          .eq('session_id', existingSessionId)
          .gt('expires_at', new Date().toISOString())
          .single();
          
        if (sessionData) {
          setCurrentSession({
            sessionId: sessionData.session_id,
            createdAt: sessionData.created_at,
            expiresAt: sessionData.expires_at,
            fileCount: sessionData.file_count
          });
          return sessionData.session_id;
        }
      }

      // Create new session
      const newSessionId = uuidv4();
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

      const { data, error } = await supabase
        .from('guest_upload_sessions')
        .insert({
          session_id: newSessionId,
          expires_at: expiresAt.toISOString(),
          file_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      localStorage.setItem('whatsgonow-guest-session', newSessionId);
      
      const newSession = {
        sessionId: newSessionId,
        createdAt: data.created_at,
        expiresAt: data.expires_at,
        fileCount: 0
      };
      
      setCurrentSession(newSession);
      return newSessionId;
    } catch (error) {
      console.error('Error initializing guest session:', error);
      toast.error(t('upload:session_error', 'Fehler beim Erstellen der Upload-Session'));
      return null;
    }
  }, [t]);

  // Upload file to guest bucket
  const uploadGuestFile = useCallback(async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const sessionId = await initializeSession();
      if (!sessionId) return null;

      // Create file path with session
      const fileName = `${uuidv4()}-${file.name}`;
      const filePath = `${sessionId}/${fileName}`;

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
      await supabase
        .from('guest_upload_sessions')
        .update({ file_count: (currentSession?.fileCount || 0) + 1 })
        .eq('session_id', sessionId);

      const { data: urlData } = supabase.storage
        .from('guest-uploads')
        .getPublicUrl(data.path);

      setUploadProgress(100);
      if (onProgress) onProgress(100);

      toast.success(t('upload:guest_upload_success', 'Bild erfolgreich hochgeladen (temporär)'));
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Guest upload error:', error);
      toast.error(t('upload:guest_upload_error', 'Fehler beim Upload'));
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [currentSession, initializeSession, onProgress, t]);

  // Migrate guest uploads to user account
  const migrateToUserAccount = useCallback(async (userId: string): Promise<string[]> => {
    if (!currentSession) return [];

    try {
      const sessionId = currentSession.sessionId;
      
      // Get all files from guest session
      const { data: files } = await supabase.storage
        .from('guest-uploads')
        .list(sessionId);

      if (!files || files.length === 0) return [];

      const migratedUrls: string[] = [];

      for (const file of files) {
        try {
          const oldPath = `${sessionId}/${file.name}`;
          const newPath = `${userId}/${uuidv4()}-${file.name}`;

          // Download file from guest bucket
          const { data: fileData } = await supabase.storage
            .from('guest-uploads')
            .download(oldPath);

          if (fileData) {
            // Upload to user bucket
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('order-images')
              .upload(newPath, fileData, {
                cacheControl: '3600',
                upsert: false,
                metadata: { 
                  owner: userId,
                  migratedFrom: sessionId,
                  migratedAt: new Date().toISOString()
                }
              });

            if (!uploadError && uploadData) {
              const { data: urlData } = supabase.storage
                .from('order-images')
                .getPublicUrl(uploadData.path);
              
              migratedUrls.push(urlData.publicUrl);

              // Delete from guest bucket
              await supabase.storage
                .from('guest-uploads')
                .remove([oldPath]);
            }
          }
        } catch (error) {
          console.error(`Error migrating file ${file.name}:`, error);
        }
      }

      // Update session as migrated
      await supabase
        .from('guest_upload_sessions')
        .update({
          migrated_to_user_id: userId,
          migrated_at: new Date().toISOString()
        })
        .eq('session_id', sessionId);

      // Clear local session
      localStorage.removeItem('whatsgonow-guest-session');
      setCurrentSession(null);

      toast.success(t('upload:migration_success', 'Bilder erfolgreich in Ihr Konto übernommen'));
      
      return migratedUrls;
    } catch (error) {
      console.error('Error migrating guest uploads:', error);
      toast.error(t('upload:migration_error', 'Fehler beim Übernehmen der Bilder'));
      return [];
    }
  }, [currentSession, t]);

  // Generate QR code URL for mobile upload
  const generateMobileUploadUrl = useCallback(async () => {
    const sessionId = await initializeSession();
    if (!sessionId) return null;

    const baseUrl = window.location.origin;
    return `${baseUrl}/mobile-upload?session=${sessionId}`;
  }, [initializeSession]);

  return {
    uploadGuestFile,
    migrateToUserAccount,
    generateMobileUploadUrl,
    initializeSession,
    currentSession,
    isUploading,
    uploadProgress
  };
}
