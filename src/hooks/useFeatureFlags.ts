
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  FeatureFlag, 
  FeatureFlagName, 
  FeatureFlagAudit,
  FEATURE_FLAG_DEFAULTS, 
  getCurrentEnvironment,
  getFeatureFlagDefault
} from '@/config/featureFlags';

interface FeatureFlagState {
  flags: Record<FeatureFlagName, boolean>;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface FeatureFlagHealth {
  status: string;
  total_flags: number;
  active_flags: number;
  enabled_flags: number;
  archived_flags: number;
  audit_entries_today: number;
  last_change: string | null;
  environments_in_use: string[];
  categories_in_use: string[];
}

export const useFeatureFlags = () => {
  const [state, setState] = useState<FeatureFlagState>({
    flags: FEATURE_FLAG_DEFAULTS,
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const [health, setHealth] = useState<FeatureFlagHealth | null>(null);

  // Load flags from database with fallback to defaults
  const loadFlags = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const environment = getCurrentEnvironment();
      
      const { data: flags, error } = await supabase
        .from('active_feature_flags')
        .select('*')
        .eq('environment', environment);

      if (error) {
        console.warn('Failed to load feature flags from database, using defaults:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: `Database error: ${error.message}`,
          lastUpdated: new Date(),
        }));
        return;
      }

      // Merge database flags with defaults
      const flagsMap: Record<FeatureFlagName, boolean> = { ...FEATURE_FLAG_DEFAULTS };
      
      flags?.forEach((flag: FeatureFlag) => {
        if (flag.flag_name in FEATURE_FLAG_DEFAULTS) {
          flagsMap[flag.flag_name] = flag.enabled;
        }
      });

      // Apply environment-specific overrides for any missing flags
      Object.keys(FEATURE_FLAG_DEFAULTS).forEach(flagName => {
        const name = flagName as FeatureFlagName;
        if (!(flags?.some(f => f.flag_name === name))) {
          flagsMap[name] = getFeatureFlagDefault(name);
        }
      });

      setState({
        flags: flagsMap,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      });
      
    } catch (err) {
      console.error('Feature flags loading failed:', err);
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        lastUpdated: new Date(),
      }));
    }
  }, []);

  // Check individual flag with fallback
  const isFeatureEnabled = useCallback((flagName: FeatureFlagName): boolean => {
    if (state.loading) {
      return getFeatureFlagDefault(flagName);
    }
    
    return state.flags[flagName] ?? getFeatureFlagDefault(flagName);
  }, [state.flags, state.loading]);

  // Admin function: Toggle feature flag
  const toggleFeatureFlag = useCallback(async (
    flagName: FeatureFlagName, 
    enabled: boolean,
    reason?: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('feature_flags')
        .update({ 
          enabled,
          updated_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq('flag_name', flagName)
        .eq('environment', getCurrentEnvironment());

      if (error) {
        console.error('Failed to update feature flag:', error);
        return false;
      }

      // If reason provided, add it to audit metadata
      if (reason) {
        const { error: auditError } = await supabase
          .from('feature_flag_audit')
          .update({ reason })
          .eq('flag_name', flagName)
          .eq('action', enabled ? 'enabled' : 'disabled')
          .order('changed_at', { ascending: false })
          .limit(1);

        if (auditError) {
          console.warn('Failed to update audit reason:', auditError);
        }
      }

      // Reload flags to get updated state
      await loadFlags();
      
      return true;
    } catch (err) {
      console.error('Feature flag toggle failed:', err);
      return false;
    }
  }, [loadFlags]);

  // Load health status
  const loadHealth = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('check_feature_flag_health');
      
      if (error) {
        console.warn('Failed to load feature flag health:', error);
        return;
      }

      if (data && data.length > 0) {
        setHealth(data[0]);
      }
    } catch (err) {
      console.error('Health check failed:', err);
    }
  }, []);

  // Get audit history for a flag
  const getAuditHistory = useCallback(async (
    flagName?: FeatureFlagName,
    limit = 50
  ): Promise<FeatureFlagAudit[]> => {
    try {
      let query = supabase
        .from('feature_flag_audit')
        .select('*')
        .order('changed_at', { ascending: false })
        .limit(limit);

      if (flagName) {
        query = query.eq('flag_name', flagName);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to load audit history:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Audit history loading failed:', err);
      return [];
    }
  }, []);

  // Set up real-time subscriptions for flag changes
  useEffect(() => {
    loadFlags();
    loadHealth();

    const subscription = supabase
      .channel('feature_flags_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feature_flags',
          filter: `environment=eq.${getCurrentEnvironment()}`,
        },
        (payload) => {
          console.log('Feature flag changed:', payload);
          loadFlags(); // Reload flags when changes occur
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [loadFlags, loadHealth]);

  return {
    // State
    flags: state.flags,
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    health,

    // Actions
    isFeatureEnabled,
    toggleFeatureFlag,
    loadFlags,
    loadHealth,
    getAuditHistory,

    // Utilities
    environment: getCurrentEnvironment(),
  };
};

// Feature Gate Component
export interface FeatureGateProps {
  flag: FeatureFlagName;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  flag,
  children,
  fallback = null,
  loading = null,
}) => {
  const { isFeatureEnabled, loading: flagsLoading } = useFeatureFlags();

  if (flagsLoading && loading) {
    return <>{loading}</>;
  }

  return isFeatureEnabled(flag) ? <>{children}</> : <>{fallback}</>;
};

// Hook for checking specific analytics features
export const useAnalyticsFeatureFlags = () => {
  const { isFeatureEnabled } = useFeatureFlags();

  return {
    eventsV2: isFeatureEnabled('analytics_events_v2'),
    videoTracking: isFeatureEnabled('video_analytics_tracking'),
    languageTracking: isFeatureEnabled('language_analytics_tracking'),
    errorMonitoring: isFeatureEnabled('analytics_error_monitoring'),
    validationDashboard: isFeatureEnabled('analytics_validation_dashboard'),
    experimental: isFeatureEnabled('experimental_analytics_features'),
  };
};
