
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Upload, Trash2, Eye, AlertCircle, Edit, Star } from "lucide-react";
import EnhancedVideoUploadDialog from "./EnhancedVideoUploadDialog";
import VideoEditDialog from "./VideoEditDialog";
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
  const [editingVideo, setEditingVideo] = useState<AdminVideo | null>(null);

  // Early return if no access
  if (!canViewVideos) {
    return null;
  }

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching admin videos...');
      
      const { data, error } = await supabase
        .from('admin_videos')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching videos:', error);
        setError('Videos konnten nicht geladen werden');
        return;
      }
      
      const filteredVideos = data?.filter(video => 
        typeof video.active === 'boolean' ? video.active : true
      ) || [];
      
      console.log('Videos loaded:', filteredVideos);
      setVideos(filteredVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Unerwarteter Fehler beim Laden der Videos');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUploaded = (url: string) => {
    console.log('Video uploaded successfully:', url);
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
      console.log('Deleting video:', videoId, filePath);
      
      const { error: storageError } = await supabase.storage
        .from('videos')
        .remove([filePath]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
      }

      const { error: dbError } = await supabase
        .from('admin_videos')
        .update({ active: false })
        .eq('id', videoId);

      if (dbError) {
        console.error('Database deletion error:', dbError);
        throw dbError;
      }

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

  const handleUpdateVideo = async (videoId: string, data: {
    display_title_de?: string;
    display_title_en?: string;
    display_description_de?: string;
    display_description_en?: string;
    tags?: string[];
  }) => {
    if (!canManageVideos) {
      toast({
        title: "Keine Berechtigung",
        description: "Sie haben keine Berechtigung, Videos zu bearbeiten.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Updating video metadata:', videoId, data);
      
      const { error } = await supabase
        .from('admin_videos')
        .update(data)
        .eq('id', videoId);

      if (error) {
        console.error('Error updating video:', error);
        throw error;
      }

      toast({
        title: "Video aktualisiert",
        description: "Die Video-Informationen wurden erfolgreich aktualisiert.",
      });
      
      // Update local state
      setVideos(videos.map(video => 
        video.id === videoId ? { ...video, ...data } : video
      ));
    } catch (error) {
      console.error('Error updating video:', error);
      toast({
        title: "Fehler",
        description: "Video konnte nicht aktualisiert werden.",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const getVideoStatus = (video: AdminVideo) => {
    const isOnLandingPage = video.tags?.includes('howto');
    const isPublic = video.public;
    
    return {
      isOnLandingPage,
      isPublic,
      statusText: isOnLandingPage ? 'Auf Landing Page' : isPublic ? 'Öffentlich' : 'Privat'
    };
  };

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
              {videos.map((video) => {
                const status = getVideoStatus(video);
                return (
                  <div key={video.id} className="flex items-start justify-between p-4 border rounded-lg bg-white">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-medium truncate">
                          {video.display_title_de || video.original_name}
                        </p>
                        {status.isOnLandingPage && (
                          <Badge variant="default" className="bg-orange-100 text-orange-800 border-orange-200">
                            <Star className="h-3 w-3 mr-1" />
                            Landing Page
                          </Badge>
                        )}
                        {status.isPublic && !status.isOnLandingPage && (
                          <Badge variant="secondary">
                            Öffentlich
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          {(video.file_size / 1024 / 1024).toFixed(1)} MB • {video.mime_type}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(video.uploaded_at).toLocaleDateString('de-DE')}
                        </p>
                        
                        {video.tags && video.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {video.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {video.display_description_de && (
                          <p className="text-sm text-gray-600 mt-1">
                            {video.display_description_de.length > 80
                              ? `${video.display_description_de.substring(0, 80)}...`
                              : video.display_description_de}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
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
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingVideo(video)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteVideo(video.id, video.file_path)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>

      {canManageVideos && (
        <>
          <EnhancedVideoUploadDialog
            open={isUploadOpen}
            onOpenChange={setIsUploadOpen}
            onVideoUploaded={handleVideoUploaded}
          />
          
          <VideoEditDialog
            open={!!editingVideo}
            onOpenChange={(open) => {
              if (!open) setEditingVideo(null);
            }}
            video={editingVideo}
            onSave={handleUpdateVideo}
          />
        </>
      )}
    </Card>
  );
};

export default AdminVideoUploadPanel;
