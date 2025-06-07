
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Info, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

interface GuestUploadNoticeProps {
  fileCount?: number;
  expiresAt?: string;
}

export function GuestUploadNotice({ fileCount = 0, expiresAt }: GuestUploadNoticeProps) {
  const { t } = useTranslation(['upload', 'common']);

  const formatTimeLeft = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const hoursLeft = Math.floor((expires.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (hoursLeft < 1) return t('upload:expires_soon', 'Läuft bald ab');
    if (hoursLeft < 24) return t('upload:expires_hours', '{{hours}}h verbleibend', { hours: hoursLeft });
    
    const daysLeft = Math.floor(hoursLeft / 24);
    return t('upload:expires_days', '{{days}} Tage verbleibend', { days: daysLeft });
  };

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-orange-900">
                {t('upload:guest_mode_title', 'Gast-Upload-Modus')}
              </h3>
              <Badge variant="outline" className="text-orange-700 border-orange-300">
                {t('upload:temporary', 'Temporär')}
              </Badge>
            </div>
            
            <div className="text-sm text-orange-800 space-y-1">
              <p>
                {t('upload:guest_explanation', 
                  'Sie können Bilder ohne Anmeldung hochladen. Diese werden temporär gespeichert.'
                )}
              </p>
              
              {fileCount > 0 && (
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  <span>
                    {t('upload:files_uploaded', '{{count}} Datei(en) hochgeladen', { count: fileCount })}
                  </span>
                </div>
              )}
              
              {expiresAt && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTimeLeft(expiresAt)}</span>
                </div>
              )}
            </div>
            
            <div className="text-xs text-orange-700 bg-orange-100 p-2 rounded border border-orange-200">
              {t('upload:login_to_save', 
                'Melden Sie sich an, um Ihre Bilder dauerhaft zu speichern und Artikel zu veröffentlichen.'
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
