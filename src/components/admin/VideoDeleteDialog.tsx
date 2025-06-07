
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import type { AdminVideo } from '@/types/admin';

interface VideoDeleteDialogProps {
  open: boolean;
  video: AdminVideo | null;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const VideoDeleteDialog = ({ open, video, isDeleting, onOpenChange, onConfirm }: VideoDeleteDialogProps) => {
  const { t } = useTranslation('admin');

  const getVideoTitle = (video: AdminVideo) => {
    return video.display_title_de || video.original_name || video.filename || t('video.untitled', { defaultValue: 'Unbenannt' });
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('video.confirm_delete', { defaultValue: 'Video permanent löschen?' })}
      description={
        <div className="space-y-2">
          <p>
            Das Video <strong>"{video ? getVideoTitle(video) : ''}"</strong> wird vollständig entfernt:
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
      onConfirm={onConfirm}
      confirmVariant="destructive"
    />
  );
};

export default VideoDeleteDialog;
