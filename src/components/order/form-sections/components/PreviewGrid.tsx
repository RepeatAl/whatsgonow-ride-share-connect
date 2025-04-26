
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { UploadProgress } from "@/components/upload/UploadProgress";

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
  if (previews.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {previews.map((src, idx) => (
          <div key={idx} className="relative group">
            <img 
              src={src} 
              className="w-full h-32 object-cover rounded" 
              alt={`Upload ${idx + 1}`} 
            />
            <Button 
              type="button" 
              variant="destructive" 
              size="icon" 
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" 
              onClick={() => onRemove(idx)}
              disabled={isUploading}
            >
              &times;
            </Button>
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
        <div className="flex justify-end">
          <Button 
            onClick={onSave} 
            disabled={isUploading || previews.length === 0}
          >
            <Save className="mr-2 h-4 w-4" />
            Fotos speichern
          </Button>
        </div>
      )}
    </div>
  );
};
