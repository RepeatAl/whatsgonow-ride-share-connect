
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface PreviewGridProps {
  previews: string[];
  onRemove: (index: number) => void;
}

export const PreviewGrid = ({ previews, onRemove }: PreviewGridProps) => {
  if (previews.length === 0) return null;

  return (
    <>
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
            >
              &times;
            </Button>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Fotos speichern
        </Button>
      </div>
    </>
  );
};
