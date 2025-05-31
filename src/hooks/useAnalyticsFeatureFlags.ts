
import { useFeatureFlags } from './useFeatureFlags';

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
