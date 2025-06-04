
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, CheckCircle, AlertTriangle, XCircle, BarChart3 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAnalyticsFeatureFlags } from '@/hooks/useAnalyticsFeatureFlags';

interface AnalyticsHealth {
  total_events: number;
  events_today: number;
  unique_sessions_today: number;
  error_events_today: number;
  last_event_at: string | null;
  most_common_event_types: Array<{ event_type: string; count: number }>;
}

const AnalyticsValidationMonitor = () => {
  const [health, setHealth] = useState<AnalyticsHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const featureFlags = useAnalyticsFeatureFlags();

  const fetchAnalyticsHealth = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get basic stats
      const { data: totalData, error: totalError } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      // Get today's events
      const today = new Date().toISOString().split('T')[0];
      const { data: todayData, error: todayError } = await supabase
        .from('analytics_events')
        .select('session_id, event_type')
        .gte('created_at', today);

      if (todayError) throw todayError;

      // Get error events today
      const { data: errorData, error: errorDataError } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today)
        .like('event_type', '%error%');

      if (errorDataError) throw errorDataError;

      // Get last event
      const { data: lastEventData, error: lastEventError } = await supabase
        .from('analytics_events')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (lastEventError && lastEventError.code !== 'PGRST116') {
        throw lastEventError;
      }

      // Calculate unique sessions today
      const uniqueSessions = todayData ? new Set(todayData.map(e => e.session_id)).size : 0;

      // Count event types
      const eventTypeCounts = todayData?.reduce((acc, event) => {
        acc[event.event_type] = (acc[event.event_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const mostCommonEventTypes = Object.entries(eventTypeCounts)
        .map(([event_type, count]) => ({ event_type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setHealth({
        total_events: totalData?.length || 0,
        events_today: todayData?.length || 0,
        unique_sessions_today: uniqueSessions,
        error_events_today: errorData?.length || 0,
        last_event_at: lastEventData?.created_at || null,
        most_common_event_types: mostCommonEventTypes
      });

    } catch (err: any) {
      console.error('Analytics health check failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsHealth();
  }, []);

  const getHealthStatus = () => {
    if (!health) return 'unknown';
    
    if (health.error_events_today > health.events_today * 0.1) {
      return 'critical'; // More than 10% errors
    }
    if (health.events_today === 0) {
      return 'warning'; // No events today
    }
    return 'healthy';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'critical': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'warning': return <Badge className="bg-amber-100 text-amber-800">Warning</Badge>;
      case 'critical': return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (!featureFlags.validationDashboard) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics Validation Monitor
          </CardTitle>
          <CardDescription>Feature disabled</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Analytics validation dashboard is currently disabled. Enable the 'analytics_validation_dashboard' feature flag to use this monitor.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics Validation Monitor
            </CardTitle>
            <CardDescription>
              Real-time health monitoring for analytics events
            </CardDescription>
          </div>
          <Button 
            onClick={fetchAnalyticsHealth} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load analytics health: {error}
            </AlertDescription>
          </Alert>
        )}

        {health && (
          <div className="space-y-4">
            {/* Overall Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(getHealthStatus())}
                <span className="font-medium">Analytics Health:</span>
                {getStatusBadge(getHealthStatus())}
              </div>
              <span className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold">{health.total_events}</div>
                <div className="text-sm text-muted-foreground">Total Events</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold">{health.events_today}</div>
                <div className="text-sm text-muted-foreground">Events Today</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold">{health.unique_sessions_today}</div>
                <div className="text-sm text-muted-foreground">Sessions Today</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-red-600">{health.error_events_today}</div>
                <div className="text-sm text-muted-foreground">Errors Today</div>
              </div>
            </div>

            {/* Feature Flags Status */}
            <div className="border rounded-lg p-3">
              <h4 className="font-medium mb-2">Feature Flags Status</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Events V2:</span>
                  <Badge variant={featureFlags.eventsV2 ? "default" : "secondary"}>
                    {featureFlags.eventsV2 ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Video Tracking:</span>
                  <Badge variant={featureFlags.videoTracking ? "default" : "secondary"}>
                    {featureFlags.videoTracking ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Language Tracking:</span>
                  <Badge variant={featureFlags.languageTracking ? "default" : "secondary"}>
                    {featureFlags.languageTracking ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Error Monitoring:</span>
                  <Badge variant={featureFlags.errorMonitoring ? "default" : "secondary"}>
                    {featureFlags.errorMonitoring ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Most Common Events */}
            {health.most_common_event_types.length > 0 && (
              <div className="border rounded-lg p-3">
                <h4 className="font-medium mb-2">Top Event Types Today</h4>
                <div className="space-y-1">
                  {health.most_common_event_types.map(({ event_type, count }) => (
                    <div key={event_type} className="flex justify-between text-sm">
                      <span>{event_type}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Last Event */}
            {health.last_event_at && (
              <div className="text-sm text-muted-foreground">
                Last event: {new Date(health.last_event_at).toLocaleString()}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsValidationMonitor;
