
import React, { useState, useRef } from "react";
import { PreviewSlot } from "./PreviewSlot";
import { EmptyPreviewSlot } from "./EmptyPreviewSlot";
import { cn } from "@/lib/utils";

export interface PreviewGridProps {
  images: (string | null)[];
  onImageChange: (index: number, file: File) => void;
  onImageRemove: (index: number) => void;
  className?: string;
  imageCount?: number;
  readonly?: boolean;
  deviceType?: string;
  userId?: string;
  orderId?: string;
  onUploadComplete?: (urls: string[]) => void;
}

export const PreviewGrid: React.FC<PreviewGridProps> = ({
  images,
  onImageChange,
  onImageRemove,
  className,
  imageCount = 3,
  readonly = false,
  deviceType = "desktop",
  userId,
  orderId,
  onUploadComplete,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const fileInputRefs = useRef<HTMLInputElement[]>([]);

  // Initialize refs array
  if (!fileInputRefs.current || fileInputRefs.current.length !== imageCount) {
    fileInputRefs.current = Array(imageCount)
      .fill(null)
      .map((_, i) => fileInputRefs.current?.[i] || null);
  }

  // Set up input ref
  const setInputRef = (el: HTMLInputElement | null, index: number) => {
    if (fileInputRefs.current && el) {
      fileInputRefs.current[index] = el;
    }
  };

  const handleImageClick = (index: number) => {
    if (readonly) return;
    setActiveIndex(index);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(index, file);
    }
  };

  const openFileInput = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (fileInputRefs.current && fileInputRefs.current[index]) {
      fileInputRefs.current[index].click();
    }
  };

  const handleCameraClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex(index);
    // Additional camera handling logic
  };

  return (
    <div className={cn("grid grid-cols-3 gap-2 md:gap-4", className)}>
      {Array(imageCount)
        .fill(null)
        .map((_, i) => (
          <div
            key={i}
            className={cn(
              "aspect-square border rounded-md overflow-hidden",
              activeIndex === i && "ring-2 ring-primary",
              "cursor-pointer"
            )}
            onClick={() => handleImageClick(i)}
          >
            <input
              type="file"
              ref={(el) => setInputRef(el, i)}
              onChange={(e) => handleFileInputChange(e, i)}
              className="hidden"
              accept="image/*"
            />

            {images[i] ? (
              <PreviewSlot
                src={images[i]!}
                index={i}
                onRemoveClick={() => onImageRemove(i)}
                readonly={readonly}
              />
            ) : (
              <EmptyPreviewSlot
                index={i}
                openFileInput={openFileInput}
                handleCameraClick={handleCameraClick}
                deviceType={deviceType}
                userId={userId}
                orderId={orderId}
                onUploadComplete={onUploadComplete}
              />
            )}
          </div>
        ))}
    </div>
  );
};
