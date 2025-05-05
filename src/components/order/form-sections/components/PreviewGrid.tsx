
import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { Save, Image, X } from "lucide-react";
import { UploadProgress } from "@/components/upload/UploadProgress";
import { Skeleton } from "@/components/ui/skeleton";

const MAX_FILES = 4;

interface PreviewGridProps {
  previews: (string | undefined)[];
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
  const previewSlots = Array.from({ length: MAX_FILES }, (_, idx) => previews[idx]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: MAX_FILES }).map((_, idx) => (
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
            key={`preview-${idx}`}
            className={`relative group flex items-center justify-center w-full h-32 border-2 
              ${preview ? "border-solid" : "border-dashed"} rounded 
              ${preview ? "bg-white" : "bg-gray-50"}
              transition-all duration-200 ease-in-out`}
          >
            {preview ? (
              <>
                <img
                  src={preview}
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
          current={Math.round((uploadProgress / 100) * previews.filter(Boolean).length)}
          total={previews.filter(Boolean).length}
          progress={uploadProgress}
        />
      ) : (
        previews.filter(Boolean).length > 0 && (
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
  // Enhanced comparison function to reduce unnecessary re-renders
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.isUploading !== nextProps.isUploading) return false;
  if (prevProps.uploadProgress !== nextProps.uploadProgress) return false;
  
  // Create predictable string representation of preview arrays for comparison
  const prevPreviewsString = JSON.stringify(prevProps.previews.map(p => p || null));
  const nextPreviewsString = JSON.stringify(nextProps.previews.map(p => p || null));
  
  return prevPreviewsString === nextPreviewsString;
});

PreviewGrid.displayName = "PreviewGrid";
