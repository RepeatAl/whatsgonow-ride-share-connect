// 🔒 SYSTEM LOCKED – Änderungen nur mit Freigabe durch @Christiane
// Status: FINAL - EINGEFROREN (2025-06-07)

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Video } from 'lucide-react';

const VideoEmptyState = () => {
  const { t } = useTranslation('admin');

  return (
    <div className="text-center py-12">
      <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
      <h3 className="text-lg font-semibold mb-2">
        {t('video.no_videos', { defaultValue: 'Keine Videos vorhanden' })}
      </h3>
      <p className="text-sm text-muted-foreground">
        {t('video.upload_hint', { defaultValue: 'Lade Videos über den Upload-Bereich hoch.' })}
      </p>
    </div>
  );
};

export default VideoEmptyState;
