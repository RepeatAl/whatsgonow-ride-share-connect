// 🔒 SYSTEM LOCKED – Änderungen nur mit Freigabe durch @Christiane
// Status: FINAL - EINGEFROREN (2025-06-07)

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminVideoDelete } from '@/hooks/useAdminVideoDelete';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import VideoConsistencyCheck from './VideoConsistencyCheck';
import VideoManagementHeader from './VideoManagementHeader';
import VideoTable from './VideoTable';
import VideoDeleteDialog from './VideoDeleteDialog';
import VideoEmptyState from './VideoEmptyState';
import type { AdminVideo } from '@/types/admin';

const VideoManagementPanel = () => {
  const { t } = useTranslation('admin');
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [storageFiles, setStorageFiles] = useState<Set<string>>(new Set());
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    video: AdminVideo | null;
  }>({ open: false, video: null });

  const { deleteVideoCompletely, isDeleting } = useAdminVideoDelete();

  const fetchVideos = async () => {
    setLoading(true);
    try {
      // Videos aus DB laden
      const { data: videosData, error: videosError } = await supabase
        .from('admin_videos')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (videosError) throw videosError;

      // Storage-Dateien laden
      const { data: storageData, error: storageError } = await supabase.storage
        .from('videos')
        .list('admin');

      if (storageError) {
        console.warn('Storage listing failed:', storageError);
      }

      const storageSet = new Set(
        storageData?.map(file => `admin/${file.name}`) || []
      );

      setVideos(videosData || []);
      setStorageFiles(storageSet);

    } catch (error: any) {
      console.error('❌ Failed to fetch videos:', error);
      toast({
        title: t('video.error.general', { defaultValue: 'Fehler beim Laden' }),
        description: t('video.loading_failed', { defaultValue: 'Videos konnten nicht geladen werden.' }),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVideoDelete = async () => {
    if (!deleteDialog.video) return;
    
    const success = await deleteVideoCompletely(deleteDialog.video);
    if (success) {
      setDeleteDialog({ open: false, video: null });
      await fetchVideos(); // Refresh the list
      toast({
        title: t('video.deleted_success', { defaultValue: '✅ Video gelöscht' }),
        description: `"${deleteDialog.video.display_title_de || deleteDialog.video.filename}" wurde vollständig entfernt.`,
      });
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
          <span className="ml-2">{t('video.loading', { defaultValue: 'Videos werden geladen...' })}</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <VideoManagementHeader 
        videoCount={videos.length}
        loading={loading}
        onRefresh={fetchVideos}
      />

      <VideoConsistencyCheck />

      <Card>
        <CardHeader>
          <CardTitle>{t('video.overview', { defaultValue: 'Video-Übersicht' })}</CardTitle>
        </CardHeader>
        <CardContent>
          {videos.length === 0 ? (
            <VideoEmptyState />
          ) : (
            <VideoTable
              videos={videos}
              storageFiles={storageFiles}
              loading={loading}
              isDeleting={isDeleting}
              onDeleteClick={(video) => setDeleteDialog({ open: true, video })}
            />
          )}
        </CardContent>
      </Card>

      <VideoDeleteDialog
        open={deleteDialog.open}
        video={deleteDialog.video}
        isDeleting={isDeleting}
        onOpenChange={(open) => setDeleteDialog({ open, video: deleteDialog.video })}
        onConfirm={handleVideoDelete}
      />
    </div>
  );
};

export default VideoManagementPanel;
