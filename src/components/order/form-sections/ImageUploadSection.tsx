
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, QrCode, Camera } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { UploadQrCode } from "@/components/upload/UploadQrCode";
import { QRScanner } from "@/components/qr/QRScanner";

const MAX_FILES = 4;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface ImageUploadSectionProps {
  deviceType: 'mobile' | 'desktop';
  userId?: string;
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  previews: string[];
  setPreviews: (previews: string[]) => void;
}

export const ImageUploadSection = ({
  deviceType,
  userId,
  selectedFiles,
  setSelectedFiles,
  previews,
  setPreviews
}: ImageUploadSectionProps) => {
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [showItemQrScanner, setShowItemQrScanner] = useState(false);

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

  const removeFile = (idx: number) => {
    const newSelectedFiles = selectedFiles.filter((_, i) => i !== idx);
    setSelectedFiles(newSelectedFiles);
    const newPreviews = previews.filter((_, i) => i !== idx);
    if (previews[idx]) URL.revokeObjectURL(previews[idx]);
    setPreviews(newPreviews);
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
          // Fix TypeScript errors by creating new arrays instead of using function references
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

  const handleCameraScan = (decodedText: string) => {
    try {
      handleMobilePhotosComplete([decodedText]);
      setShowQrScanner(false);
      toast.success("Bild erfolgreich aufgenommen!");
    } catch (error) {
      toast.error("Fehler beim Scannen des Bildes");
    }
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
                <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Datei auswählen
                </Button>

                <Button type="button" variant="outline" onClick={() => setShowItemQrScanner(true)}>
                  <QrCode className="mr-2 h-4 w-4" />
                  QR-Code scannen
                </Button>

                {deviceType === 'mobile' && (
                  <Button type="button" variant="outline" onClick={() => {
                    if (!navigator.mediaDevices?.getUserMedia) {
                      toast.error("Dein Gerät unterstützt keine Kamera-API");
                      return;
                    }
                    setShowQrScanner(true);
                  }}>
                    <Camera className="mr-2 h-4 w-4" />
                    Jetzt Bild aufnehmen
                  </Button>
                )}

                {deviceType === 'desktop' && userId && (
                  <UploadQrCode userId={userId} target="order-photos" onComplete={handleMobilePhotosComplete} />
                )}

                <input id="file-upload" type="file" multiple accept={ALLOWED_TYPES.join(",")} onChange={handleFileChange} className="hidden" />
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

      <Dialog open={showQrScanner} onOpenChange={setShowQrScanner}>
        <DialogContent className="sm:max-w-md">
          <QRScanner onScan={handleCameraScan} onClose={() => setShowQrScanner(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showItemQrScanner} onOpenChange={setShowItemQrScanner}>
        <DialogContent className="sm:max-w-md">
          <QRScanner onScan={() => {}} onClose={() => setShowItemQrScanner(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
