
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, CheckCircle } from "lucide-react";
import { AnalysisStatus } from "./types";

interface ItemPhotoSectionProps {
  imageUrl?: string;
  onImageUpload: (file: File) => void;
  analysis_status?: AnalysisStatus;
  onRequestAnalysis?: () => void;
}

export function ItemPhotoSection({ 
  imageUrl, 
  onImageUpload, 
  analysis_status, 
  onRequestAnalysis 
}: ItemPhotoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      onImageUpload(file);
      setIsUploading(false);
      e.target.value = ''; // Reset the input
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Artikelbild</label>
        {analysis_status === 'success' && (
          <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Analyse abgeschlossen
          </Badge>
        )}
      </div>
      
      <div className="flex gap-4 items-start">
        <div 
          className="border border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors w-full h-32"
          onClick={handleFileSelect}
        >
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Artikelbild" 
              className="max-h-full max-w-full object-contain" 
            />
          ) : (
            <div className="text-gray-500 text-sm text-center">
              <Upload className="h-8 w-8 mx-auto mb-2" />
              <p>Klicken, um ein Bild hochzuladen</p>
            </div>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
        />
      </div>
      
      {imageUrl && onRequestAnalysis && (
        <Button 
          type="button" 
          variant="outline" 
          className="w-full"
          onClick={onRequestAnalysis}
          disabled={analysis_status === 'success'}
        >
          {analysis_status === 'success' ? 'Analyse abgeschlossen' : 'Bild analysieren'}
        </Button>
      )}
    </div>
  );
}
