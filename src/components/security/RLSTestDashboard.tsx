
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { runCriticalRLSTests, emergencyRollback, type CriticalTestResult } from '@/utils/rls-testing/critical-fixes';

const RLSTestDashboard = () => {
  const [testResults, setTestResults] = useState<CriticalTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastTestRun, setLastTestRun] = useState<Date | null>(null);

  const runTests = async () => {
    setIsRunning(true);
    try {
      const results = await runCriticalRLSTests();
      setTestResults(results);
      setLastTestRun(new Date());
    } catch (error) {
      console.error('RLS Tests fehlgeschlagen:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleEmergencyRollback = async (table: string) => {
    if (confirm(`ACHTUNG: Emergency Rollback für ${table}? Dies sollte nur im Notfall verwendet werden!`)) {
      await emergencyRollback(table);
      // Nach Rollback Tests erneut ausführen
      setTimeout(runTests, 2000);
    }
  };

  const failedTests = testResults.filter(r => !r.passed);
  const passedTests = testResults.filter(r => r.passed);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            RLS Security Dashboard
          </h2>
          <p className="text-muted-foreground">
            Kritische Sicherheitstests nach RLS-Audit vom 31. Januar 2025
          </p>
        </div>
        
        <Button onClick={runTests} disabled={isRunning}>
          {isRunning ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Shield className="h-4 w-4 mr-2" />
          )}
          {isRunning ? 'Tests laufen...' : 'Kritische Tests starten'}
        </Button>
      </div>

      {/* Status Overview */}
      {testResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gesamt Tests</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{testResults.length}</div>
              <p className="text-xs text-muted-foreground">
                Letzter Test: {lastTestRun?.toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bestanden</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{passedTests.length}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((passedTests.length / testResults.length) * 100)}% sicher
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fehlgeschlagen</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{failedTests.length}</div>
              <p className="text-xs text-muted-foreground">
                Kritische Sicherheitslücken
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Critical Alerts */}
      {failedTests.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>KRITISCHE SICHERHEITSLÜCKEN ENTDECKT!</strong> 
            {' '}{failedTests.length} Test(s) fehlgeschlagen. 
            Sofortige Maßnahmen erforderlich.
          </AlertDescription>
        </Alert>
      )}

      {/* Test Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Test Ergebnisse</h3>
        
        {testResults.map((result, index) => (
          <Card key={index} className={`border-l-4 ${
            result.passed 
              ? 'border-l-green-500 bg-green-50' 
              : 'border-l-red-500 bg-red-50'
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">
                    {result.table.toUpperCase()}
                  </CardTitle>
                  <Badge variant={result.passed ? "default" : "destructive"}>
                    {result.passed ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {result.passed ? 'SICHER' : 'UNSICHER'}
                  </Badge>
                </div>
                
                {!result.passed && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleEmergencyRollback(result.table)}
                  >
                    🚨 Emergency Rollback
                  </Button>
                )}
              </div>
              <CardDescription>{result.test}</CardDescription>
            </CardHeader>
            
            <CardContent>
              {result.error && (
                <div className="bg-gray-100 p-3 rounded text-sm font-mono mb-2">
                  <strong>Error:</strong> {result.error}
                </div>
              )}
              
              {result.data && (
                <div className="bg-gray-100 p-3 rounded text-sm">
                  <strong>Data:</strong> {JSON.stringify(result.data, null, 2)}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Emergency Actions */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Notfall-Aktionen
          </CardTitle>
          <CardDescription className="text-red-700">
            Verwende diese Aktionen nur bei kritischen Sicherheitsproblemen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-red-600">
            <strong>Bei kritischen Fehlern:</strong>
          </p>
          <ul className="text-sm text-red-600 list-disc list-inside space-y-1">
            <li>Emergency Rollback für betroffene Tabelle ausführen</li>
            <li>Frontend-Module mit Mock-Services ersetzen</li>
            <li>Admin-Team sofort benachrichtigen</li>
            <li>Audit-Log für Compliance dokumentieren</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default RLSTestDashboard;
