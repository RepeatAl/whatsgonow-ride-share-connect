
export interface PreRegistration {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  postal_code: string;
  wants_driver: boolean;
  wants_cm: boolean;
  wants_sender: boolean;
  vehicle_types: string[] | null;
  created_at: string;
  notification_sent: boolean;
}
