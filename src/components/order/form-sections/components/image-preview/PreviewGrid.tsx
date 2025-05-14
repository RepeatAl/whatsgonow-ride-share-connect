
import React, { memo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { UploadProgress } from "@/components/upload/UploadProgress";
import { Skeleton } from "@/components/ui/skeleton";
import { MAX_FILES } from "@/hooks/file-upload/constants";
import { toast } from "sonner";
import { useBulkUpload } from "@/contexts/BulkUploadContext";
import { AnalysisStatus } from "../../ItemDetailsSection/types";
import { useDeviceType } from "@/hooks/useDeviceType";
import { PreviewSlot } from "./PreviewSlot";

interface PreviewGridProps {
  previews: (string | ArrayBuffer | undefined)[];
  onRemove: (index: number) => void;
  onSave?: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
  isLoading?: boolean;
  onFileSelect?: (index: number) => void;
  onCameraOpen?: (index: number) => void;
  userId?: string;
  orderId?: string;
  onUploadComplete?: (urls: string[]) => void;
  analysisStatus?: Record<number, AnalysisStatus>;
  onAnalyze?: (index: number) => void;
}

export const PreviewGrid = memo(({ 
  previews, 
  onRemove,
  onSave,
  isUploading,
  uploadProgress = 0,
  isLoading = false,
  onFileSelect,
  onCameraOpen,
  userId,
  orderId,
  onUploadComplete,
  analysisStatus = {},
  onAnalyze
}: PreviewGridProps) => {
  const { deviceType } = useDeviceType();
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const { imageToArticleMap, createNewArticleWithImage, assignImageToArticle, articleForms } = useBulkUpload();
  
  // Always ensure we have a fixed-length array of MAX_FILES
  const previewSlots = Array(MAX_FILES).fill(undefined).map((_, idx) => previews[idx]);
  
  const filledCount = previews.filter(Boolean).length;

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setDragOver(null);
    
    if (!e.dataTransfer.files?.length) return;
    
    const file = e.dataTransfer.files[0];
    if (file) {
      // Here you would typically handle the file upload
      // For now we'll just simulate by using the existing onFileSelect callback
      if (onFileSelect) {
        onFileSelect(index);
      }
    }
  };

  // Geändert: stopPropagation hinzugefügt, um Konflikt zu vermeiden
  const handleSlotClick = (e: React.MouseEvent, index: number, hasPreview: boolean) => {
    // Bei existierendem Bild nichts tun
    if (hasPreview) return;
    
    // Nur wenn direktes Target das übergeordnete div ist, Datei-Upload auslösen
    if (e.currentTarget === e.target && onFileSelect) {
      onFileSelect(index);
    }
  };

  const handleFileInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    // Reset the input value after handling to prevent reopening on cancel
    const currentFiles = e.target.files;
    
    // Delegate to the main file handling logic
    if (onFileSelect) {
      onFileSelect(index);
    }
    
    // Clear the input value to allow re-selecting the same file
    e.target.value = '';
  };

  // Geändert: stopPropagation hinzugefügt, um Ereignisüberlappung zu vermeiden
  const openFileInput = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Verhindert Bubble-Up zum handleSlotClick
    
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]?.click();
    }
  };

  // Geändert: stopPropagation hinzugefügt, um Ereignisüberlappung zu vermeiden
  const handleCameraClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Verhindert Bubble-Up zum handleSlotClick
    
    if (onCameraOpen) {
      onCameraOpen(index);
    }
  };

  const handleAssignToArticle = (previewUrl: string, articleId: string) => {
    if (assignImageToArticle) {
      assignImageToArticle(previewUrl, articleId);
      toast.success("Bild wurde dem Artikel zugewiesen");
    }
  };

  const handleCreateArticle = (previewUrl: string) => {
    if (createNewArticleWithImage) {
      const newArticleId = createNewArticleWithImage(previewUrl);
      toast.success("Neuer Artikel mit Bild erstellt");
    }
  };

  const handleAnalyzeImage = (index: number) => {
    if (onAnalyze) {
      onAnalyze(index);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array(MAX_FILES).fill(0).map((_, idx) => (
          <Skeleton key={`skeleton-${idx}`} className="w-full h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div 
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        onDragLeave={() => setDragOver(null)}
      >
        {previewSlots.map((preview, idx) => (
          <div 
            key={`preview-slot-${idx}`}
            onDrop={(e) => handleFileDrop(e, idx)}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(idx);
            }}
          >
            <PreviewSlot
              preview={preview}
              index={idx}
              dragOver={dragOver}
              onRemove={onRemove}
              isUploading={isUploading}
              imageToArticleMap={imageToArticleMap}
              analysisStatus={analysisStatus}
              handleCreateArticle={handleCreateArticle}
              handleAssignToArticle={handleAssignToArticle}
              handleAnalyzeImage={handleAnalyzeImage}
              articleForms={articleForms}
              openFileInput={openFileInput}
              handleCameraClick={handleCameraClick}
              handleSlotClick={handleSlotClick}
              deviceType={deviceType}
              userId={userId}
              orderId={orderId}
              onUploadComplete={onUploadComplete}
              onAnalyze={onAnalyze}
              fileInputRef={(el) => { fileInputRefs.current[idx] = el; }}
              handleFileInputChange={handleFileInputChange}
            />
          </div>
        ))}
      </div>
      
      {isUploading ? (
        <UploadProgress 
          current={Math.round((uploadProgress / 100) * filledCount)}
          total={filledCount}
          progress={uploadProgress}
        />
      ) : (
        filledCount > 0 && (
          <div className="flex justify-end">
            <Button 
              onClick={onSave} 
              disabled={isUploading}
            >
              <Save className="mr-2 h-4 w-4" />
              Fotos speichern
            </Button>
          </div>
        )
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Optimized deep comparison function to reduce unnecessary re-renders
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.isUploading !== nextProps.isUploading) return false;
  if (prevProps.uploadProgress !== nextProps.uploadProgress) return false;
  
  // Compare preview arrays - they must be the same length by design
  if (prevProps.previews.length !== nextProps.previews.length) return false;
  
  // Do a value-based comparison of each preview URL rather than reference comparison
  for (let i = 0; i < MAX_FILES; i++) {
    if (prevProps.previews[i] !== nextProps.previews[i]) {
      return false;
    }
  }
  
  // Compare analysis status objects
  if (Object.keys(prevProps.analysisStatus || {}).length !== Object.keys(nextProps.analysisStatus || {}).length) {
    return false;
  }
  
  for (const key in nextProps.analysisStatus || {}) {
    if ((prevProps.analysisStatus || {})[key] !== (nextProps.analysisStatus || {})[key]) {
      return false;
    }
  }
  
  return true;
});

PreviewGrid.displayName = "PreviewGrid";
