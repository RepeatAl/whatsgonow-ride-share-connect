
import React from "react";
import { ItemPhotoAnalysisGridProps } from "./types";
import { ItemAnalysisCard } from "./ItemAnalysisCard";

export function ItemPhotoAnalysisGrid({
  analyzedImages,
  onAcceptImage,
  onIgnoreImage,
  showAssignOptions = false
}: ItemPhotoAnalysisGridProps) {
  if (!analyzedImages || analyzedImages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Analysierte Bilder</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {analyzedImages.map((item, index) => (
          <ItemAnalysisCard
            key={`analyzed-image-${index}`}
            imageUrl={item.fileUrl}
            suggestion={item.suggestion}
            index={index}
            onAccept={onAcceptImage}
            onIgnore={onIgnoreImage}
            showAssignOptions={showAssignOptions}
          />
        ))}
      </div>
    </div>
  );
}
