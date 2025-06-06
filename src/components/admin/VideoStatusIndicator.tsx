
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import type { AdminVideo } from '@/types/admin';

interface VideoStatusIndicatorProps {
  video: AdminVideo;
  hasStorageFile: boolean;
}

const VideoStatusIndicator = ({ video, hasStorageFile }: VideoStatusIndicatorProps) => {
  const getStatus = () => {
    if (!hasStorageFile) {
      return {
        icon: <XCircle className="h-3 w-3" />,
        label: 'Datei fehlt',
        variant: 'destructive' as const,
        color: 'text-red-500'
      };
    }
    
    if (!video.active) {
      return {
        icon: <XCircle className="h-3 w-3" />,
        label: 'Deaktiviert',
        variant: 'secondary' as const,
        color: 'text-gray-500'
      };
    }

    if (!video.public) {
      return {
        icon: <EyeOff className="h-3 w-3" />,
        label: 'Privat',
        variant: 'outline' as const,
        color: 'text-amber-500'
      };
    }

    return {
      icon: <CheckCircle className="h-3 w-3" />,
      label: 'Aktiv & Öffentlich',
      variant: 'default' as const,
      color: 'text-green-500'
    };
  };

  const status = getStatus();

  return (
    <div className="flex items-center gap-2">
      <div className={status.color}>
        {status.icon}
      </div>
      <Badge variant={status.variant} className="text-xs">
        {status.label}
      </Badge>
      {video.public && (
        <Badge variant="outline" className="text-xs">
          <Eye className="h-3 w-3 mr-1" />
          Öffentlich
        </Badge>
      )}
    </div>
  );
};

export default VideoStatusIndicator;
