
import { UseFormReturn } from "react-hook-form";
import { CreateOrderFormValues } from "@/lib/validators/order";

// Zentraler Enum für Analysestatus
export type AnalysisStatus = 'pending' | 'success' | 'failed';

export interface ItemDetails {
  title: string;
  description?: string;
  image_url?: string;
  orderId?: string;
  analysis_status?: AnalysisStatus; // Verwende den neuen Typ
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
