import React, { useState, useMemo, useCallback } from "react";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { CameraModal } from "./CameraModal";
import { UploadButtons } from "./components/UploadButtons";
import { PreviewGrid } from "./components/PreviewGrid";
import { useFileUpload } from "@/hooks/file-upload/useFileUpload";
import { useUploadInit } from "@/hooks/file-upload/useUploadInit";
import { toast } from "sonner";

interface ImageUploadSectionProps {
  userId?: string;
  orderId?: string;
  onPhotosUploaded?: (urls: string[]) => void;
  existingUrls?: string[];
}

export const ImageUploadSection = ({
  userId,
  orderId,
  onPhotosUploaded,
  existingUrls = []
}: ImageUploadSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  } = useFileUpload(orderId, existingUrls);

  useUploadInit({
    existingUrls,
    initializeWithExistingUrls: useFileUpload.initializeWithExistingUrls
  });

  const handleRemoveFile = useCallback((index: number) => {
    removeFile(index);
  }, [removeFile]);

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

  const memoizedPreviews = useMemo(() => previews, [previews]);

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Bilder hochladen</h3>
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <FormItem>
              <FormLabel>Bilder hochladen (max. 4, 2 MB pro Datei)</FormLabel>
              
              <UploadButtons
                userId={userId}
                orderId={orderId}
                canTakeMore={canTakeMore}
                nextPhotoIndex={nextPhotoIndex}
                onFileSelect={handleFileSelect}
                onCameraOpen={() => setIsModalOpen(true)}
                onMobilePhotosComplete={handleMobilePhotosComplete}
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

            <PreviewGrid 
              previews={memoizedPreviews}
              onRemove={handleRemoveFile}
              onSave={handleSave}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              isLoading={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      <CameraModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCapture={handleCapture}
        nextPhotoIndex={nextPhotoIndex}
      />
    </div>
  );
};
