
import React, { useState } from "react";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { CameraModal } from "./CameraModal";
import { UploadButtons } from "./components/UploadButtons";
import { PreviewGrid } from "./components/PreviewGrid";
import { useFileUpload } from "@/hooks/useFileUpload";
import { toast } from "sonner";

// Define allowed file types
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface ImageUploadSectionProps {
  userId?: string;
  orderId?: string;
  onPhotosUploaded?: (urls: string[]) => void;
}

export const ImageUploadSection = ({
  userId,
  orderId,
  onPhotosUploaded
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
    uploadProgress,
    previews,
    canTakeMore,
    nextPhotoIndex
  } = useFileUpload(orderId);

  const handleSave = async () => {
    if (!orderId) {
      toast.error("Bitte speichern Sie zuerst den Auftrag");
      return;
    }

    const uploadedUrls = await uploadFiles();
    if (uploadedUrls && onPhotosUploaded) {
      onPhotosUploaded(uploadedUrls);
    }
  };

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
                accept={ALLOWED_TYPES.join(",")} 
                onChange={handleFileChange} 
                className="hidden" 
              />
              
              <FormMessage />
            </FormItem>

            <PreviewGrid 
              previews={previews} 
              onRemove={removeFile}
              onSave={handleSave}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
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
