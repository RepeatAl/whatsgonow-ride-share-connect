
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Trash2, Video, RefreshCw } from 'lucide-react';
import { useAdminVideoDelete } from '@/hooks/useAdminVideoDelete';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import VideoConsistencyCheck from './VideoConsistencyCheck';
import VideoStatusIndicator from './VideoStatusIndicator';
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

  const getVideoTitle = (video: AdminVideo) => {
    return video.display_title_de || video.original_name || video.filename || t('video.untitled', { defaultValue: 'Unbenannt' });
  };

  const formatFileSize = (bytes: number) => {
    return Math.round((bytes || 0) / 1024 / 1024 * 100) / 100;
  };

  const columns = [
    {
      id: 'status',
      header: () => t('video.status', { defaultValue: 'Status' }),
      cell: (video: AdminVideo) => (
        <VideoStatusIndicator 
          video={video} 
          hasStorageFile={storageFiles.has(video.file_path)} 
        />
      ),
    },
    {
      id: 'title',
      header: () => t('video.title', { defaultValue: 'Titel' }),
      accessorKey: 'filename' as keyof AdminVideo,
      cell: (video: AdminVideo) => {
        return (
          <div className="space-y-1">
            <div className="font-medium">
              {getVideoTitle(video)}
            </div>
            <div className="text-sm text-muted-foreground">
              {video.filename}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatFileSize(video.file_size || 0)} MB
            </div>
          </div>
        );
      },
    },
    {
      id: 'details',
      header: () => t('video.details', { defaultValue: 'Details' }),
      cell: (video: AdminVideo) => {
        return (
          <div className="text-sm space-y-1">
            <div className="text-muted-foreground">
              {new Date(video.uploaded_at || '').toLocaleDateString('de-DE')}
            </div>
            {video.tags && video.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {video.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
                {video.tags.length > 2 && (
                  <span className="text-xs text-gray-500">+{video.tags.length - 2}</span>
                )}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: () => t('video.actions', { defaultValue: 'Aktionen' }),
      cell: (video: AdminVideo) => {
        return (
          <Button
            variant="destructive"
            size="sm"
            disabled={isDeleting}
            onClick={() => setDeleteDialog({ open: true, video })}
            title={t('video.delete_tooltip', { defaultValue: 'Video permanent löschen (DB + Storage)' })}
            aria-label={t('video.delete', { defaultValue: 'Video löschen' })}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

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
      {/* Header mit verbesserter UX */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Video className="h-6 w-6 text-brand-orange" />
            {t('video.management', { defaultValue: 'Video-Verwaltung' })} ({videos.length})
          </h2>
          <p className="text-muted-foreground mt-1">
            {t('video.description', { defaultValue: 'Verwalte Videos, überprüfe Konsistenz und lösche nicht benötigte Dateien.' })}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchVideos}
          disabled={loading}
          aria-label={t('video.refresh', { defaultValue: 'Aktualisieren' })}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {t('video.refresh', { defaultValue: 'Aktualisieren' })}
        </Button>
      </div>

      {/* Konsistenz-Check */}
      <VideoConsistencyCheck />

      {/* Videos Tabelle */}
      <Card>
        <CardHeader>
          <CardTitle>{t('video.overview', { defaultValue: 'Video-Übersicht' })}</CardTitle>
        </CardHeader>
        <CardContent>
          {videos.length === 0 ? (
            <div className="text-center py-12">
              <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">
                {t('video.no_videos', { defaultValue: 'Keine Videos vorhanden' })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('video.upload_hint', { defaultValue: 'Lade Videos über den Upload-Bereich hoch.' })}
              </p>
            </div>
          ) : (
            <DataTable
              data={videos}
              columns={columns}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog mit verbesserter UX */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, video: deleteDialog.video })}
        title={t('video.confirm_delete', { defaultValue: 'Video permanent löschen?' })}
        description={
          <div className="space-y-2">
            <p>
              Das Video <strong>"{deleteDialog.video ? getVideoTitle(deleteDialog.video) : ''}"</strong> wird vollständig entfernt:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Datenbank-Eintrag wird gelöscht</li>
              <li>Storage-Datei wird entfernt</li>
              <li>Thumbnail wird gelöscht (falls vorhanden)</li>
            </ul>
            <p className="text-sm font-medium text-red-600">
              Diese Aktion kann nicht rückgängig gemacht werden!
            </p>
          </div>
        }
        confirmLabel={isDeleting ? t('video.deleting', { defaultValue: 'Lösche...' }) : t('video.delete_permanent', { defaultValue: 'Permanent löschen' })}
        cancelLabel={t('video.cancel', { defaultValue: 'Abbrechen' })}
        onConfirm={handleVideoDelete}
        confirmVariant="destructive"
      />
    </div>
  );
};

export default VideoManagementPanel;
