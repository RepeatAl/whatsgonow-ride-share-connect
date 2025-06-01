
// Profile Visibility Types - TypeScript Integration für Privacy Foundation
// ================================================================

// Basis-Interface für alle Profile-Typen
export interface BaseProfile {
  user_id: string;
  first_name: string;
  region: string;
  role: 'driver' | 'sender_private' | 'sender_business' | 'cm' | 'admin' | 'super_admin';
  avatar_url?: string;
  verified?: boolean;
  created_at?: string;
  active?: boolean;
}

// Öffentlich sichtbares Profil (für Listen, Karten, öffentliche Ansichten)
export interface PublicProfile extends BaseProfile {
  // Nur sichere, öffentliche Daten
  average_rating?: number;
  total_ratings?: number;
  last_active?: string;
  profile_complete?: boolean;
  verification_level?: 'basic' | 'verified' | 'premium';
}

// Privates Profil (nur für eigenen Account)
export interface PrivateProfile extends BaseProfile {
  // Vollständige eigene Daten
  last_name: string;
  email: string;
  phone: string;
  postal_code: string;
  city: string;
  street?: string;
  house_number?: string;
  address_extra?: string;
  company_name?: string;
  onboarding_complete?: boolean;
  profile_complete?: boolean;
  dashboard_access_enabled?: boolean;
  wants_to_upload_items?: boolean;
  
  // Privatsphäre-Status
  visibility_settings?: ProfileVisibilitySettings[];
  privacy_level?: PrivacyLevel;
  
  // Account-Status (nur für eigenen Account)
  is_suspended?: boolean;
  suspension_reason?: string;
  flagged_by_cm?: boolean;
  flag_reason?: string;
}

// Transaktions-Profil (erweiterte Sichtbarkeit bei aktiver Geschäftsbeziehung)
export interface TransactionProfile extends PublicProfile {
  // Zusätzliche Daten bei aktiver Transaktion
  last_name: string;
  email: string;
  phone: string;
  
  // Geschäfts-/Lieferadresse (wenn berechtigt)
  business_address?: {
    street: string;
    house_number: string;
    postal_code: string;
    city: string;
    address_extra?: string;
    company_name?: string;
  };
  
  // Transaktions-Context
  transaction_context: {
    order_id: string;
    counterparty_id: string;
    transaction_status: 'active' | 'completed' | 'cancelled';
    started_at: string;
    relationship_type: 'sender_driver' | 'business_partner';
  };
  
  // Eingeschränkte Transaktionshistorie (nur relevante)
  related_transactions?: TransactionSummary[];
}

// Admin/CM-Profil (vollständige Sichtbarkeit für Moderation)
export interface AdminProfile extends PrivateProfile {
  // Zusätzliche Moderations-Daten
  audit_logs?: ProfileAccessLog[];
  flag_history?: UserFlagAudit[];
  escalations?: EscalationLog[];
  trust_score?: number;
  suspension_history?: SuspensionLog[];
  
  // System-Metadaten
  created_by?: string;
  last_login?: string;
  ip_history?: string[];
  device_info?: any;
  
  // Vollständige Adressdaten
  full_address: {
    street: string;
    house_number: string;
    postal_code: string;
    city: string;
    region: string;
    country?: string;
    address_extra?: string;
  };
}

// Profile Visibility Settings (aus der DB)
export interface ProfileVisibilitySettings {
  id: string;
  user_id: string;
  field_name: string;
  visibility_level: VisibilityLevel;
  opt_in: boolean;
  created_at: string;
  updated_at: string;
}

// Transaction Participants (aus der DB)
export interface TransactionParticipants {
  id: string;
  order_id: string;
  user_id: string;
  counterparty_id: string;
  status: 'active' | 'completed' | 'cancelled';
  started_at: string;
  ended_at?: string;
}

// Profile Access Audit (aus der DB)
export interface ProfileAccessLog {
  id: string;
  accessed_by?: string;
  accessed_user_id: string;
  access_type: VisibilityLevel;
  order_id?: string;
  ip_address?: string;
  user_agent?: string;
  accessed_fields?: string[];
  accessed_at: string;
}

// Support-Typen
export type VisibilityLevel = 'public' | 'private' | 'transaction' | 'admin';
export type PrivacyLevel = 'minimal' | 'standard' | 'open';

export interface TransactionSummary {
  order_id: string;
  status: string;
  created_at: string;
  amount?: number;
  rating?: number;
}

export interface UserFlagAudit {
  id: string;
  user_id: string;
  flagged: boolean;
  reason?: string;
  actor_id?: string;
  role?: string;
  created_at: string;
}

export interface EscalationLog {
  id: string;
  user_id: string;
  escalation_type: string;
  trigger_reason: string;
  triggered_at: string;
  resolved_at?: string;
  resolved_by?: string;
  notes?: string;
}

export interface SuspensionLog {
  date: string;
  reason: string;
  duration?: string;
  resolved_at?: string;
}

// API Response Types
export interface ProfileApiResponse<T> {
  data: T;
  visibility_level: VisibilityLevel;
  accessible_fields: string[];
  privacy_notices?: string[];
  last_updated: string;
}

// Privacy API Types
export interface PrivacySettings {
  user_id: string;
  field_settings: Record<string, VisibilityLevel>;
  global_privacy_level: PrivacyLevel;
  opt_in_marketing: boolean;
  opt_in_analytics: boolean;
  data_retention_preference: 'minimal' | 'standard' | 'extended';
}

// Utility Types für API-Calls
export interface ProfileAccessRequest {
  target_user_id: string;
  access_type: VisibilityLevel;
  order_id?: string;
  requested_fields?: string[];
}

export interface ProfileAccessResponse {
  granted: boolean;
  profile_data?: PublicProfile | TransactionProfile | AdminProfile;
  accessible_fields: string[];
  access_limitations?: string[];
  expires_at?: string;
}

// Error Types für Privacy-System
export interface PrivacyError {
  code: 'INSUFFICIENT_PERMISSIONS' | 'NO_TRANSACTION_RELATIONSHIP' | 'PROFILE_NOT_FOUND' | 'PRIVACY_SETTINGS_RESTRICT';
  message: string;
  details?: {
    required_level: VisibilityLevel;
    current_level: VisibilityLevel;
    missing_relationship?: string;
  };
}
