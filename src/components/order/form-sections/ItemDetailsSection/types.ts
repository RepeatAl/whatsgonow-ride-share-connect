
import { UseFormReturn } from "react-hook-form";
import { CreateOrderFormValues } from "@/lib/validators/order";

export interface ItemDetails {
  title: string;
  description?: string;
  imageUrl?: string;
  orderId?: string;
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
