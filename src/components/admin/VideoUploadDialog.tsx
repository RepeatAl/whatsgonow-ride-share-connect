
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Play } from "lucide-react";
import { useVideoUpload } from "@/hooks/file-upload/useVideoUpload";

interface VideoUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVideoUploaded: (url: string) => void;
}

const VideoUploadDialog = ({ open, onOpenChange, onVideoUploaded }: VideoUploadDialogProps) => {
  const {
    fileInputRef,
    handleVideoSelect,
    handleVideoChange,
    isUploading,
    uploadProgress,
    uploadedVideoUrl
  } = useVideoUpload();

  React.useEffect(() => {
    if (uploadedVideoUrl) {
      onVideoUploaded(uploadedVideoUrl);
      onOpenChange(false);
    }
  }, [uploadedVideoUrl, onVideoUploaded, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>HowItWorks Video hochladen</DialogTitle>
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
              <div className="text-sm text-gray-600">Uploading...</div>
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

export default VideoUploadDialog;
