
import React, { useState, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Play, X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface EnhancedVideoUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVideoUploaded: (url: string) => void;
}

const EnhancedVideoUploadDialog = ({ open, onOpenChange, onVideoUploaded }: EnhancedVideoUploadDialogProps) => {
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

  const validateFile = useCallback((file: File): boolean => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = ['video/mp4', 'video/webm', 'video/mov', 'video/quicktime'];
    
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Nur MP4, WebM und MOV Dateien sind erlaubt');
      return false;
    }
    
    if (file.size > maxSize) {
      setErrorMessage('Datei ist zu groß. Maximum: 50MB');
      return false;
    }
    
    return true;
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    if (!validateFile(file)) {
      setUploadStatus('error');
      return;
    }
    
    setSelectedFile(file);
    setUploadStatus('idle');
    setErrorMessage('');
  }, [validateFile]);

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
      // Simuliere Upload-Progress (in echtem System würde das über die Supabase Upload API kommen)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simuliere Upload (hier würde der echte Supabase Upload stattfinden)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('success');
      
      // Simuliere URL (echte URL würde von Supabase kommen)
      const mockUrl = `https://example.com/videos/${selectedFile.name}`;
      
      toast({
        title: "Upload erfolgreich",
        description: `Video "${selectedFile.name}" wurde hochgeladen`,
      });
      
      setTimeout(() => {
        onVideoUploaded(mockUrl);
        handleClose();
      }, 1000);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setErrorMessage('Upload fehlgeschlagen. Bitte versuche es erneut.');
      toast({
        title: "Upload fehlgeschlagen",
        description: "Bitte versuche es erneut",
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
          
          {/* Drag & Drop Area */}
          <div
            ref={dropRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
              isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50",
              uploadStatus === 'error' && "border-red-300 bg-red-50"
            )}
            onClick={handleSelectClick}
          >
            {uploadStatus === 'success' ? (
              <div className="space-y-2">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <p className="text-green-600 font-medium">Upload erfolgreich!</p>
              </div>
            ) : uploadStatus === 'error' ? (
              <div className="space-y-2">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                <p className="text-red-600 font-medium">Upload fehlgeschlagen</p>
                <p className="text-sm text-red-500">{errorMessage}</p>
              </div>
            ) : selectedFile ? (
              <div className="space-y-2">
                <Play className="h-12 w-12 text-blue-500 mx-auto" />
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="text-gray-600">
                  {isDragging ? 'Video hier ablegen...' : 'Video hierhin ziehen oder klicken'}
                </p>
                <p className="text-sm text-gray-400">
                  MP4, WebM, MOV (max. 50 MB)
                </p>
              </div>
            )}
          </div>
          
          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Upload läuft...</span>
                <span className="text-gray-600">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}
          
          {/* Action Buttons */}
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
          
          {/* Preview Mode Warning */}
          {process.env.NODE_ENV === 'development' && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
              <p className="text-yellow-800">
                <strong>Preview-Modus:</strong> Echte Uploads funktionieren nur in der Live-Version.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedVideoUploadDialog;
