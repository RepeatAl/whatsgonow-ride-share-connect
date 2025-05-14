
import React from "react";
import { PreviewImage } from "./PreviewImage";
import { EmptyPreviewSlot } from "./EmptyPreviewSlot";
import { AnalysisStatus } from "../../ItemDetailsSection/types";

interface PreviewSlotProps {
  preview: string | ArrayBuffer | undefined;
  index: number;
  dragOver: number | null;
  onRemove: (index: number) => void;
  isUploading?: boolean;
  imageToArticleMap?: Record<string, string>;
  analysisStatus?: Record<number, AnalysisStatus>;
  handleCreateArticle: (previewUrl: string) => void;
  handleAssignToArticle: (previewUrl: string, articleId: string) => void;
  handleAnalyzeImage: (index: number) => void;
  articleForms: Array<{ id: string; title?: string }>;
  openFileInput: (e: React.MouseEvent, index: number) => void;
  handleCameraClick: (e: React.MouseEvent, index: number) => void;
  handleSlotClick: (e: React.MouseEvent, index: number, hasPreview: boolean) => void;
  deviceType: string;
  userId?: string;
  orderId?: string;
  onUploadComplete?: (urls: string[]) => void;
  onAnalyze?: (index: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileInputChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PreviewSlot: React.FC<PreviewSlotProps> = ({
  preview,
  index,
  dragOver,
  onRemove,
  isUploading,
  imageToArticleMap,
  analysisStatus,
  handleCreateArticle,
  handleAssignToArticle,
  handleAnalyzeImage,
  articleForms,
  openFileInput,
  handleCameraClick,
  handleSlotClick,
  deviceType,
  userId,
  orderId,
  onUploadComplete,
  onAnalyze,
  fileInputRef,
  handleFileInputChange
}) => {
  const previewUrl = typeof preview === "string" ? preview : "";
  const isAssigned = previewUrl && imageToArticleMap && previewUrl in imageToArticleMap;
  const analysisState = analysisStatus?.[index];
  
  return (
    <div
      className={`relative group flex flex-col items-center justify-center w-full h-32 border-2 
        ${dragOver === index ? 'border-primary' : preview ? "border-solid" : "border-dashed"} rounded 
        ${preview ? "bg-white" : "bg-gray-50"}
        transition-all duration-200 ease-in-out`}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onClick={(e) => handleSlotClick(e, index, !!preview)}
      role="button"
      tabIndex={0}
    >
      {preview ? (
        <PreviewImage
          preview={previewUrl}
          index={index}
          onRemove={onRemove}
          isUploading={isUploading}
          isAssigned={isAssigned}
          analysisState={analysisState}
          handleCreateArticle={handleCreateArticle}
          handleAssignToArticle={handleAssignToArticle}
          handleAnalyzeImage={handleAnalyzeImage}
          articleForms={articleForms}
          onAnalyze={onAnalyze}
        />
      ) : (
        <EmptyPreviewSlot
          index={index}
          openFileInput={openFileInput}
          handleCameraClick={handleCameraClick}
          deviceType={deviceType}
          userId={userId}
          orderId={orderId}
          onUploadComplete={onUploadComplete}
        />
      )}
      
      <input 
        ref={fileInputRef}
        type="file" 
        className="hidden" 
        accept="image/jpeg,image/png,image/webp,image/gif" 
        onChange={(e) => handleFileInputChange(index, e)} 
        onClick={(e) => e.stopPropagation()} 
      />
    </div>
  );
};
