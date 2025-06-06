
export interface OrderItem {
  id?: string;
  name: string;
  quantity: number;
  weight?: number;
  dimensions?: string;
}

export interface DetailedItem {
  id: string;
  name: string;
  quantity: number;
  weight?: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
}
