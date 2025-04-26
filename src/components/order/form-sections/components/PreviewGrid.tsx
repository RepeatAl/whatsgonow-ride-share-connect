
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Image, X } from "lucide-react";
import { UploadProgress } from "@/components/upload/UploadProgress";

const MAX_FILES = 4;

interface PreviewGridProps {
  previews: string[];
  onRemove: (index: number) => void;
  onSave?: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
}

export const PreviewGrid = ({ 
  previews, 
  onRemove,
  onSave,
  isUploading,
  uploadProgress = 0
}: PreviewGridProps) => {
  // Create an array of 4 slots, filling empty slots with undefined
  const previewSlots = Array.from({ length: MAX_FILES }, (_, idx) => previews[idx]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {previewSlots.map((preview, idx) => (
          <div
            key={idx}
            className={`relative group flex items-center justify-center w-full h-32 border-2 ${
              preview ? "border-solid" : "border-dashed"
            } rounded ${preview ? "bg-white" : "bg-gray-50"}`}
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt={`Foto ${idx + 1}`}
                  className="w-full h-full object-cover rounded"
                />
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" 
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
          current={Math.round((uploadProgress / 100) * previews.length)}
          total={previews.length}
          progress={uploadProgress}
        />
      ) : (
        previews.length > 0 && (
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
};
