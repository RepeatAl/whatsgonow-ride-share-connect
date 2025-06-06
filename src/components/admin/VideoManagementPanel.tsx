
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Trash2, AlertTriangle, RefreshCw, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useAdminVideoDelete } from '@/hooks/useAdminVideoDelete';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import type { AdminVideo } from '@/types/admin';

const VideoManagementPanel = () => {
  const { t } = useTranslation('admin');
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [consistencyData, setConsistencyData] = useState<{
    consistent: AdminVideo[];
    inconsistent: AdminVideo[];
    orphanedFiles: string[];
  }>({ consistent: [], inconsistent: [], orphanedFiles: [] });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    video: AdminVideo | null;
  }>({ open: false, video: null });

  const { deleteVideoCompletely, checkVideoConsistency, isDeleting } = useAdminVideoDelete();

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_videos')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
      
      // Check consistency after fetching
      const consistencyResult = await checkVideoConsistency();
      setConsistencyData(consistencyResult);

    } catch (error: any) {
      console.error('❌ Failed to fetch videos:', error);
      toast({
        title: t('video.error.general'),
        description: "Videos konnten nicht geladen werden.",
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
    }
  };

  const getStatusIcon = (video: AdminVideo) => {
    const isInconsistent = consistencyData.inconsistent.some(v => v.id === video.id);
    
    if (isInconsistent) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    if (video.active) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <XCircle className="h-4 w-4 text-gray-400" />;
  };

  const getStatusBadge = (video: AdminVideo) => {
    const isInconsistent = consistencyData.inconsistent.some(v => v.id === video.id);
    
    if (isInconsistent) {
      return <Badge variant="destructive">{t('video.file_missing')}</Badge>;
    }
    if (video.active) {
      return <Badge variant="default">{t('video.active')}</Badge>;
    }
    return <Badge variant="secondary">{t('video.inactive')}</Badge>;
  };

  const columns = [
    {
      id: 'status',
      header: t('video.status'),
      cell: (video: AdminVideo) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(video)}
          {getStatusBadge(video)}
        </div>
      ),
    },
    {
      id: 'title',
      header: t('video.title'),
      cell: (video: AdminVideo) => (
        <div>
          <div className="font-medium">
            {video.display_title_de || video.original_name || video.filename}
          </div>
          <div className="text-sm text-muted-foreground">
            {video.filename}
          </div>
        </div>
      ),
    },
    {
      id: 'details',
      header: 'Details',
      cell: (video: AdminVideo) => (
        <div className="text-sm space-y-1">
          <div>
            {video.public ? (
              <Badge variant="secondary">{t('video.public')}</Badge>
            ) : (
              <Badge variant="outline">{t('video.private')}</Badge>
            )}
          </div>
          <div className="text-muted-foreground">
            {Math.round((video.file_size || 0) / 1024 / 1024 * 100) / 100} MB
          </div>
          <div className="text-muted-foreground">
            {new Date(video.uploaded_at || '').toLocaleDateString('de-DE')}
          </div>
        </div>
      ),
    },
    {
      id: 'actions',
      header: t('video.actions'),
      cell: (video: AdminVideo) => (
        <Button
          variant="destructive"
          size="sm"
          disabled={isDeleting}
          onClick={() => setDeleteDialog({ open: true, video })}
          title={t('video.delete_tooltip')}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
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
          <span className="ml-2">Videos werden geladen...</span>
        </CardContent>
      </Card>
    );
  }

  const totalIssues = consistencyData.inconsistent.length + consistencyData.orphanedFiles.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">{t('video.management')}</h2>
        <p className="text-muted-foreground mt-2">
          {t('video.description')}
        </p>
      </div>

      {/* System Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('video.consistency_check')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              {totalIssues === 0 ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>{t('video.all_consistent')}</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{t('video.consistency_issues', { count: totalIssues })}</span>
                  </div>
                  {consistencyData.inconsistent.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {consistencyData.inconsistent.length} Videos ohne Storage-Datei
                    </p>
                  )}
                  {consistencyData.orphanedFiles.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {consistencyData.orphanedFiles.length} verwaiste Storage-Dateien
                    </p>
                  )}
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchVideos}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Videos Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('video.overview')} ({videos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {videos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t('video.no_videos')}</p>
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, video: deleteDialog.video })}
        title={t('video.confirm_delete')}
        description={t('video.confirm_delete_description')}
        confirmLabel={isDeleting ? t('video.deleting') : t('video.delete')}
        cancelLabel="Abbrechen"
        onConfirm={handleVideoDelete}
      />
    </div>
  );
};

export default VideoManagementPanel;
