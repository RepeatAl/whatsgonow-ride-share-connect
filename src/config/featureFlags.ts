
export type FeatureFlagName = 
  | 'analytics_events_v2'
  | 'video_analytics_tracking'
  | 'language_analytics_tracking'
  | 'analytics_error_monitoring'
  | 'analytics_validation_dashboard'
  | 'experimental_analytics_features';

export type FeatureFlagScope = 'global' | 'user' | 'role' | 'region';
export type FeatureFlagEnvironment = 'production' | 'staging' | 'development';
export type FeatureFlagCategory = 'analytics' | 'ui' | 'api' | 'security' | 'monitoring' | 'admin' | 'experimental';

export interface FeatureFlag {
  flag_name: FeatureFlagName;
  enabled: boolean;
  description: string;
  category: FeatureFlagCategory;
  scope: FeatureFlagScope;
  environment: FeatureFlagEnvironment;
  metadata: Record<string, any>;
  version: number;
  updated_at: string;
}

export interface FeatureFlagAudit {
  audit_id: string;
  flag_id: string;
  flag_name: FeatureFlagName;
  action: 'enabled' | 'disabled' | 'created' | 'updated' | 'deleted' | 'archived';
  field_changed?: string;
  previous_value?: any;
  new_value?: any;
  changed_by?: string;
  changed_at: string;
  reason?: string;
  environment: FeatureFlagEnvironment;
  metadata: Record<string, any>;
}

// Environment-basierte Fallbacks (wenn Database nicht verfügbar)
export const FEATURE_FLAG_DEFAULTS: Record<FeatureFlagName, boolean> = {
  analytics_events_v2: true,
  video_analytics_tracking: true,
  language_analytics_tracking: true,
  analytics_error_monitoring: true,
  analytics_validation_dashboard: false,
  experimental_analytics_features: false,
};

// Environment-spezifische Overrides
export const ENVIRONMENT_OVERRIDES: Partial<Record<FeatureFlagEnvironment, Partial<Record<FeatureFlagName, boolean>>>> = {
  development: {
    analytics_validation_dashboard: true,
    experimental_analytics_features: true,
  },
  staging: {
    experimental_analytics_features: true,
  },
  production: {
    experimental_analytics_features: false,
  },
};

// Helper für Environment Detection
export const getCurrentEnvironment = (): FeatureFlagEnvironment => {
  if (typeof window === 'undefined') return 'production';
  
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  }
  
  if (hostname.includes('staging') || hostname.includes('preview')) {
    return 'staging';
  }
  
  return 'production';
};

// Type Guards
export const isValidFeatureFlagName = (name: string): name is FeatureFlagName => {
  return Object.keys(FEATURE_FLAG_DEFAULTS).includes(name as FeatureFlagName);
};

export const getFeatureFlagDefault = (flagName: FeatureFlagName): boolean => {
  const environment = getCurrentEnvironment();
  const envOverride = ENVIRONMENT_OVERRIDES[environment]?.[flagName];
  
  return envOverride !== undefined ? envOverride : FEATURE_FLAG_DEFAULTS[flagName];
};
