
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import type { AdminVideo } from '@/types/admin';

export const useAdminVideoDelete = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useTranslation('admin');

  const deleteVideoCompletely = async (video: AdminVideo): Promise<boolean> => {
    if (!video?.id || !video?.file_path) {
      console.error('❌ Invalid video data provided for deletion');
      toast({
        title: t('video.error.deletion_failed'),
        description: t('video.error.general'),
        variant: "destructive"
      });
      return false;
    }

    setIsDeleting(true);
    console.log('🗑️ Starting complete video deletion for:', video.id, video.file_path);

    try {
      // 1. Delete from Storage first
      const { error: storageError } = await supabase.storage
        .from('videos')
        .remove([video.file_path]);

      if (storageError) {
        console.error('❌ Storage deletion failed:', storageError);
        throw new Error(t('video.error.storage_failed'));
      }

      console.log('✅ Video file deleted from storage successfully');

      // 2. Delete thumbnail if exists
      if (video.thumbnail_url) {
        const thumbnailPath = video.file_path.replace(/\.[^/.]+$/, '_thumb.jpg');
        const { error: thumbError } = await supabase.storage
          .from('videos')
          .remove([thumbnailPath]);

        if (thumbError) {
          console.warn('⚠️ Thumbnail deletion failed (may not exist):', thumbError);
        } else {
          console.log('✅ Thumbnail deleted successfully');
        }
      }

      // 3. Delete from Database
      const { error: dbError } = await supabase
        .from('admin_videos')
        .delete()
        .eq('id', video.id);

      if (dbError) {
        console.error('❌ Database deletion failed:', dbError);
        throw new Error(t('video.error.database_failed'));
      }

      console.log('✅ Video record deleted from database successfully');

      // 4. Verify deletion
      const { data: verifyData } = await supabase
        .from('admin_videos')
        .select('id')
        .eq('id', video.id)
        .maybeSingle();

      if (verifyData) {
        console.error('❌ Video still exists after deletion!');
        throw new Error(t('video.error.deletion_failed'));
      }

      toast({
        title: t('video.deleted_success'),
        description: `"${video.display_title_de || video.original_name || video.filename}"`,
        duration: 5000
      });

      console.log('🎉 Complete video deletion successful');
      return true;

    } catch (error: any) {
      console.error('❌ Video deletion failed:', error);
      
      toast({
        title: t('video.error.deletion_failed'),
        description: error.message || t('video.error.general'),
        variant: "destructive",
        duration: 7000
      });

      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const checkVideoConsistency = async (): Promise<{
    consistent: AdminVideo[];
    inconsistent: AdminVideo[];
    orphanedFiles: string[];
  }> => {
    try {
      // Get all videos from database
      const { data: dbVideos, error: dbError } = await supabase
        .from('admin_videos')
        .select('*');

      if (dbError) throw dbError;

      // Get all files from storage
      const { data: storageFiles, error: storageError } = await supabase.storage
        .from('videos')
        .list('admin');

      if (storageError) throw storageError;

      const consistent: AdminVideo[] = [];
      const inconsistent: AdminVideo[] = [];
      const dbFilePaths = new Set(dbVideos?.map(v => v.file_path) || []);
      const storageFilePaths = new Set(storageFiles?.map(f => `admin/${f.name}`) || []);

      // Check each database video
      for (const video of dbVideos || []) {
        if (storageFilePaths.has(video.file_path)) {
          consistent.push(video);
        } else {
          inconsistent.push(video);
        }
      }

      // Find orphaned files (in storage but not in database)
      const orphanedFiles = Array.from(storageFilePaths).filter(
        path => !dbFilePaths.has(path)
      );

      return { consistent, inconsistent, orphanedFiles };

    } catch (error) {
      console.error('❌ Consistency check error:', error);
      return { consistent: [], inconsistent: [], orphanedFiles: [] };
    }
  };

  return {
    deleteVideoCompletely,
    checkVideoConsistency,
    isDeleting
  };
};
