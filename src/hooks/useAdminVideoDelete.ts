
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import type { AdminVideo } from '@/types/admin';

export const useAdminVideoDelete = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteVideoCompletely = async (video: AdminVideo): Promise<boolean> => {
    if (!video?.id) {
      console.error('❌ No valid video provided for deletion');
      toast({
        title: "Fehler",
        description: "Ungültiges Video für Löschung",
        variant: "destructive"
      });
      return false;
    }

    setIsDeleting(true);
    console.log('🗑️ Starting complete video deletion for:', video.id);

    try {
      // 1. Audit the deletion request
      const { error: auditError } = await supabase.rpc('audit_video_deletion', {
        video_id: video.id,
        deletion_reason: 'Admin UI deletion'
      });

      if (auditError) {
        console.error('❌ Audit failed:', auditError);
        throw new Error(`Audit failed: ${auditError.message}`);
      }

      // 2. Check for dependencies and storage consistency
      const { data: consistencyCheck, error: checkError } = await supabase.rpc('check_video_storage_consistency');
      
      if (checkError) {
        console.warn('⚠️ Consistency check failed, proceeding anyway:', checkError);
      } else {
        const videoIssues = consistencyCheck?.filter((issue: any) => issue.video_id === video.id);
        if (videoIssues?.length > 0) {
          console.log('ℹ️ Found issues for this video:', videoIssues);
        }
      }

      // 3. Create backup before deletion
      const { data: backupId, error: backupError } = await supabase.rpc('create_video_deletion_backup');
      
      if (backupError) {
        console.warn('⚠️ Backup creation failed, proceeding anyway:', backupError);
      } else {
        console.log('✅ Backup created:', backupId);
      }

      // 4. REAL DELETION - This triggers the cleanup trigger
      const { error: deleteError } = await supabase
        .from('admin_videos')
        .delete()
        .eq('id', video.id);

      if (deleteError) {
        console.error('❌ Video deletion failed:', deleteError);
        throw new Error(`Deletion failed: ${deleteError.message}`);
      }

      console.log('✅ Video successfully deleted from database');

      // 5. Verify cleanup was successful
      const { data: verifyData } = await supabase
        .from('admin_videos')
        .select('id')
        .eq('id', video.id)
        .maybeSingle();

      if (verifyData) {
        console.error('❌ Video still exists after deletion!');
        throw new Error('Video deletion verification failed');
      }

      // 6. Final consistency check
      const { data: finalCheck } = await supabase.rpc('check_video_storage_consistency');
      const remainingIssues = finalCheck?.filter((issue: any) => 
        issue.video_id === video.id || issue.filename === video.filename
      );

      if (remainingIssues?.length > 0) {
        console.warn('⚠️ Some cleanup issues remain:', remainingIssues);
      }

      toast({
        title: "Erfolg",
        description: `Video "${video.original_name || video.filename}" wurde vollständig gelöscht.`,
        duration: 5000
      });

      console.log('🎉 Complete video deletion successful');
      return true;

    } catch (error: any) {
      console.error('❌ Video deletion failed:', error);
      
      toast({
        title: "Löschung fehlgeschlagen",
        description: error.message || "Unbekannter Fehler beim Löschen des Videos.",
        variant: "destructive",
        duration: 7000
      });

      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const checkVideoConsistency = async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase.rpc('check_video_storage_consistency');
      
      if (error) {
        console.error('❌ Consistency check failed:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Consistency check error:', error);
      return [];
    }
  };

  return {
    deleteVideoCompletely,
    checkVideoConsistency,
    isDeleting
  };
};
