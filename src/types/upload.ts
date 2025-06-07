
export interface GuestUploadSession {
  id: string;
  session_id: string;
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  location_consent: boolean;
  location_captured_at: string | null;
  expires_at: string;
  created_at: string;
  file_count: number;
  migrated_to_user_id: string | null;
  migrated_at: string | null;
}

export interface GuestMapItem {
  type: 'guest';
  id: string;
  lat: number;
  lng: number;
  expires_at: string;
  session_id: string;
  title: string;
  file_count: number;
  status: 'active';
}

// Erweitere PublicMapItem um guest type
export type PublicMapItem = {
  id: string;
  type: 'trip' | 'item' | 'order' | 'offer' | 'guest';
  title: string;
  lat: number;
  lng: number;
  price?: number;
  date?: string;
  route_polyline?: string;
  category?: string;
  status: string;
  from_address?: string;
  to_address?: string;
  weight?: number;
  description?: string;
  expires_at?: string;
  session_id?: string;
  file_count?: number;
};

export interface LocationConsentOptions {
  granted: boolean;
  accuracy?: number;
  timestamp?: string;
}

export interface GeoLocation {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: string;
}

export interface UploadWithLocation {
  file: File;
  location?: GeoLocation;
  consent: boolean;
}
