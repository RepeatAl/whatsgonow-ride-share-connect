
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mb-6" />
          <h2 className="text-2xl font-bold mb-2">Etwas ist schiefgelaufen</h2>
          <p className="text-muted-foreground mb-6">
            Es tut uns leid, aber es ist ein Fehler aufgetreten. Bitte versuche es erneut.
          </p>
          <div className="space-x-4">
            <Button onClick={this.handleRetry} variant="outline">
              Erneut versuchen
            </Button>
            <Button onClick={() => window.location.reload()}>
              Seite neu laden
            </Button>
          </div>
          {this.state.error && (
            <p className="text-xs text-muted-foreground mt-8 max-w-md overflow-hidden text-ellipsis">
              Fehlerdetails: {this.state.error.toString()}
            </p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
