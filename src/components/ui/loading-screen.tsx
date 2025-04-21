
import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
  variant?: "default" | "fullscreen" | "inline";
}

export const LoadingScreen = ({ 
  message = "Lädt...", 
  variant = "default" 
}: LoadingScreenProps) => {
  
  if (variant === "inline") {
    return (
      <div className="flex items-center space-x-2 text-primary">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{message}</span>
      </div>
    );
  }

  const containerClass = variant === "fullscreen" 
    ? "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" 
    : "flex flex-col items-center justify-center min-h-[300px] p-6";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-center text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};
