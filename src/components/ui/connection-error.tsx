
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./button";

interface ConnectionErrorProps {
  message?: string;
  onRetry?: () => void;
}

export const ConnectionError = ({ 
  message = "Es gab ein Problem mit der Verbindung zum Server.", 
  onRetry 
}: ConnectionErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 my-8 text-center bg-red-50 rounded-lg border border-red-200">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <h2 className="text-xl font-medium text-red-800 mb-2">Verbindungsproblem</h2>
      <p className="text-red-600 mb-4 max-w-md">{message}</p>
      <Button 
        variant="outline" 
        onClick={onRetry || (() => window.location.reload())}
        className="border-red-300 hover:bg-red-100 text-red-800"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Erneut versuchen
      </Button>
    </div>
  );
};
