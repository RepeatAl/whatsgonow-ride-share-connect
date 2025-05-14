
import React from "react";
import { Button } from "@/components/ui/button";
import { Image, Upload, Camera } from "lucide-react";
import { UploadQrCode } from "@/components/upload/UploadQrCode";

interface EmptyPreviewSlotProps {
  index: number;
  openFileInput: (e: React.MouseEvent, index: number) => void;
  handleCameraClick: (e: React.MouseEvent, index: number) => void;
  deviceType: string;
  userId?: string;
  orderId?: string;
  onUploadComplete?: (urls: string[]) => void;
}

export const EmptyPreviewSlot: React.FC<EmptyPreviewSlotProps> = ({
  index,
  openFileInput,
  handleCameraClick,
  deviceType,
  userId,
  orderId,
  onUploadComplete
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-2">
      <div className="flex flex-col items-center justify-center text-gray-400">
        <Image className="h-6 w-6 mb-1" />
        <span className="text-xs text-center">
          {`Foto ${index + 1}`}
        </span>
      </div>
      
      <div className="flex justify-center gap-2 mt-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => openFileInput(e, index)}
        >
          <Upload className="h-4 w-4" />
        </Button>
        
        {deviceType === 'mobile' && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => handleCameraClick(e, index)}
          >
            <Camera className="h-4 w-4" />
          </Button>
        )}
        
        {deviceType === 'desktop' && userId && orderId && (
          <div onClick={(e) => e.stopPropagation()}>
            <UploadQrCode
              userId={userId}
              target={`order-${orderId}`}
              onComplete={onUploadComplete || (() => {})}
              compact
            >
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </UploadQrCode>
          </div>
        )}
      </div>
    </div>
  );
};
