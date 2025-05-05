
export type AddressBookEntry = {
  id?: string;
  user_id?: string;
  type: 'pickup' | 'delivery';
  name?: string;
  street: string;
  house_number: string;
  postal_code: string;
  city: string;
  country: string;
  address_extra?: string;
  phone?: string;
  email?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
};
