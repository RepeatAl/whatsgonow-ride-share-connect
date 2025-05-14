
import React, { memo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Save, Image, X, Camera, Upload, Plus } from "lucide-react";
import { UploadProgress } from "@/components/upload/UploadProgress";
import { Skeleton } from "@/components/ui/skeleton";
import { MAX_FILES } from "@/hooks/file-upload/constants";
import { Badge } from "@/components/ui/badge";
import { UploadQrCode } from "@/components/upload/UploadQrCode";
import { useDeviceType } from "@/hooks/useDeviceType";
import { toast } from "sonner";
import { useBulkUpload } from "@/contexts/BulkUploadContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AnalysisStatus } from "../ItemDetailsSection/types";

interface PreviewGridProps {
  previews: (string | ArrayBuffer | undefined)[];
  onRemove: (index: number) => void;
  onSave?: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
  isLoading?: boolean;
  onFileSelect?: (index: number) => void;
  onCameraOpen?: (index: number) => void;
  userId?: string;
  orderId?: string;
  onUploadComplete?: (urls: string[]) => void;
  analysisStatus?: Record<number, AnalysisStatus>;
  onAnalyze?: (index: number) => void;
}

export const PreviewGrid = memo(({ 
  previews, 
  onRemove,
  onSave,
  isUploading,
  uploadProgress = 0,
  isLoading = false,
  onFileSelect,
  onCameraOpen,
  userId,
  orderId,
  onUploadComplete,
  analysisStatus = {},
  onAnalyze
}: PreviewGridProps) => {
  const { deviceType } = useDeviceType();
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const { imageToArticleMap, createNewArticleWithImage, assignImageToArticle, articleForms } = useBulkUpload();
  
  // Always ensure we have a fixed-length array of MAX_FILES
  const previewSlots = Array(MAX_FILES).fill(undefined).map((_, idx) => previews[idx]);
  
  const filledCount = previews.filter(Boolean).length;

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setDragOver(null);
    
    if (!e.dataTransfer.files?.length) return;
    
    const file = e.dataTransfer.files[0];
    if (file) {
      // Here you would typically handle the file upload
      // For now we'll just simulate by using the existing onFileSelect callback
      if (onFileSelect) {
        onFileSelect(index);
      }
    }
  };

  // Geändert: stopPropagation hinzugefügt, um Konflikt zu vermeiden
  const handleSlotClick = (e: React.MouseEvent, index: number, hasPreview: boolean) => {
    // Bei existierendem Bild nichts tun
    if (hasPreview) return;
    
    // Nur wenn direktes Target das übergeordnete div ist, Datei-Upload auslösen
    if (e.currentTarget === e.target && onFileSelect) {
      onFileSelect(index);
    }
  };

  const handleFileInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    // Delegate to the main file handling logic
    if (onFileSelect) {
      onFileSelect(index);
    }
  };

  // Geändert: stopPropagation hinzugefügt, um Ereignisüberlappung zu vermeiden
  const openFileInput = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Verhindert Bubble-Up zum handleSlotClick
    
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]?.click();
    }
  };

  // Geändert: stopPropagation hinzugefügt, um Ereignisüberlappung zu vermeiden
  const handleCameraClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Verhindert Bubble-Up zum handleSlotClick
    
    if (onCameraOpen) {
      onCameraOpen(index);
    }
  };

  const handleAssignToArticle = (previewUrl: string, articleId: string) => {
    if (assignImageToArticle) {
      assignImageToArticle(previewUrl, articleId);
      toast.success("Bild wurde dem Artikel zugewiesen");
    }
  };

  const handleCreateArticle = (previewUrl: string) => {
    if (createNewArticleWithImage) {
      const newArticleId = createNewArticleWithImage(previewUrl);
      toast.success("Neuer Artikel mit Bild erstellt");
    }
  };

  const handleAnalyzeImage = (index: number) => {
    if (onAnalyze) {
      onAnalyze(index);
    }
  };

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
        {previewSlots.map((preview, idx) => {
          const previewUrl = typeof preview === "string" ? preview : "";
          const isAssigned = previewUrl && imageToArticleMap && previewUrl in imageToArticleMap;
          const analysisState = analysisStatus[idx];
          
          return (
            <div
              key={`preview-slot-${idx}`}
              className={`relative group flex flex-col items-center justify-center w-full h-32 border-2 
                ${dragOver === idx ? 'border-primary' : preview ? "border-solid" : "border-dashed"} rounded 
                ${preview ? "bg-white" : "bg-gray-50"}
                transition-all duration-200 ease-in-out`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(idx);
              }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleFileDrop(e, idx)}
              onClick={(e) => handleSlotClick(e, idx, !!preview)}
              role="button"
              tabIndex={0}
            >
              {preview ? (
                <>
                  <img
                    src={typeof preview === "string" ? preview : ""}
                    alt={`Foto ${idx + 1}`}
                    className="w-full h-full object-cover rounded transition-opacity duration-200"
                    loading="lazy"
                  />
                  
                  {/* Analysis Status Badge */}
                  {analysisState && (
                    <div className="absolute top-1 left-1">
                      <Badge 
                        className={`text-xs ${
                          analysisState === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                          analysisState === 'success' ? 'bg-green-100 text-green-800 border-green-200' : 
                          'bg-red-100 text-red-800 border-red-200'
                        }`}
                      >
                        {analysisState === 'pending' ? 'Analyse läuft...' : 
                         analysisState === 'success' ? 'Analysiert' : 
                         'Fehler'}
                      </Badge>
                    </div>
                  )}
                  
                  {/* Assignment Badge */}
                  {isAssigned && (
                    <div className="absolute top-1 right-8">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        Zugewiesen
                      </Badge>
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(idx);
                    }}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  {/* Assignment Menu for existing images */}
                  {!isAssigned && previewUrl && (
                    <div className="absolute bottom-1 right-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            type="button" 
                            variant="secondary" 
                            size="icon" 
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            onClick={(e) => e.stopPropagation()} // Verhindert, dass es den Slot-Click auslöst
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuItem onClick={() => handleCreateArticle(previewUrl)}>
                            Neuen Artikel erstellen
                          </DropdownMenuItem>
                          {articleForms.map(article => (
                            <DropdownMenuItem 
                              key={article.id} 
                              onClick={() => handleAssignToArticle(previewUrl, article.id)}
                            >
                              {article.title || `Artikel ${article.id.slice(0, 5)}`}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                  
                  {/* Analyze button - only if not already analyzed */}
                  {!analysisState && onAnalyze && (
                    <div className="absolute bottom-1 left-1">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAnalyzeImage(idx);
                        }}
                      >
                        Analysieren
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 p-2">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Image className="h-6 w-6 mb-1" />
                    <span className="text-xs text-center">
                      {`Foto ${idx + 1}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-center gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => openFileInput(e, idx)}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    
                    {deviceType === 'mobile' && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => handleCameraClick(e, idx)}
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
                  
                  <input 
                    ref={el => {
                      fileInputRefs.current[idx] = el;
                    }}
                    type="file" 
                    className="hidden" 
                    accept="image/jpeg,image/png,image/webp,image/gif" 
                    onChange={(e) => handleFileInputChange(idx, e)} 
                    onClick={(e) => e.stopPropagation()} 
                  />
                </div>
              )}
            </div>
          );
        })}
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
  
  // Compare analysis status objects
  if (Object.keys(prevProps.analysisStatus || {}).length !== Object.keys(nextProps.analysisStatus || {}).length) {
    return false;
  }
  
  for (const key in nextProps.analysisStatus || {}) {
    if ((prevProps.analysisStatus || {})[key] !== (nextProps.analysisStatus || {})[key]) {
      return false;
    }
  }
  
  return true;
});

PreviewGrid.displayName = "PreviewGrid";
