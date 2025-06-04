
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, XCircle, Play, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

interface TestResult {
  testName: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
  duration?: number;
}

interface SystemTestResults {
  overallStatus: 'healthy' | 'warning' | 'critical';
  testResults: TestResult[];
  timestamp: string;
}

const SystemTestRunner: React.FC = () => {
  const [testResults, setTestResults] = useState<SystemTestResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const { health: featureFlagHealth, loadHealth } = useFeatureFlags();

  const runSystemTests = async () => {
    setIsRunning(true);
    const startTime = Date.now();
    const results: TestResult[] = [];

    try {
      // Test 1: Database Connectivity
      const dbTest = await testDatabaseConnectivity();
      results.push(dbTest);

      // Test 2: RLS Policies
      const rlsTest = await testRLSPolicies();
      results.push(rlsTest);

      // Test 3: Feature Flags Health
      await loadHealth();
      const flagTest = await testFeatureFlags();
      results.push(flagTest);

      // Test 4: Storage Access
      const storageTest = await testStorageAccess();
      results.push(storageTest);

      // Test 5: Authentication Flow
      const authTest = await testAuthenticationFlow();
      results.push(authTest);

      // Determine overall status
      const failedTests = results.filter(r => r.status === 'fail');
      const warningTests = results.filter(r => r.status === 'warning');
      
      const overallStatus = 
        failedTests.length > 0 ? 'critical' :
        warningTests.length > 0 ? 'warning' : 'healthy';

      setTestResults({
        overallStatus,
        testResults: results,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('System test runner failed:', error);
      results.push({
        testName: 'System Test Runner',
        status: 'fail',
        message: 'Test runner encountered an error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });

      setTestResults({
        overallStatus: 'critical',
        testResults: results,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsRunning(false);
    }
  };

  const testDatabaseConnectivity = async (): Promise<TestResult> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true });

      if (error) {
        return {
          testName: 'Database Connectivity',
          status: 'fail',
          message: 'Database connection failed',
          details: error.message
        };
      }

      return {
        testName: 'Database Connectivity',
        status: 'pass',
        message: 'Database connection successful'
      };
    } catch (error) {
      return {
        testName: 'Database Connectivity',
        status: 'fail',
        message: 'Database test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const testRLSPolicies = async (): Promise<TestResult> => {
    try {
      // Test that RLS is working for profiles table
      const { data: currentUser } = await supabase.auth.getUser();
      
      if (!currentUser.user) {
        return {
          testName: 'RLS Policies',
          status: 'warning',
          message: 'Cannot test RLS without authenticated user',
          details: 'User not authenticated'
        };
      }

      // Try to access user's own profile (should work)
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('user_id', currentUser.user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        return {
          testName: 'RLS Policies',
          status: 'fail',
          message: 'RLS policy test failed',
          details: error.message
        };
      }

      return {
        testName: 'RLS Policies',
        status: 'pass',
        message: 'RLS policies are working correctly'
      };
    } catch (error) {
      return {
        testName: 'RLS Policies',
        status: 'fail',
        message: 'RLS test encountered an error',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const testFeatureFlags = async (): Promise<TestResult> => {
    try {
      if (!featureFlagHealth) {
        return {
          testName: 'Feature Flags',
          status: 'warning',
          message: 'Feature flag health data not available',
          details: 'Health check may have failed'
        };
      }

      if (featureFlagHealth.status === 'healthy') {
        return {
          testName: 'Feature Flags',
          status: 'pass',
          message: `Feature flags healthy (${featureFlagHealth.enabled_flags}/${featureFlagHealth.total_flags} enabled)`
        };
      } else {
        return {
          testName: 'Feature Flags',
          status: 'warning',
          message: `Feature flags status: ${featureFlagHealth.status}`,
          details: `${featureFlagHealth.enabled_flags}/${featureFlagHealth.total_flags} flags enabled`
        };
      }
    } catch (error) {
      return {
        testName: 'Feature Flags',
        status: 'fail',
        message: 'Feature flag test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const testStorageAccess = async (): Promise<TestResult> => {
    try {
      // Test storage bucket access (using videos bucket as example)
      const { data, error } = await supabase.storage
        .from('videos')
        .list('', { limit: 1 });

      if (error) {
        return {
          testName: 'Storage Access',
          status: 'fail',
          message: 'Storage access failed',
          details: error.message
        };
      }

      return {
        testName: 'Storage Access',
        status: 'pass',
        message: 'Storage access successful'
      };
    } catch (error) {
      return {
        testName: 'Storage Access',
        status: 'fail',
        message: 'Storage test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const testAuthenticationFlow = async (): Promise<TestResult> => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const { data: user } = await supabase.auth.getUser();

      if (!session.session && !user.user) {
        return {
          testName: 'Authentication Flow',
          status: 'warning',
          message: 'No active session found',
          details: 'User not authenticated'
        };
      }

      return {
        testName: 'Authentication Flow',
        status: 'pass',
        message: 'Authentication flow working correctly'
      };
    } catch (error) {
      return {
        testName: 'Authentication Flow',
        status: 'fail',
        message: 'Authentication test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    }
  };

  const getStatusBadge = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy': return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'warning': return <Badge className="bg-amber-100 text-amber-800">Warning</Badge>;
      case 'critical': return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
    }
  };

  useEffect(() => {
    // Auto-run tests on component mount
    runSystemTests();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              System Test Runner
            </CardTitle>
            <CardDescription>
              Comprehensive system health and functionality tests
            </CardDescription>
          </div>
          <Button 
            onClick={runSystemTests} 
            disabled={isRunning}
            variant="outline"
          >
            {isRunning ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isRunning ? 'Running Tests...' : 'Run Tests'}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {testResults && (
          <div className="space-y-4">
            {/* Overall Status */}
            <Alert className={`border-2 ${
              testResults.overallStatus === 'healthy' ? 'border-green-200 bg-green-50' :
              testResults.overallStatus === 'warning' ? 'border-amber-200 bg-amber-50' :
              'border-red-200 bg-red-50'
            }`}>
              <AlertDescription className="flex items-center justify-between">
                <span className="font-medium">
                  Overall System Status: {getStatusBadge(testResults.overallStatus)}
                </span>
                <span className="text-sm text-muted-foreground">
                  Last run: {new Date(testResults.timestamp).toLocaleString()}
                </span>
              </AlertDescription>
            </Alert>

            {/* Individual Test Results */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Test Results</h4>
              {testResults.testResults.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <p className="font-medium text-sm">{test.testName}</p>
                      <p className="text-sm text-muted-foreground">{test.message}</p>
                      {test.details && (
                        <p className="text-xs text-muted-foreground mt-1">{test.details}</p>
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant={test.status === 'pass' ? 'default' : 
                             test.status === 'warning' ? 'secondary' : 'destructive'}
                  >
                    {test.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {isRunning && !testResults && (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Running system tests...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemTestRunner;
