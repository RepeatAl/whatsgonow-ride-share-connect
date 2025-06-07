// 🔒 SYSTEM LOCKED – Änderungen nur mit Freigabe durch @Christiane
// Status: FINAL - EINGEFROREN (2025-06-07)

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DataTable, SimpleColumn } from '@/components/ui/data-table';
import { Trash2 } from 'lucide-react';
import VideoStatusIndicator from './VideoStatusIndicator';
import type { AdminVideo } from '@/types/admin';

interface VideoTableProps {
  videos: AdminVideo[];
  storageFiles: Set<string>;
  loading: boolean;
  isDeleting: boolean;
  onDeleteClick: (video: AdminVideo) => void;
}

const VideoTable = ({ videos, storageFiles, loading, isDeleting, onDeleteClick }: VideoTableProps) => {
  const { t } = useTranslation('admin');

  const getVideoTitle = (video: AdminVideo) => {
    return video.display_title_de || video.original_name || video.filename || t('video.untitled', { defaultValue: 'Unbenannt' });
  };

  const formatFileSize = (bytes: number) => {
    return Math.round((bytes || 0) / 1024 / 1024 * 100) / 100;
  };

  const columns: SimpleColumn<AdminVideo>[] = [
    {
      id: 'status',
      header: t('video.status', { defaultValue: 'Status' }),
      cell: (video: AdminVideo) => (
        <VideoStatusIndicator 
          video={video} 
          hasStorageFile={storageFiles.has(video.file_path)} 
        />
      ),
    },
    {
      id: 'title',
      header: t('video.title', { defaultValue: 'Titel' }),
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
      header: t('video.details', { defaultValue: 'Details' }),
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
      header: t('video.actions', { defaultValue: 'Aktionen' }),
      cell: (video: AdminVideo) => {
        return (
          <Button
            variant="destructive"
            size="sm"
            disabled={isDeleting}
            onClick={() => onDeleteClick(video)}
            title={t('video.delete_tooltip', { defaultValue: 'Video permanent löschen (DB + Storage)' })}
            aria-label={t('video.delete', { defaultValue: 'Video löschen' })}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  return (
    <DataTable
      data={videos}
      columns={columns}
      loading={loading}
    />
  );
};

export default VideoTable;
