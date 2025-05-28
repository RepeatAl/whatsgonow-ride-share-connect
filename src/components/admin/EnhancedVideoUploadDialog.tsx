
import React, { useState, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, CheckCircle, AlertCircle, FileVideo } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { validateVideoFile } from "@/hooks/file-upload/videoValidation";
import type { VideoUploadProps } from "@/types/admin";

const EnhancedVideoUploadDialog: React.FC<VideoUploadProps> = ({ 
  open, 
  onOpenChange, 
  onVideoUploaded 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const resetState = useCallback(() => {
    setSelectedFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadStatus('idle');
    setErrorMessage('');
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    if (!validateVideoFile(file)) {
      setErrorMessage('Ungültiges Videoformat oder Datei zu groß (max. 50MB)');
      setUploadStatus('error');
      return;
    }
    
    setSelectedFile(file);
    setUploadStatus('idle');
    setErrorMessage('');
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!dropRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const uploadFile = useCallback(async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    try {
      const fileName = `admin-${uuidv4()}.${selectedFile.name.split('.').pop()}`;
      const filePath = `admin/${fileName}`;

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 300);

      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase.storage
        .from('videos')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: selectedFile.type,
          metadata: { 
            type: 'admin-video',
            originalName: selectedFile.name,
            uploadedBy: user?.id || 'unknown'
          }
        });

      clearInterval(progressInterval);

      if (error) {
        console.error('Storage upload error:', error);
        throw new Error('Upload fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }

      const { data: urlData } = supabase.storage
        .from('videos')
        .getPublicUrl(data.path);

      // Store metadata in admin_videos table
      const { error: dbError } = await supabase
        .from('admin_videos')
        .insert({
          filename: fileName,
          original_name: selectedFile.name,
          file_path: data.path,
          file_size: selectedFile.size,
          mime_type: selectedFile.type,
          public_url: urlData.publicUrl,
          description: `Admin-Upload: ${selectedFile.name}`,
          tags: ['admin', 'howto'],
          uploaded_by: user?.id
        });

      if (dbError) {
        console.error('Metadata storage error:', dbError);
        toast({
          title: "Warnung",
          description: "Video hochgeladen, aber Metadaten konnten nicht gespeichert werden.",
          variant: "destructive"
        });
      }

      setUploadProgress(100);
      setUploadStatus('success');
      
      toast({
        title: "Upload erfolgreich",
        description: `Video "${selectedFile.name}" wurde hochgeladen`,
      });
      
      // Auto-close after 1.5 seconds
      setTimeout(() => {
        onVideoUploaded(urlData.publicUrl);
        handleClose();
      }, 1500);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      const message = error instanceof Error ? error.message : 'Unbekannter Fehler beim Upload';
      setErrorMessage(message);
      
      toast({
        title: "Upload fehlgeschlagen",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, onVideoUploaded]);

  const handleClose = useCallback(() => {
    if (!isUploading) {
      resetState();
      onOpenChange(false);
    }
  }, [isUploading, resetState, onOpenChange]);

  const handleSelectClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const getFileIcon = () => {
    if (uploadStatus === 'success') return CheckCircle;
    if (uploadStatus === 'error') return AlertCircle;
    if (selectedFile) return FileVideo;
    return Upload;
  };

  const FileIcon = getFileIcon();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Video hochladen</DialogTitle>
            {!isUploading && (
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/mov,video/quicktime"
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          <div
            ref={dropRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer",
              isDragging 
                ? "border-primary bg-primary/10 scale-105" 
                : "border-gray-300 hover:border-primary/50 hover:bg-gray-50",
              uploadStatus === 'error' && "border-red-300 bg-red-50",
              uploadStatus === 'success' && "border-green-300 bg-green-50"
            )}
            onClick={handleSelectClick}
          >
            {uploadStatus === 'success' ? (
              <div className="space-y-2">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto animate-pulse" />
                <p className="text-green-600 font-medium">Upload erfolgreich!</p>
                <p className="text-sm text-green-500">Dialog schließt automatisch...</p>
              </div>
            ) : uploadStatus === 'error' ? (
              <div className="space-y-2">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                <p className="text-red-600 font-medium">Upload fehlgeschlagen</p>
                <p className="text-sm text-red-500">{errorMessage}</p>
              </div>
            ) : selectedFile ? (
              <div className="space-y-2">
                <FileVideo className="h-12 w-12 text-blue-500 mx-auto" />
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                </p>
                <p className="text-xs text-blue-600">
                  Bereit zum Upload
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className={cn(
                  "h-12 w-12 mx-auto transition-colors",
                  isDragging ? "text-primary animate-bounce" : "text-gray-400"
                )} />
                <p className="text-gray-600 font-medium">
                  {isDragging ? 'Video hier ablegen...' : 'Video hierhin ziehen oder klicken'}
                </p>
                <p className="text-sm text-gray-400">
                  MP4, WebM, MOV (max. 50 MB)
                </p>
              </div>
            )}
          </div>
          
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Upload läuft...</span>
                <span className="text-gray-600">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}
          
          <div className="flex justify-between gap-2">
            <Button 
              variant="outline" 
              onClick={handleClose}
              disabled={isUploading}
              className="flex-1"
            >
              {uploadStatus === 'success' ? 'Schließen' : 'Abbrechen'}
            </Button>
            
            {selectedFile && uploadStatus !== 'success' && (
              <Button 
                onClick={uploadFile}
                disabled={isUploading || uploadStatus === 'error'}
                className="flex-1"
              >
                {isUploading ? 'Uploading...' : 'Upload starten'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedVideoUploadDialog;
