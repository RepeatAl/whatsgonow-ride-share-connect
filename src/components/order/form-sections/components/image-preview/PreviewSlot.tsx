
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export interface PreviewSlotProps {
  src: string;
  index: number;
  onRemoveClick: () => void;
  readonly?: boolean;
}

export const PreviewSlot: React.FC<PreviewSlotProps> = ({
  src,
  index,
  onRemoveClick,
  readonly = false,
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <img
        src={src}
        alt={`Preview ${index + 1}`}
        className="h-full w-full object-cover"
      />
      {!readonly && (
        <Button
          type="button"
          size="icon"
          variant="destructive"
          className="absolute top-1 right-1 h-6 w-6"
          onClick={onRemoveClick}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};
