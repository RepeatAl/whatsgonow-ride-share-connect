
export type Order = {
  order_id: string;
  description: string;
  from_address: string;
  to_address: string;
  weight: number;
  deadline: string;
  status: string;
  sender_id?: string;
  verified_at?: string;
  region?: string;
};

export type UserWithRole = {
  id: string;
  role: string;
  region?: string;
};

