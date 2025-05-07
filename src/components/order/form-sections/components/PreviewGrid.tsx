
import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { Save, Image, X } from "lucide-react";
import { UploadProgress } from "@/components/upload/UploadProgress";
import { Skeleton } from "@/components/ui/skeleton";
import { MAX_FILES } from "@/hooks/file-upload/constants";

interface PreviewGridProps {
  previews: (string | ArrayBuffer | undefined)[];
  onRemove: (index: number) => void;
  onSave?: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
  isLoading?: boolean;
}

export const PreviewGrid = memo(({ 
  previews, 
  onRemove,
  onSave,
  isUploading,
  uploadProgress = 0,
  isLoading = false
}: PreviewGridProps) => {
  // Always ensure we have a fixed-length array of MAX_FILES
  const previewSlots = Array(MAX_FILES).fill(undefined).map((_, idx) => previews[idx]);
  
  const filledCount = previews.filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array(MAX_FILES).fill(0).map((_, idx) => (
          <Skeleton key={`skeleton-${idx}`} className="w-full h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {previewSlots.map((preview, idx) => (
          <div
            key={`preview-slot-${idx}`}
            className={`relative group flex items-center justify-center w-full h-32 border-2 
              ${preview ? "border-solid" : "border-dashed"} rounded 
              ${preview ? "bg-white" : "bg-gray-50"}
              transition-all duration-200 ease-in-out`}
          >
            {preview ? (
              <>
                <img
                  src={typeof preview === "string" ? preview : ""}
                  alt={`Foto ${idx + 1}`}
                  className="w-full h-full object-cover rounded transition-opacity duration-200"
                  loading="lazy"
                />
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                  onClick={() => onRemove(idx)}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <Image className="h-6 w-6 mb-1" />
                <span className="text-xs text-center">
                  {`Foto ${idx + 1} fehlt`}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {isUploading ? (
        <UploadProgress 
          current={Math.round((uploadProgress / 100) * filledCount)}
          total={filledCount}
          progress={uploadProgress}
        />
      ) : (
        filledCount > 0 && (
          <div className="flex justify-end">
            <Button 
              onClick={onSave} 
              disabled={isUploading}
            >
              <Save className="mr-2 h-4 w-4" />
              Fotos speichern
            </Button>
          </div>
        )
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Optimized deep comparison function to reduce unnecessary re-renders
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.isUploading !== nextProps.isUploading) return false;
  if (prevProps.uploadProgress !== nextProps.uploadProgress) return false;
  
  // Compare preview arrays - they must be the same length by design
  if (prevProps.previews.length !== nextProps.previews.length) return false;
  
  // Do a value-based comparison of each preview URL rather than reference comparison
  for (let i = 0; i < MAX_FILES; i++) {
    if (prevProps.previews[i] !== nextProps.previews[i]) {
      return false;
    }
  }
  
  return true;
});

PreviewGrid.displayName = "PreviewGrid";
