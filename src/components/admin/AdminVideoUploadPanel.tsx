
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Upload, Trash2, Eye, AlertCircle } from "lucide-react";
import EnhancedVideoUploadDialog from "./EnhancedVideoUploadDialog";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import type { AdminVideo } from "@/types/admin";

const AdminVideoUploadPanel = () => {
  const { canManageVideos, canViewVideos, isAdmin } = useAdminGuard();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Early return if no access
  if (!canViewVideos) {
    return null;
  }

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('admin_videos')
        .select('*')
        .eq('active', true)
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching videos:', error);
        setError('Videos konnten nicht geladen werden');
        return;
      }
      
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Unerwarteter Fehler beim Laden der Videos');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUploaded = (url: string) => {
    toast({
      title: "Video hochgeladen",
      description: "Das Video wurde erfolgreich hochgeladen.",
    });
    fetchVideos();
  };

  const handleDeleteVideo = async (videoId: string, filePath: string) => {
    if (!canManageVideos) {
      toast({
        title: "Keine Berechtigung",
        description: "Sie haben keine Berechtigung, Videos zu löschen.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('videos')
        .remove([filePath]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
        // Continue anyway, mark as inactive
      }

      // Mark as inactive in database
      const { error: dbError } = await supabase
        .from('admin_videos')
        .update({ active: false })
        .eq('id', videoId);

      if (dbError) throw dbError;

      toast({
        title: "Video gelöscht",
        description: "Das Video wurde erfolgreich entfernt.",
      });
      
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: "Fehler",
        description: "Video konnte nicht gelöscht werden.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Video Management
          </CardTitle>
          {canManageVideos && (
            <Button onClick={() => setIsUploadOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Video hochladen
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Lade Videos...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Noch keine Videos hochgeladen</p>
              {canManageVideos && (
                <p className="text-sm">Klicke auf "Video hochladen" um zu beginnen</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="font-medium">Videos ({videos.length})</h4>
              {videos.map((video) => (
                <div key={video.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{video.original_name}</p>
                    <p className="text-sm text-gray-500">
                      {(video.file_size / 1024 / 1024).toFixed(1)} MB • {video.mime_type}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(video.uploaded_at).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {video.public_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(video.public_url, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {canManageVideos && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteVideo(video.id, video.file_path)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      {canManageVideos && (
        <EnhancedVideoUploadDialog
          open={isUploadOpen}
          onOpenChange={setIsUploadOpen}
          onVideoUploaded={handleVideoUploaded}
        />
      )}
    </Card>
  );
};

export default AdminVideoUploadPanel;
