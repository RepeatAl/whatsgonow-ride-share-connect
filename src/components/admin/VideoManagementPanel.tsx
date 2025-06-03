
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, AlertTriangle, RefreshCw, Shield } from 'lucide-react';
import { useAdminVideoDelete } from '@/hooks/useAdminVideoDelete';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import type { AdminVideo } from '@/types/admin';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const VideoManagementPanel = () => {
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [consistencyIssues, setConsistencyIssues] = useState<any[]>([]);
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
      const issues = await checkVideoConsistency();
      setConsistencyIssues(issues);

    } catch (error: any) {
      console.error('❌ Failed to fetch videos:', error);
      toast({
        title: "Fehler",
        description: "Videos konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVideoDelete = async (video: AdminVideo) => {
    const success = await deleteVideoCompletely(video);
    if (success) {
      // Refresh the list after successful deletion
      await fetchVideos();
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
          <span className="ml-2">Videos werden geladen...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Video System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {consistencyIssues.length === 0 
                  ? "✅ Alle Videos sind konsistent" 
                  : `⚠️ ${consistencyIssues.length} Konsistenz-Probleme gefunden`
                }
              </p>
              {consistencyIssues.length > 0 && (
                <div className="mt-2 space-y-1">
                  {consistencyIssues.slice(0, 3).map((issue, index) => (
                    <p key={index} className="text-xs text-amber-600">
                      {issue.issue_type}: {issue.description}
                    </p>
                  ))}
                  {consistencyIssues.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      ...und {consistencyIssues.length - 3} weitere
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

      {/* Videos List */}
      <Card>
        <CardHeader>
          <CardTitle>Video Verwaltung ({videos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {videos.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Keine Videos vorhanden
            </p>
          ) : (
            <div className="space-y-4">
              {videos.map((video) => {
                const videoIssues = consistencyIssues.filter(issue => 
                  issue.video_id === video.id || issue.filename === video.filename
                );
                
                return (
                  <div key={video.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">
                            {video.display_title_de || video.original_name || video.filename}
                          </h3>
                          {video.tags?.includes('featured') && (
                            <Badge variant="default">Featured</Badge>
                          )}
                          {video.public && <Badge variant="secondary">Öffentlich</Badge>}
                          {!video.active && <Badge variant="destructive">Inaktiv</Badge>}
                          {videoIssues.length > 0 && (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {videoIssues.length} Problem{videoIssues.length > 1 ? 'e' : ''}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Datei: {video.filename}</p>
                          <p>Größe: {Math.round((video.file_size || 0) / 1024 / 1024 * 100) / 100} MB</p>
                          <p>Hochgeladen: {new Date(video.uploaded_at || '').toLocaleDateString('de-DE')}</p>
                          {video.public_url && (
                            <p>URL: <span className="font-mono text-xs">{video.public_url.substring(0, 50)}...</span></p>
                          )}
                        </div>

                        {videoIssues.length > 0 && (
                          <div className="mt-2 p-2 bg-amber-50 rounded border border-amber-200">
                            <p className="text-xs font-medium text-amber-800 mb-1">Erkannte Probleme:</p>
                            {videoIssues.map((issue, index) => (
                              <p key={index} className="text-xs text-amber-700">
                                • {issue.description}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Video permanent löschen?</AlertDialogTitle>
                            <AlertDialogDescription className="space-y-3">
                              <p>
                                <strong>{video.display_title_de || video.original_name || video.filename}</strong> wird <strong>permanent gelöscht</strong>.
                              </p>
                              
                              <div className="bg-red-50 p-3 rounded border border-red-200">
                                <p className="text-sm font-medium text-red-800 mb-2">
                                  ⚠️ Diese Aktion wird folgende Daten löschen:
                                </p>
                                <ul className="text-sm text-red-700 space-y-1">
                                  <li>• Video-Datei aus dem Storage</li>
                                  <li>• Thumbnail-Datei (falls vorhanden)</li>
                                  <li>• Alle Metadaten und Beschreibungen</li>
                                  <li>• Analytics und Zugriffsprotokolle</li>
                                </ul>
                              </div>

                              {videoIssues.length > 0 && (
                                <div className="bg-amber-50 p-3 rounded border border-amber-200">
                                  <p className="text-sm font-medium text-amber-800 mb-1">
                                    🔧 Lösung für erkannte Probleme:
                                  </p>
                                  <p className="text-sm text-amber-700">
                                    Dieses Video hat Konsistenz-Probleme. Die Löschung wird diese beheben.
                                  </p>
                                </div>
                              )}
                              
                              <p className="text-sm font-medium text-gray-900">
                                Diese Aktion kann nicht rückgängig gemacht werden!
                              </p>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleVideoDelete(video)}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={isDeleting}
                            >
                              {isDeleting ? 'Lösche...' : 'Permanent löschen'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoManagementPanel;
