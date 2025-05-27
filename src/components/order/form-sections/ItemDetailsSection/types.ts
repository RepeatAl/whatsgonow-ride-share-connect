
import { UseFormReturn } from "react-hook-form";
import { CreateOrderFormValues } from "@/lib/validators/order";

// Zentraler Enum für Analysestatus
export type AnalysisStatus = 'pending' | 'success' | 'failed';

export interface ItemDetails {
  title: string;
  description?: string;
  image_url?: string;
  orderId?: string;
  analysis_status?: AnalysisStatus;
  id?: string;
  category?: string;
}

export interface ItemFormProps {
  onSaveItem: (item: ItemDetails) => void;
  orderId?: string;
}

export interface ItemPreviewCardProps {
  item: ItemDetails;
  index: number;
  onRemove: (index: number) => void;
}

export interface ItemListProps {
  items: ItemDetails[];
  onRemoveItem: (index: number) => void;
}

export interface ItemDetailsSectionProps {
  form: UseFormReturn<CreateOrderFormValues>;
  insuranceEnabled: boolean;
  orderId?: string;
  items?: ItemDetails[];
  onAddItem?: (item: ItemDetails) => void;
  onRemoveItem?: (index: number) => void;
}

export interface ItemAnalysisCardProps {
  imageUrl: string;
  suggestion: any;
  index: number;
  onAccept: (index: number) => void;
  onIgnore: (index: number) => void;
  showAssignOptions?: boolean;
}

export interface ItemPhotoAnalysisGridProps {
  analyzedImages: Array<{
    fileUrl: string;
    suggestion: any;
  }>;
  onAcceptImage: (index: number) => void;
  onIgnoreImage: (index: number) => void;
  showAssignOptions?: boolean;
}

export interface MultiItemSuggestionBoxProps {
  suggestions: Record<string, any>;
  onAccept: (imageUrl: string) => void;
  onIgnore: (imageUrl: string) => void;
  form: UseFormReturn<any>;
}
