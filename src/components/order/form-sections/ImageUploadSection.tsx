
import React, { useState, useMemo, useCallback } from "react";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { CameraModal } from "./CameraModal";
import { PreviewGrid } from "./components/image-preview";
import { useFileUpload } from "@/hooks/file-upload/useFileUpload";
import { toast } from "sonner";
import { BulkUploadProvider } from "@/contexts/BulkUploadContext";
import { useItemAnalysis } from "@/hooks/useItemAnalysis";

interface ImageUploadSectionProps {
  userId?: string;
  orderId?: string;
  uploadedPhotoUrls?: string[];
  onPhotosUploaded?: (urls: string[]) => void;
  existingUrls?: string[];
}

export const ImageUploadSection = ({
  userId,
  orderId,
  uploadedPhotoUrls = [],
  onPhotosUploaded,
  existingUrls = []
}: ImageUploadSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState<Record<number, 'pending' | 'success' | 'failed'>>({});

  // Initialize file upload hook with stable references
  const {
    fileInputRef,
    handleFileSelect,
    handleFileChange,
    handleCapture,
    handleMobilePhotosComplete,
    removeFile,
    uploadFiles,
    isUploading,
    isLoading,
    uploadProgress,
    previews,
    canTakeMore,
    nextPhotoIndex
  } = useFileUpload(orderId, existingUrls || uploadedPhotoUrls);
  
  // Initialize item analysis hook
  const { analyzeItemPhoto, isAnalyzing } = useItemAnalysis();

  // Stable callback for removing files
  const handleRemoveFile = useCallback((index: number) => {
    removeFile(index);
    
    // Also remove analysis status
    setAnalysisStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[index];
      return newStatus;
    });
  }, [removeFile]);

  // Handle file selection for a specific slot
  const handleSlotFileSelect = useCallback((slotIndex: number) => {
    setActiveSlotIndex(slotIndex);
    handleFileSelect();
  }, [handleFileSelect]);

  // Handle camera open for a specific slot
  const handleSlotCameraOpen = useCallback((slotIndex: number) => {
    setActiveSlotIndex(slotIndex);
    setIsModalOpen(true);
  }, []);

  // Handle automatic analysis when a file is added
  const handleAnalyzeImage = useCallback(async (index: number) => {
    if (!previews[index]) return;
    
    const imageUrl = previews[index] as string;
    if (!imageUrl) return;
    
    setAnalysisStatus(prev => ({ ...prev, [index]: 'pending' }));
    
    try {
      const result = await analyzeItemPhoto({
        item_id: `temp-${index}`,
        photo_url: imageUrl
      });
      
      if (result) {
        setAnalysisStatus(prev => ({ ...prev, [index]: 'success' }));
      } else {
        setAnalysisStatus(prev => ({ ...prev, [index]: 'failed' }));
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setAnalysisStatus(prev => ({ ...prev, [index]: 'failed' }));
      toast.error("Fehler bei der Bildanalyse");
    }
  }, [analyzeItemPhoto, previews]);

  // Optimize save handler with stable dependencies
  const handleSave = useCallback(async () => {
    if (!orderId) {
      toast.error("Bitte speichern Sie zuerst den Auftrag");
      return;
    }

    const uploadedUrls = await uploadFiles(userId);
    if (uploadedUrls && onPhotosUploaded) {
      onPhotosUploaded(uploadedUrls);
      toast.success("Fotos erfolgreich gespeichert");
    }
  }, [orderId, userId, uploadFiles, onPhotosUploaded]);
  
  // Convert previews to the format expected by PreviewGrid
  const imageList = useMemo(() => {
    return previews.length > 0 ? previews : Array(4).fill(null);
  }, [previews]);
  
  const handleImageChange = useCallback((index: number, file: File) => {
    // Handle file change using our existing handlers
    if (file) {
      const fileList = new DataTransfer();
      fileList.items.add(file);
      
      const syntheticEvent = {
        target: {
          files: fileList.files,
          value: ""
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      handleFileChange(syntheticEvent);
    }
  }, [handleFileChange]);

  // Create stable modal props
  const modalProps = useMemo(() => ({
    isOpen: isModalOpen,
    onClose: () => setIsModalOpen(false),
    onCapture: handleCapture,
    nextPhotoIndex: activeSlotIndex + 1
  }), [isModalOpen, handleCapture, activeSlotIndex]);

  return (
    <BulkUploadProvider>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Bilder hochladen</h3>
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <FormItem>
                <FormLabel>Bilder hochladen (max. 4, 2 MB pro Datei)</FormLabel>
                
                <PreviewGrid 
                  images={imageList}
                  onImageChange={handleImageChange}
                  onImageRemove={handleRemoveFile}
                  imageCount={4}
                  deviceType="desktop"
                  userId={userId}
                  orderId={orderId}
                  onUploadComplete={handleMobilePhotosComplete}
                />
                
                <input 
                  ref={fileInputRef}
                  type="file" 
                  multiple 
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                
                <FormMessage />
              </FormItem>
            </div>
          </CardContent>
        </Card>

        <CameraModal {...modalProps} />
      </div>
    </BulkUploadProvider>
  );
};
