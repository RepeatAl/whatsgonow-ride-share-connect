
import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
}

export const LoadingSpinner = ({ 
  size = "md", 
  message = "Laden..." 
}: LoadingSpinnerProps) => {
  const spinnerSizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div 
        className={`${spinnerSizes[size]} border-4 border-primary border-t-transparent rounded-full animate-spin`}
        aria-label="Laden"
      />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};

export const LoadingScreen = ({ message = "Laden..." }: { message?: string }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <LoadingSpinner size="lg" message={message} />
    </div>
  );
};
