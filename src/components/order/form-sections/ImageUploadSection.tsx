
import React, { useState, useRef } from "react";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { CameraModal } from "./CameraModal";
import { UploadButtons } from "./components/UploadButtons";
import { PreviewGrid } from "./components/PreviewGrid";

const MAX_FILES = 4;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface ImageUploadSectionProps {
  userId?: string;
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  previews: string[];
  setPreviews: (previews: string[]) => void;
  orderId?: string;
}

export const ImageUploadSection = ({
  userId,
  selectedFiles,
  setSelectedFiles,
  previews,
  setPreviews,
  orderId
}: ImageUploadSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nextPhotoIndex = selectedFiles.length + 1;
  const canTakeMore = nextPhotoIndex <= MAX_FILES;

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > MAX_FILES) {
      toast.error(`Maximal ${MAX_FILES} Bilder erlaubt.`);
      return;
    }
    const validFiles: File[] = [];
    const validPreviews: string[] = [];
    files.forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} ist größer als 2 MB.`);
        return;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name} ist kein unterstütztes Format.`);
        return;
      }
      validFiles.push(file);
      const url = URL.createObjectURL(file);
      validPreviews.push(url);
    });
    setSelectedFiles([...selectedFiles, ...validFiles]);
    setPreviews([...previews, ...validPreviews]);
  };

  const handleCapture = (file: File, url: string) => {
    if (canTakeMore) {
      setSelectedFiles([...selectedFiles, file]);
      setPreviews([...previews, url]);
      toast.success(`Foto ${nextPhotoIndex} erfolgreich aufgenommen!`);
    } else {
      toast.error(`Maximal ${MAX_FILES} Fotos erlaubt.`);
    }
  };

  const handleMobilePhotosComplete = (files: string[]) => {
    files.forEach(async url => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], `mobile-photo-${Date.now()}.jpg`, {
          type: 'image/jpeg'
        });
        if (selectedFiles.length + 1 <= MAX_FILES) {
          setSelectedFiles([...selectedFiles, file]);
          setPreviews([...previews, url]);
        } else {
          toast.error(`Maximal ${MAX_FILES} Fotos erlaubt.`);
        }
      } catch (error) {
        console.error('Error processing mobile photo:', error);
        toast.error('Fehler beim Verarbeiten des Fotos');
      }
    });
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...previews];
    
    URL.revokeObjectURL(newPreviews[index]);
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
    
    toast.success("Bild erfolgreich entfernt");
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Bilder hochladen</h3>
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <FormItem>
              <FormLabel>Bilder hochladen (max. {MAX_FILES}, 2 MB pro Datei)</FormLabel>
              
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
