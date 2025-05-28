
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Upload, Play, X } from "lucide-react";
import { useVideoUpload } from "@/hooks/file-upload/useVideoUpload";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";

interface EnhancedVideoUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVideoUploaded: (url: string) => void;
}

const EnhancedVideoUploadDialog = ({ open, onOpenChange, onVideoUploaded }: EnhancedVideoUploadDialogProps) => {
  const {
    fileInputRef,
    handleVideoSelect,
    handleVideoChange,
    isUploading,
    uploadProgress,
    uploadedVideoUrl
  } = useVideoUpload();

  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Keine Datei ausgewählt",
        description: "Bitte wählen Sie zuerst ein Video aus.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create a mock event for the existing upload handler
      const mockEvent = {
        target: {
          files: [selectedFile],
          value: ''
        }
      } as any;

      await handleVideoChange(mockEvent);
      
      // If upload was successful, save metadata
      if (uploadedVideoUrl) {
        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        
        const { error } = await supabase
          .from('admin_videos')
          .update({
            description: description || `Admin-Upload: ${selectedFile.name}`,
            tags: tagsArray,
            public: isPublic
          })
          .eq('original_name', selectedFile.name)
          .eq('active', true);

        if (error) {
          console.error('Error updating video metadata:', error);
        }

        onVideoUploaded(uploadedVideoUrl);
        handleClose();
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleClose = () => {
    setDescription("");
    setTags("");
    setIsPublic(false);
    setSelectedFile(null);
    onOpenChange(false);
  };

  React.useEffect(() => {
    if (uploadedVideoUrl) {
      onVideoUploaded(uploadedVideoUrl);
      handleClose();
    }
  }, [uploadedVideoUrl, onVideoUploaded]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Admin Video hochladen</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/mov,video/quicktime"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="space-y-2">
            <Label>Video-Datei</Label>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
              variant="outline"
            >
              <Upload className="h-4 w-4 mr-2" />
              {selectedFile ? selectedFile.name : "Video auswählen (max. 50 MB)"}
            </Button>
          </div>

          {selectedFile && (
            <>
              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional: Beschreibung des Videos"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Optional: Tags durch Kommas getrennt"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="public"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
                <Label htmlFor="public">Öffentlich sichtbar</Label>
              </div>

              <Button 
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Video hochladen...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Hochladen
                  </>
                )}
              </Button>
            </>
          )}
          
          {isUploading && (
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Upload läuft...</div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}
          
          <div className="text-xs text-gray-500">
            Unterstützte Formate: MP4, WebM, MOV
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedVideoUploadDialog;
