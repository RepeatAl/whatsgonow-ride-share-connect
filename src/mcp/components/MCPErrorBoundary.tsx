
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary specifically for MCP Components
 * Provides graceful fallback when language operations fail
 */
export class MCPErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('[MCP-ERROR-BOUNDARY] Caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[MCP-ERROR-BOUNDARY] Component caught error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Alert variant="destructive" className="max-w-md mx-auto my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Language System Error</AlertTitle>
          <AlertDescription className="mt-2">
            <div className="space-y-2">
              <p>The language system encountered an error. Please try refreshing the page.</p>
              {this.state.error && (
                <details className="text-xs">
                  <summary>Error Details</summary>
                  <pre className="mt-1 whitespace-pre-wrap">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
              <Button 
                onClick={this.handleReset} 
                size="sm" 
                variant="outline"
                className="mt-2"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default MCPErrorBoundary;
