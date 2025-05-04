
import { AuditEventType, AuditEntityType, AuditSeverity } from '@/constants/auditEvents';

export interface SubmitOfferParams {
  orderId: string;
  driverId: string;
  price: number;
  message?: string;
}

export interface Offer {
  offer_id: string;
  order_id: string;
  driver_id: string;
  price: number;
  status: 'eingereicht' | 'angenommen' | 'abgelehnt';
  created_at: string;
  message?: string;
  driver?: {
    user_id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
}
