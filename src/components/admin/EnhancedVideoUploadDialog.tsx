
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
    isUploading,
    uploadProgress
  } = useVideoUpload();

  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("howto");
  const [isPublic, setIsPublic] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!description) {
        setDescription(`Admin-Upload: ${file.name}`);
      }
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
      const fileName = `admin-${Date.now()}.${selectedFile.name.split('.').pop()}`;
      const filePath = `admin/${fileName}`;

      // Upload to videos bucket
      const { data, error } = await supabase.storage
        .from('videos')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: selectedFile.type
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('videos')
        .getPublicUrl(data.path);

      // Store metadata in admin_videos table
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      
      const { error: dbError } = await supabase
        .from('admin_videos')
        .insert({
          filename: fileName,
          original_name: selectedFile.name,
          file_path: data.path,
          file_size: selectedFile.size,
          mime_type: selectedFile.type,
          public_url: urlData.publicUrl,
          description: description || `Admin-Upload: ${selectedFile.name}`,
          tags: tagsArray,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id,
          active: true,
          public: isPublic
        });

      if (dbError) throw dbError;

      setUploadedVideoUrl(urlData.publicUrl);
      
      toast({
        title: "Upload erfolgreich",
        description: `Video "${selectedFile.name}" wurde ${isPublic ? 'öffentlich' : 'privat'} hochgeladen`,
      });

      onVideoUploaded(urlData.publicUrl);
      handleClose();
      
    } catch (error) {
      console.error('Upload error:', error);
      const message = error instanceof Error ? error.message : 'Unbekannter Fehler beim Upload';
      
      toast({
        title: "Upload fehlgeschlagen",
        description: message,
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    setDescription("");
    setTags("howto");
    setIsPublic(true);
    setSelectedFile(null);
    setUploadedVideoUrl(null);
    onOpenChange(false);
  };

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
                  placeholder="Tags durch Kommas getrennt"
                />
                <p className="text-xs text-gray-500">
                  Tipp: "howto" für Homepage-Video verwenden
                </p>
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
            Unterstützte Formate: MP4, WebM, MOV<br/>
            Videos mit "howto" Tag werden auf der Homepage angezeigt
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedVideoUploadDialog;
