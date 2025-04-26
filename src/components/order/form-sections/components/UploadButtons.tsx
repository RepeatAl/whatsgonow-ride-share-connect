
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Camera } from "lucide-react";
import { UploadQrCode } from "@/components/upload/UploadQrCode";
import { useDeviceType } from "@/hooks/useDeviceType";

interface UploadButtonsProps {
  userId?: string;
  orderId?: string;
  canTakeMore: boolean;
  nextPhotoIndex: number;
  onFileSelect: () => void;
  onCameraOpen: () => void;
  onMobilePhotosComplete: (files: string[]) => void;
}

export const UploadButtons = ({
  userId,
  orderId,
  canTakeMore,
  nextPhotoIndex,
  onFileSelect,
  onCameraOpen,
  onMobilePhotosComplete
}: UploadButtonsProps) => {
  const { deviceType } = useDeviceType();

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onFileSelect}
      >
        <Upload className="mr-2 h-4 w-4" />
        Datei auswählen
      </Button>

      {deviceType === 'mobile' && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCameraOpen}
          disabled={!canTakeMore}
        >
          <Camera className="mr-2 h-4 w-4" />
          {canTakeMore
            ? `Foto ${nextPhotoIndex} aufnehmen`
            : `Max. ${MAX_FILES} Fotos erreicht`}
        </Button>
      )}

      {deviceType === 'desktop' && userId && orderId && (
        <UploadQrCode
          userId={userId}
          target={`order-${orderId}`}
          onComplete={onMobilePhotosComplete}
        >
          Mit Smartphone aufnehmen
        </UploadQrCode>
      )}
    </div>
  );
};

const MAX_FILES = 4;
