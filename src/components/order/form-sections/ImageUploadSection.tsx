
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Camera } from "lucide-react";
import { toast } from "sonner";
import { UploadQrCode } from "@/components/upload/UploadQrCode";
import { useDeviceType } from "@/hooks/useDeviceType";

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
  const { deviceType } = useDeviceType();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleOpenCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      await new Promise(resolve => video.onloadedmetadata = resolve);
      video.play();
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `camera-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
            
            if (selectedFiles.length + 1 <= MAX_FILES) {
              const url = URL.createObjectURL(blob);
              setSelectedFiles([...selectedFiles, file]);
              setPreviews([...previews, url]);
              toast.success("Foto erfolgreich aufgenommen!");
            } else {
              toast.error(`Maximal ${MAX_FILES} Bilder erlaubt.`);
            }
          }
        }, 'image/jpeg');
      }
      
      stream.getTracks().forEach(track => track.stop());
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error("Kamera konnte nicht geöffnet werden");
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
          const updatedFiles = [...selectedFiles, file];
          const updatedPreviews = [...previews, url];
          setSelectedFiles(updatedFiles);
          setPreviews(updatedPreviews);
        } else {
          toast.error(`Maximal ${MAX_FILES} Bilder erlaubt.`);
        }
      } catch (error) {
        console.error('Error processing mobile photo:', error);
        toast.error('Fehler beim Verarbeiten des Fotos');
      }
    });
  };
  
  // Add the removeFile function
  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...previews];
    
    // Release the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviews[index]);
    
    // Remove the file and preview at the specified index
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
              <div className="flex flex-wrap items-center gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleFileSelect}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Datei auswählen
                </Button>

                {deviceType === 'desktop' && userId && orderId && (
                  <UploadQrCode
                    userId={userId}
                    target={`order-${orderId}`}
                    onComplete={handleMobilePhotosComplete}
                  >
                    Mit Smartphone aufnehmen
                  </UploadQrCode>
                )}

                {deviceType === 'mobile' && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleOpenCamera}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Artikel fotografieren
                  </Button>
                )}

                <input 
                  ref={fileInputRef}
                  id="file-upload" 
                  type="file" 
                  multiple 
                  accept={ALLOWED_TYPES.join(",")} 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </div>
              <FormMessage />
            </FormItem>

            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {previews.map((src, idx) => (
                  <div key={idx} className="relative group">
                    <img src={src} className="w-full h-32 object-cover rounded" alt={`Upload ${idx + 1}`} />
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" 
                      onClick={() => removeFile(idx)}
                    >
                      &times;
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
