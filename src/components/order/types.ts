
export interface OrderItem {
  id: string; // Required instead of optional
  name: string;
  quantity: number;
  weight: number; // Made required to match Item interface
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface DetailedItem {
  id: string;
  name: string;
  quantity: number;
  weight: number; // Required
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
}
