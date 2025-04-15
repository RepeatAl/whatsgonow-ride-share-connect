
export type Order = {
  order_id: string;
  description: string;
  from_address: string;
  to_address: string;
  weight: number;
  deadline: string;
  status: string;
  region?: string;
};
