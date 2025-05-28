
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Upload, Trash2, Eye } from "lucide-react";
import EnhancedVideoUploadDialog from "./EnhancedVideoUploadDialog";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import type { AdminVideo } from "@/types/admin";

const AdminVideoUploadPanel = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_videos')
        .select('*')
        .eq('active', true)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast({
        title: "Fehler",
        description: "Videos konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUploaded = (url: string) => {
    toast({
      title: "Video hochgeladen",
      description: "Das Video wurde erfolgreich hochgeladen.",
    });
    fetchVideos(); // Refresh the list
  };

  const handleDeleteVideo = async (videoId: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('videos')
        .remove([filePath]);

      if (storageError) throw storageError;

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
      
      fetchVideos(); // Refresh the list
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
            Admin Video Upload
          </CardTitle>
          <Button onClick={() => setIsUploadOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Video hochladen
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">📹 Video-Upload Funktionalität</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Sichere Uploads:</strong> Videos werden im 'videos' Bucket gespeichert</li>
              <li>• <strong>RLS-Schutz:</strong> Nur Admins können Videos hochladen und verwalten</li>
              <li>• <strong>Metadaten:</strong> Vollständige Verwaltung mit Beschreibungen und Tags</li>
              <li>• <strong>Drag & Drop:</strong> Einfaches Upload-Interface mit Fortschrittsanzeige</li>
            </ul>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Lade Videos...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Noch keine Videos hochgeladen</p>
              <p className="text-sm">Klicke auf "Video hochladen" um zu beginnen</p>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="font-medium">Hochgeladene Videos ({videos.length})</h4>
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
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteVideo(video.id, video.file_path)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <EnhancedVideoUploadDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onVideoUploaded={handleVideoUploaded}
      />
    </Card>
  );
};

export default AdminVideoUploadPanel;
