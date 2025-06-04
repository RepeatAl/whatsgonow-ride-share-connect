
/**
 * Feature Flags Configuration for Whatsgonow
 * Centralized feature flag management with environment support
 */

export type FeatureFlagName = 
  | 'video_gallery_public'
  | 'bulk_item_upload'
  | 'multilingual_chat'
  | 'trust_score_system' 
  | 'invoice_management'
  | 'real_time_tracking'
  | 'analytics_events_v2'
  | 'video_analytics_tracking'
  | 'language_analytics_tracking'
  | 'analytics_error_monitoring'
  | 'analytics_validation_dashboard'
  | 'experimental_analytics_features';

export interface FeatureFlag {
  flag_name: FeatureFlagName;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  description?: string;
  environment: string;
  metadata?: Record<string, any>;
}

export interface FeatureFlagAudit {
  audit_id: string;
  flag_name: FeatureFlagName;
  action: 'enabled' | 'disabled' | 'created' | 'deleted' | 'updated';
  previous_value?: Record<string, any>;
  new_value?: Record<string, any>;
  changed_by?: string;
  changed_at: string;
  reason?: string;
  field_changed?: string;
}

export interface FeatureFlagHealth {
  status: string;
  total_flags: number;
  enabled_flags: number;
  audit_entries_today: number;
  last_check: string;
}

// Default values for feature flags (fallback when DB unavailable)
export const FEATURE_FLAG_DEFAULTS: Record<FeatureFlagName, boolean> = {
  video_gallery_public: true,
  bulk_item_upload: false,
  multilingual_chat: false,
  trust_score_system: false,
  invoice_management: true,
  real_time_tracking: false,
  analytics_events_v2: true,
  video_analytics_tracking: true,
  language_analytics_tracking: true,
  analytics_error_monitoring: true,
  analytics_validation_dashboard: false,
  experimental_analytics_features: false,
};

// Environment detection
export const getCurrentEnvironment = (): string => {
  if (typeof window === 'undefined') return 'production';
  
  const hostname = window.location.hostname;
  
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return 'development';
  }
  
  if (hostname.includes('staging') || hostname.includes('preview')) {
    return 'staging';
  }
  
  return 'production';
};

// Get default value for a feature flag
export const getFeatureFlagDefault = (flagName: FeatureFlagName): boolean => {
  return FEATURE_FLAG_DEFAULTS[flagName] ?? false;
};

// Feature flag categories for organization
export const FEATURE_FLAG_CATEGORIES = {
  UI: ['video_gallery_public', 'multilingual_chat'],
  ANALYTICS: ['analytics_events_v2', 'video_analytics_tracking', 'language_analytics_tracking', 'analytics_error_monitoring', 'analytics_validation_dashboard'],
  BACKEND: ['bulk_item_upload', 'trust_score_system', 'invoice_management', 'real_time_tracking'],
  EXPERIMENTAL: ['experimental_analytics_features']
} as const;
