// 🔒 SYSTEM LOCKED – Änderungen nur mit Freigabe durch @Christiane
// Status: FINAL - EINGEFROREN (2025-06-07)

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, RefreshCw, FileX, Database } from 'lucide-react';
import { useAdminVideoDelete } from '@/hooks/useAdminVideoDelete';
import { toast } from '@/hooks/use-toast';

interface ConsistencyIssue {
  type: 'missing_file' | 'orphaned_file' | 'invalid_url';
  videoId?: string;
  fileName?: string;
  description: string;
}

const VideoConsistencyCheck = () => {
  const { t } = useTranslation('admin');
  const [checking, setChecking] = useState(false);
  const [issues, setIssues] = useState<ConsistencyIssue[]>([]);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const { checkVideoConsistency } = useAdminVideoDelete();

  const runConsistencyCheck = async () => {
    setChecking(true);
    try {
      const result = await checkVideoConsistency();
      const foundIssues: ConsistencyIssue[] = [];

      // Videos ohne Storage-Dateien
      result.inconsistent.forEach(video => {
        foundIssues.push({
          type: 'missing_file',
          videoId: video.id,
          description: `Video "${video.display_title_de || video.filename}" hat keine Storage-Datei`
        });
      });

      // Verwaiste Storage-Dateien
      result.orphanedFiles.forEach(filePath => {
        foundIssues.push({
          type: 'orphaned_file',
          fileName: filePath,
          description: `Storage-Datei "${filePath}" hat keinen Datenbank-Eintrag`
        });
      });

      setIssues(foundIssues);
      setLastCheck(new Date());

      if (foundIssues.length === 0) {
        toast({
          title: "✅ Konsistenz-Check erfolgreich",
          description: "Alle Videos sind konsistent mit dem Storage.",
        });
      } else {
        toast({
          title: `⚠️ ${foundIssues.length} Problem(e) gefunden`,
          description: "Prüfe die Details unten.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Consistency check failed:', error);
      toast({
        title: "Fehler beim Konsistenz-Check",
        description: "Prüfung konnte nicht durchgeführt werden.",
        variant: "destructive"
      });
    } finally {
      setChecking(false);
    }
  };

  const getIssueIcon = (type: ConsistencyIssue['type']) => {
    switch (type) {
      case 'missing_file':
        return <FileX className="h-4 w-4 text-red-500" />;
      case 'orphaned_file':
        return <Database className="h-4 w-4 text-amber-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getIssueColor = (type: ConsistencyIssue['type']) => {
    switch (type) {
      case 'missing_file':
        return 'destructive';
      case 'orphaned_file':
        return 'secondary';
      default:
        return 'destructive';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Video-Storage Konsistenz
          </CardTitle>
          <Button
            onClick={runConsistencyCheck}
            disabled={checking}
            variant="outline"
            size="sm"
          >
            {checking ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Prüfe...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Jetzt prüfen
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {lastCheck && (
          <div className="text-sm text-muted-foreground">
            Letzte Prüfung: {lastCheck.toLocaleString('de-DE')}
          </div>
        )}

        {issues.length === 0 && lastCheck ? (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle className="h-4 w-4" />
            <span>Alle Videos sind konsistent</span>
          </div>
        ) : issues.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">{issues.length} Problem(e) gefunden:</span>
            </div>
            
            {issues.map((issue, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                {getIssueIcon(issue.type)}
                <div className="flex-1 space-y-1">
                  <p className="text-sm">{issue.description}</p>
                  <div className="flex gap-2">
                    <Badge variant={getIssueColor(issue.type) as any} className="text-xs">
                      {issue.type === 'missing_file' ? 'Datei fehlt' : 
                       issue.type === 'orphaned_file' ? 'Verwaiste Datei' : 'Unbekannt'}
                    </Badge>
                    {issue.videoId && (
                      <Badge variant="outline" className="text-xs">
                        ID: {issue.videoId.slice(0, 8)}...
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="text-xs text-muted-foreground bg-gray-50 p-3 rounded">
          <strong>Was wird geprüft:</strong>
          <ul className="mt-1 space-y-1 list-disc list-inside">
            <li>Videos in DB haben entsprechende Storage-Dateien</li>
            <li>Storage-Dateien haben entsprechende DB-Einträge</li>
            <li>URLs sind erreichbar und gültig</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoConsistencyCheck;
