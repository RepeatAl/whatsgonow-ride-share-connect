
import React, { Component, ReactNode } from 'react';

interface MCPErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface MCPErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class MCPErrorBoundary extends Component<MCPErrorBoundaryProps, MCPErrorBoundaryState> {
  constructor(props: MCPErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): MCPErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('[MCP-ERROR-BOUNDARY] Caught error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-200 bg-red-50 rounded-md">
          <h3 className="text-red-800 font-medium">MCP Component Error</h3>
          <p className="text-red-600 text-sm mt-1">
            Something went wrong in the MCP system. Please refresh the page.
          </p>
          {this.state.error && (
            <details className="mt-2">
              <summary className="text-red-700 text-xs cursor-pointer">Error Details</summary>
              <pre className="text-xs text-red-600 mt-1 overflow-auto">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default MCPErrorBoundary;
