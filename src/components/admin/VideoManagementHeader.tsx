
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Video, RefreshCw } from 'lucide-react';

interface VideoManagementHeaderProps {
  videoCount: number;
  loading: boolean;
  onRefresh: () => void;
}

const VideoManagementHeader = ({ videoCount, loading, onRefresh }: VideoManagementHeaderProps) => {
  const { t } = useTranslation('admin');

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Video className="h-6 w-6 text-brand-orange" />
          {t('video.management', { defaultValue: 'Video-Verwaltung' })} ({videoCount})
        </h2>
        <p className="text-muted-foreground mt-1">
          {t('video.description', { defaultValue: 'Verwalte Videos, überprüfe Konsistenz und lösche nicht benötigte Dateien.' })}
        </p>
      </div>
      <Button 
        variant="outline" 
        onClick={onRefresh}
        disabled={loading}
        aria-label={t('video.refresh', { defaultValue: 'Aktualisieren' })}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
        {t('video.refresh', { defaultValue: 'Aktualisieren' })}
      </Button>
    </div>
  );
};

export default VideoManagementHeader;
