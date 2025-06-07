
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import type { GuestUploadSession } from "@/types/upload";

export interface MigrationResult {
  success: boolean;
  migratedUrls: string[];
  error?: string;
}

export const migrateGuestUploadsToUserAccount = async (
  session: GuestUploadSession,
  userId: string,
  t: (key: string, defaultValue?: string) => string
): Promise<MigrationResult> => {
  try {
    const sessionId = session.session_id;
    console.log('🔄 Starting migration for session:', sessionId, 'to user:', userId);
    
    // Get all files from guest session
    const { data: files } = await supabase.storage
      .from('guest-uploads')
      .list(sessionId);

    if (!files || files.length === 0) {
      console.log('📁 No files to migrate');
      return { success: true, migratedUrls: [] };
    }

    console.log(`📦 Found ${files.length} files to migrate`);
    const migratedUrls: string[] = [];

    for (const file of files) {
      try {
        const oldPath = `${sessionId}/${file.name}`;
        const newPath = `${userId}/${uuidv4()}-${file.name}`;

        console.log(`🔄 Migrating file: ${file.name}`);

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
                migratedAt: new Date().toISOString(),
                originalLocation: session.lat && session.lng ? {
                  lat: session.lat,
                  lng: session.lng,
                  accuracy: session.accuracy
                } : null
              }
            });

          if (!uploadError && uploadData) {
            const { data: urlData } = supabase.storage
              .from('order-images')
              .getPublicUrl(uploadData.path);
            
            migratedUrls.push(urlData.publicUrl);
            console.log(`✅ File migrated: ${file.name}`);

            // Delete from guest bucket
            await supabase.storage
              .from('guest-uploads')
              .remove([oldPath]);
          } else {
            console.error(`❌ Failed to upload file ${file.name}:`, uploadError);
          }
        }
      } catch (error) {
        console.error(`❌ Error migrating file ${file.name}:`, error);
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

    console.log(`✅ Migration completed: ${migratedUrls.length} files migrated`);
    toast.success(t('upload:migration_success', 'Bilder erfolgreich in Ihr Konto übernommen'));
    
    return { success: true, migratedUrls };
  } catch (error) {
    console.error('❌ Error migrating guest uploads:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    toast.error(t('upload:migration_error', 'Fehler beim Übernehmen der Bilder'));
    
    return { success: false, migratedUrls: [], error: errorMessage };
  }
};
