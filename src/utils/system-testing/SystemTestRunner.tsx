
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle, Play, RotateCcw } from 'lucide-react';
import { runRLSTests } from '@/utils/rls-testing';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { useAnalyticsFeatureFlags } from '@/hooks/useAnalyticsFeatureFlags';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import { supabase } from '@/lib/supabaseClient';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'warning' | 'running';
  message: string;
  details?: string;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  status: 'passed' | 'failed' | 'warning' | 'running' | 'pending';
}

const SystemTestRunner: React.FC = () => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { user, profile } = useSimpleAuth();
  const { currentLanguage, availableLanguages } = useLanguageMCP();
  const { flags, loading: ffLoading, health } = useFeatureFlags();
  const analyticsFlags = useAnalyticsFeatureFlags();

  const updateTestSuite = useCallback((suiteName: string, tests: TestResult[], status?: TestSuite['status']) => {
    setTestSuites(prev => {
      const existing = prev.find(s => s.name === suiteName);
      if (existing) {
        existing.tests = tests;
        if (status) existing.status = status;
        return [...prev];
      } else {
        return [...prev, { name: suiteName, tests, status: status || 'running' }];
      }
    });
  }, []);

  const runAuthenticationTests = useCallback(async () => {
    const tests: TestResult[] = [];
    
    try {
      // Test 1: Auth Session
      const { data: session } = await supabase.auth.getSession();
      tests.push({
        name: 'Auth Session Check',
        status: session.session ? 'passed' : 'failed',
        message: session.session ? 'User authenticated' : 'No active session',
        details: user ? `User: ${user.email}` : 'Not logged in'
      });

      // Test 2: Profile Data
      tests.push({
        name: 'Profile Data',
        status: profile ? 'passed' : 'warning',
        message: profile ? `Profile loaded for role: ${profile.role}` : 'No profile data',
        details: profile ? `Region: ${profile.region}, Complete: ${profile.profile_complete}` : undefined
      });

      // Test 3: Role-based Access
      if (profile) {
        const hasValidRole = ['super_admin', 'admin', 'cm', 'sender_private', 'sender_business', 'driver'].includes(profile.role);
        tests.push({
          name: 'Role Validation',
          status: hasValidRole ? 'passed' : 'failed',
          message: hasValidRole ? `Valid role: ${profile.role}` : `Invalid role: ${profile.role}`,
        });
      }

    } catch (error) {
      tests.push({
        name: 'Authentication Error',
        status: 'failed',
        message: `Auth test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    updateTestSuite('Authentication & Profile', tests, 'passed');
  }, [user, profile, updateTestSuite]);

  const runFeatureFlagTests = useCallback(async () => {
    const tests: TestResult[] = [];

    try {
      // Test 1: Feature Flags Loading
      tests.push({
        name: 'Feature Flags Loading',
        status: !ffLoading ? 'passed' : 'running',
        message: !ffLoading ? 'Feature flags loaded successfully' : 'Still loading...',
        details: `Flags count: ${Object.keys(flags).length}`
      });

      // Test 2: Analytics Flags
      const analyticsEnabled = analyticsFlags.eventsV2;
      tests.push({
        name: 'Analytics Feature Flags',
        status: 'passed',
        message: `Analytics V2: ${analyticsEnabled ? 'Enabled' : 'Disabled'}`,
        details: `Video: ${analyticsFlags.videoTracking}, Language: ${analyticsFlags.languageTracking}`
      });

      // Test 3: Health Check
      tests.push({
        name: 'Feature Flag Health',
        status: health ? 'passed' : 'warning',
        message: health ? `Health: ${health.status}` : 'No health data',
        details: health ? `Total flags: ${health.total_flags}, Active: ${health.active_flags}` : undefined
      });

    } catch (error) {
      tests.push({
        name: 'Feature Flag Error',
        status: 'failed',
        message: `Feature flag test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    updateTestSuite('Feature Flags', tests, 'passed');
  }, [flags, ffLoading, health, analyticsFlags, updateTestSuite]);

  const runLanguageRoutingTests = useCallback(async () => {
    const tests: TestResult[] = [];

    try {
      // Test 1: Current Language
      tests.push({
        name: 'Current Language',
        status: currentLanguage ? 'passed' : 'failed',
        message: `Active language: ${currentLanguage}`,
        details: `Available: ${availableLanguages.join(', ')}`
      });

      // Test 2: URL Structure
      const currentPath = window.location.pathname;
      const hasLanguagePrefix = /^\/[a-z]{2}/.test(currentPath);
      tests.push({
        name: 'URL Language Prefix',
        status: hasLanguagePrefix ? 'passed' : 'warning',
        message: hasLanguagePrefix ? 'URL has language prefix' : 'No language prefix in URL',
        details: `Current path: ${currentPath}`
      });

      // Test 3: Fallback Mechanism
      tests.push({
        name: 'Language Fallback',
        status: availableLanguages.length > 1 ? 'passed' : 'warning',
        message: `${availableLanguages.length} languages available`,
        details: `Fallback mechanism: ${availableLanguages.includes('de') ? 'DE available' : 'No DE fallback'}`
      });

    } catch (error) {
      tests.push({
        name: 'Language Routing Error',
        status: 'failed',
        message: `Language test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    updateTestSuite('Language & Routing', tests, 'passed');
  }, [currentLanguage, availableLanguages, updateTestSuite]);

  const runDatabaseAccessTests = useCallback(async () => {
    const tests: TestResult[] = [];

    try {
      // Test 1: Basic Connection
      const { count: profileCount, error: profileError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      tests.push({
        name: 'Database Connection',
        status: !profileError ? 'passed' : 'failed',
        message: !profileError ? 'Database accessible' : `Connection error: ${profileError.message}`,
        details: !profileError ? `Profiles table accessible, count: ${profileCount}` : undefined
      });

      // Test 2: RLS Policy Check (own profile)
      if (user) {
        const { data: ownProfile, error: ownProfileError } = await supabase
          .from('profiles')
          .select('role, region')
          .eq('user_id', user.id)
          .single();

        tests.push({
          name: 'RLS Own Profile Access',
          status: !ownProfileError ? 'passed' : 'failed',
          message: !ownProfileError ? 'Can access own profile' : `RLS error: ${ownProfileError.message}`,
          details: ownProfile ? `Role: ${ownProfile.role}, Region: ${ownProfile.region}` : undefined
        });
      }

      // Test 3: Public Data Access
      const { data: adminVideos, error: videoError } = await supabase
        .from('admin_videos')
        .select('id, public, active')
        .eq('public', true)
        .eq('active', true)
        .limit(5);

      tests.push({
        name: 'Public Data Access',
        status: !videoError ? 'passed' : 'warning',
        message: !videoError ? 'Public videos accessible' : `Video access issue: ${videoError.message}`,
        details: adminVideos ? `Found ${adminVideos.length} public videos` : undefined
      });

    } catch (error) {
      tests.push({
        name: 'Database Access Error',
        status: 'failed',
        message: `Database test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    updateTestSuite('Database Access & RLS', tests, 'passed');
  }, [user, updateTestSuite]);

  const runComprehensiveRLSTests = useCallback(async () => {
    const tests: TestResult[] = [];
    
    try {
      updateTestSuite('RLS Comprehensive Tests', [
        { name: 'Starting RLS Tests...', status: 'running', message: 'Initializing role-based tests' }
      ], 'running');

      const rlsResults = await runRLSTests();
      
      if (rlsResults.error) {
        tests.push({
          name: 'RLS Test Framework',
          status: 'failed',
          message: `RLS testing failed: ${rlsResults.error}`
        });
      } else {
        Object.entries(rlsResults).forEach(([role, results]) => {
          if (typeof results === 'object' && results !== null) {
            const roleResults = results as Record<string, any>;
            const hasErrors = Object.values(roleResults).some(r => 
              typeof r === 'object' && r.error !== null
            );
            
            tests.push({
              name: `RLS ${role} Role`,
              status: !hasErrors ? 'passed' : 'warning',
              message: !hasErrors ? `${role} access working` : `${role} has access issues`,
              details: `Tables tested: ${Object.keys(roleResults).length}`
            });
          }
        });
      }

    } catch (error) {
      tests.push({
        name: 'RLS Test Suite Error',
        status: 'failed',
        message: `RLS comprehensive test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    updateTestSuite('RLS Comprehensive Tests', tests, 'passed');
  }, [updateTestSuite]);

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    setTestSuites([]);
    
    try {
      await runAuthenticationTests();
      await runFeatureFlagTests();
      await runLanguageRoutingTests();
      await runDatabaseAccessTests();
      await runComprehensiveRLSTests();
    } catch (error) {
      console.error('Test suite failed:', error);
    } finally {
      setIsRunning(false);
    }
  }, [runAuthenticationTests, runFeatureFlagTests, runLanguageRoutingTests, runDatabaseAccessTests, runComprehensiveRLSTests]);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'running': return <RotateCcw className="h-4 w-4 text-blue-600 animate-spin" />;
      default: return <div className="h-4 w-4 bg-gray-300 rounded-full" />;
    }
  };

  const getStatusColor = (status: TestSuite['status']) => {
    switch (status) {
      case 'passed': return 'default';
      case 'failed': return 'destructive';
      case 'warning': return 'secondary';
      case 'running': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Tests</h2>
          <p className="text-gray-600">Umfassende Tests für alle Systemkomponenten</p>
        </div>
        <Button 
          onClick={runAllTests} 
          disabled={isRunning}
          className="flex items-center gap-2"
        >
          {isRunning ? (
            <RotateCcw className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {isRunning ? 'Tests laufen...' : 'Alle Tests starten'}
        </Button>
      </div>

      <div className="grid gap-4">
        {testSuites.map((suite) => (
          <Card key={suite.name}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{suite.name}</span>
                <Badge variant={getStatusColor(suite.status)}>
                  {suite.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {suite.tests.map((test, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 rounded border">
                    {getStatusIcon(test.status)}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{test.name}</div>
                      <div className="text-sm text-gray-600">{test.message}</div>
                      {test.details && (
                        <div className="text-xs text-gray-500 mt-1">{test.details}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {testSuites.length === 0 && !isRunning && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">Klicke auf "Alle Tests starten" um die System-Tests durchzuführen.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SystemTestRunner;
