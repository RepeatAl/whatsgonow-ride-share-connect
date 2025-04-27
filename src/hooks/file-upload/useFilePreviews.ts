
import { useState } from "react";
import { toast } from "sonner";
import { MAX_FILES } from "./constants";

export const useFilePreviews = () => {
  const [previews, setPreviews] = useState<string[]>([]);

  const updatePreviews = (newUrls: string[]) => {
    setPreviews(prev => {
      const newPreviews = [...prev];
      newUrls.forEach((url, idx) => {
        const nextEmptySlot = newPreviews.findIndex(p => !p);
        if (nextEmptySlot !== -1) {
          newPreviews[nextEmptySlot] = url;
        } else {
          newPreviews.push(url);
        }
      });
      return newPreviews.slice(0, MAX_FILES);
    });
  };

  const removePreview = (index: number) => {
    const newPreviews = [...previews];
    if (newPreviews[index]) {
      URL.revokeObjectURL(newPreviews[index]);
    }
    newPreviews[index] = undefined;
    setPreviews(newPreviews.filter(Boolean));
  };

  const clearPreviews = () => {
    previews.forEach(preview => {
      if (preview) URL.revokeObjectURL(preview);
    });
    setPreviews([]);
  };

  return {
    previews,
    updatePreviews,
    removePreview,
    clearPreviews,
    canTakeMore: previews.filter(Boolean).length < MAX_FILES,
    nextPhotoIndex: previews.filter(Boolean).length + 1
  };
};
