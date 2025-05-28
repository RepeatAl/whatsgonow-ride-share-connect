
import { useTranslation } from 'react-i18next';
import { Leaf, TrendingUp, Award, Users, Route, Recycle } from 'lucide-react';
import type { ESGMetric, ESGGoal, ESGData } from '@/types/esg';

// Development-only missing keys logging
const logMissingKey = (key: string, namespace: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[ESG-i18n] Missing translation key: ${key} in namespace: ${namespace}`);
  }
};

export const useESGMetrics = (data: ESGData): ESGMetric[] => {
  const { t, ready, i18n } = useTranslation('landing');

  // Check if translations are ready and log status
  if (process.env.NODE_ENV === 'development') {
    console.debug('[ESG-i18n] Translation ready:', ready);
    console.debug('[ESG-i18n] Current language:', i18n.language);
    console.debug('[ESG-i18n] Landing namespace loaded:', i18n.hasResourceBundle(i18n.language, 'landing'));
  }

  const getTranslation = (key: string, fallback: string): string => {
    const translation = t(key, fallback);
    if (translation === key && process.env.NODE_ENV === 'development') {
      logMissingKey(key, 'landing');
    }
    return translation;
  };

  return [
    {
      key: 'metric1',
      icon: Leaf,
      value: data.metrics.co2Saved,
      unit: 'kg',
      color: 'green'
    },
    {
      key: 'metric2', 
      icon: Route,
      value: data.metrics.emptyRidesAvoided,
      unit: '',
      color: 'blue'
    },
    {
      key: 'metric3',
      icon: Award,
      value: data.metrics.esgScore,
      unit: '',
      color: 'orange'
    }
  ].map(metric => ({
    ...metric,
    title: getTranslation(`esg.${metric.key}.title`, `Metric ${metric.key}`),
    description: getTranslation(`esg.${metric.key}.description`, `Description for ${metric.key}`)
  })) as ESGMetric[];
};

export const useESGDashboardMetrics = (data: ESGData): ESGMetric[] => {
  const { t, ready, i18n } = useTranslation('landing');

  const getTranslation = (key: string, fallback: string): string => {
    const translation = t(key, fallback);
    if (translation === key && process.env.NODE_ENV === 'development') {
      logMissingKey(key, 'landing');
    }
    return translation;
  };

  return [
    {
      key: 'dashboard_metric1',
      icon: Leaf,
      value: data.metrics.co2Saved,
      unit: 'kg',
      progress: 78,
      color: 'green'
    },
    {
      key: 'dashboard_metric2',
      icon: Route, 
      value: data.metrics.emptyRidesAvoided,
      unit: t('common.units.trips', 'Fahrten'),
      progress: 65,
      color: 'blue'
    },
    {
      key: 'dashboard_metric3',
      icon: Users,
      value: data.metrics.activeUsers,
      unit: t('common.units.users', 'Nutzer'),
      progress: 85,
      color: 'purple'
    },
    {
      key: 'dashboard_metric4',
      icon: TrendingUp,
      value: data.metrics.efficiencyImprovement,
      unit: '%',
      progress: data.metrics.efficiencyImprovement,
      color: 'orange'
    },
    {
      key: 'dashboard_metric5',
      icon: Recycle,
      value: data.metrics.reuseRate,
      unit: '%',
      progress: data.metrics.reuseRate,
      color: 'teal'
    },
    {
      key: 'dashboard_metric6',
      icon: Award,
      value: data.metrics.esgScore,
      unit: '',
      progress: 87,
      color: 'amber'
    }
  ].map(metric => ({
    ...metric,
    title: getTranslation(`esg.dashboard.${metric.key}.title`, `Dashboard Metric ${metric.key}`),
    description: getTranslation(`esg.dashboard.${metric.key}.description`, `Description for ${metric.key}`)
  })) as ESGMetric[];
};

export const useESGGoals = (data: ESGData): ESGGoal[] => {
  const { t } = useTranslation('landing');

  return [
    {
      key: 'goal1',
      progress: data.goals.co2Neutrality
    },
    {
      key: 'goal2', 
      progress: data.goals.electricVehicles
    },
    {
      key: 'goal3',
      progress: data.goals.zeroWaste
    }
  ];
};
