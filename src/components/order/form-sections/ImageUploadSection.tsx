
import React, { useState, useMemo, useCallback } from "react";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { CameraModal } from "./CameraModal";
import { UploadButtons } from "./components/UploadButtons";
import { PreviewGrid } from "./components/PreviewGrid";
import { useFileUpload } from "@/hooks/file-upload/useFileUpload";
import { toast } from "sonner";

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

  // Stable callback for removing files
  const handleRemoveFile = useCallback((index: number) => {
    removeFile(index);
  }, [removeFile]);

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

  // Create stable props for child components to prevent unnecessary re-renders
  const uploadButtonsProps = useMemo(() => ({
    userId,
    orderId,
    canTakeMore,
    nextPhotoIndex,
    onFileSelect: handleFileSelect,
    onCameraOpen: () => setIsModalOpen(true),
    onMobilePhotosComplete: handleMobilePhotosComplete
  }), [userId, orderId, canTakeMore, nextPhotoIndex, handleFileSelect, handleMobilePhotosComplete]);

  const previewGridProps = useMemo(() => ({
    previews,
    onRemove: handleRemoveFile,
    onSave: handleSave,
    isUploading,
    uploadProgress,
    isLoading
  }), [previews, handleRemoveFile, handleSave, isUploading, uploadProgress, isLoading]);

  // Create stable modal props
  const modalProps = useMemo(() => ({
    isOpen: isModalOpen,
    onClose: () => setIsModalOpen(false),
    onCapture: handleCapture,
    nextPhotoIndex
  }), [isModalOpen, handleCapture, nextPhotoIndex]);

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Bilder hochladen</h3>
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <FormItem>
              <FormLabel>Bilder hochladen (max. 4, 2 MB pro Datei)</FormLabel>
              
              <UploadButtons {...uploadButtonsProps} />

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

            <PreviewGrid {...previewGridProps} />
          </div>
        </CardContent>
      </Card>

      <CameraModal {...modalProps} />
    </div>
  );
};
