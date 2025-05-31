
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Database, Settings, Trash2 } from 'lucide-react';
import AnalyticsErrorLogger from '@/utils/analytics-error-logger';

const AnalyticsValidationMonitor = () => {
  const [errorCounts, setErrorCounts] = useState({
    validation: 0,
    database: 0,
    system: 0,
    total: 0,
  });
  const [recentErrors, setRecentErrors] = useState<any[]>([]);
  const [selectedErrorType, setSelectedErrorType] = useState<'all' | 'validation' | 'database' | 'system'>('all');

  const refreshData = () => {
    setErrorCounts(AnalyticsErrorLogger.getErrorCount());
    setRecentErrors(AnalyticsErrorLogger.getRecentErrors(20));
  };

  useEffect(() => {
    refreshData();
    
    // Refresh every 30 seconds
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  const clearErrors = () => {
    AnalyticsErrorLogger.clearErrors();
    refreshData();
  };

  const getFilteredErrors = () => {
    if (selectedErrorType === 'all') {
      return recentErrors;
    }
    return recentErrors.filter(error => error.errorType === selectedErrorType);
  };

  const getErrorIcon = (errorType: string) => {
    switch (errorType) {
      case 'validation':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'database':
        return <Database className="h-4 w-4 text-red-500" />;
      case 'system':
        return <Settings className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getErrorBadgeColor = (errorType: string) => {
    switch (errorType) {
      case 'validation':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'database':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'system':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Validation Errors</p>
                <p className="text-2xl font-bold text-yellow-600">{errorCounts.validation}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Database Errors</p>
                <p className="text-2xl font-bold text-red-600">{errorCounts.database}</p>
              </div>
              <Database className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Errors</p>
                <p className="text-2xl font-bold text-blue-600">{errorCounts.system}</p>
              </div>
              <Settings className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Errors</p>
                <p className="text-2xl font-bold text-gray-900">{errorCounts.total}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Analytics Errors</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
              >
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearErrors}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex gap-2">
            {['all', 'validation', 'database', 'system'].map((type) => (
              <Button
                key={type}
                variant={selectedErrorType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedErrorType(type as any)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {getFilteredErrors().length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No errors found for the selected filter.
              </p>
            ) : (
              getFilteredErrors().map((error, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getErrorIcon(error.errorType)}
                      <Badge className={getErrorBadgeColor(error.errorType)}>
                        {error.errorType}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(error.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Session: {error.sessionId.slice(-8)}
                    </Badge>
                  </div>
                  
                  {error.validationErrors && (
                    <div className="text-sm">
                      <strong>Validation Errors:</strong>
                      <ul className="list-disc list-inside ml-4 mt-1">
                        {error.validationErrors.map((validationError: string, idx: number) => (
                          <li key={idx} className="text-red-600">{validationError}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {error.databaseError && (
                    <div className="text-sm">
                      <strong>Database Error:</strong>
                      <p className="text-red-600 ml-4">{error.databaseError}</p>
                    </div>
                  )}
                  
                  {error.systemError && (
                    <div className="text-sm">
                      <strong>System Error:</strong>
                      <p className="text-blue-600 ml-4">{error.systemError}</p>
                    </div>
                  )}
                  
                  {error.originalEvent && (
                    <details className="text-sm">
                      <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                        Original Event Data
                      </summary>
                      <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
                        {JSON.stringify(error.originalEvent, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsValidationMonitor;
