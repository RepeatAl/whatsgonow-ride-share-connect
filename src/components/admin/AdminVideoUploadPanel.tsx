
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Video, Trash2, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useVideoUpload } from '@/hooks/file-upload/useVideoUpload';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';

interface UploadedVideo {
  name: string;
  url: string;
  size: number;
  uploadedAt: string;
}

export const AdminVideoUploadPanel = () => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);

  const {
    fileInputRef,
    handleVideoSelect,
    handleVideoChange,
    isUploading,
    uploadProgress,
    uploadedVideoUrl
  } = useVideoUpload();

  // Load existing videos
  React.useEffect(() => {
    loadVideos();
  }, []);

  // Handle successful upload
  React.useEffect(() => {
    if (uploadedVideoUrl) {
      toast({
        title: "Video hochgeladen",
        description: "Das Video wurde erfolgreich hochgeladen.",
      });
      setUploadDialogOpen(false);
      loadVideos(); // Refresh the list
    }
  }, [uploadedVideoUrl]);

  const loadVideos = async () => {
    try {
      setLoadingVideos(true);
      
      const { data: files, error } = await supabase.storage
        .from('admin-videos')
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) throw error;

      const videoList: UploadedVideo[] = await Promise.all(
        files.map(async (file) => {
          const { data: urlData } = supabase.storage
            .from('admin-videos')
            .getPublicUrl(file.name);

          return {
            name: file.name,
            url: urlData.publicUrl,
            size: file.metadata?.size || 0,
            uploadedAt: file.created_at || new Date().toISOString()
          };
        })
      );

      setUploadedVideos(videoList);
    } catch (error) {
      console.error('Error loading videos:', error);
      toast({
        title: "Fehler",
        description: "Videos konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoadingVideos(false);
    }
  };

  const deleteVideo = async (fileName: string) => {
    try {
      const { error } = await supabase.storage
        .from('admin-videos')
        .remove([fileName]);

      if (error) throw error;

      toast({
        title: "Video gelöscht",
        description: "Das Video wurde erfolgreich gelöscht.",
      });
      
      loadVideos(); // Refresh the list
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: "Fehler",
        description: "Video konnte nicht gelöscht werden.",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-500" />
            <CardTitle>Admin Video-Verwaltung</CardTitle>
          </div>
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Video hochladen
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {loadingVideos ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2">Lade Videos...</p>
          </div>
        ) : uploadedVideos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Noch keine Videos hochgeladen.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setUploadDialogOpen(true)}
            >
              Erstes Video hochladen
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {uploadedVideos.map((video, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Video className="h-8 w-8 text-blue-500" />
                  <div>
                    <h4 className="font-medium">{video.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(video.size)} • {formatDate(video.uploadedAt)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(video.url, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteVideo(video.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Admin Video hochladen</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/mov,video/quicktime"
                onChange={handleVideoChange}
                className="hidden"
              />
              
              <Button 
                onClick={handleVideoSelect}
                disabled={isUploading}
                className="w-full"
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                Video auswählen (max. 50 MB)
              </Button>
              
              {isUploading && (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Upload läuft...</div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}
              
              <div className="text-xs text-gray-500">
                Unterstützte Formate: MP4, WebM, MOV<br />
                Maximale Dateigröße: 50 MB
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AdminVideoUploadPanel;
