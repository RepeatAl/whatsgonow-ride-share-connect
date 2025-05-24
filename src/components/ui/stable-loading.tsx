
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface StableLoadingProps {
  variant?: 'page' | 'form' | 'inline';
  message?: string;
  showSkeleton?: boolean;
}

export const StableLoading: React.FC<StableLoadingProps> = ({ 
  variant = 'page', 
  message,
  showSkeleton = true 
}) => {
  if (variant === 'inline') {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        {message && <span className="text-sm text-muted-foreground">{message}</span>}
      </div>
    );
  }

  if (variant === 'form') {
    return (
      <div className="space-y-6 max-w-xl mx-auto">
        {showSkeleton ? (
          <>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <div className="grid grid-cols-3 gap-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground">{message || 'Wird geladen...'}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-lg text-muted-foreground">{message || 'Anwendung wird geladen...'}</p>
    </div>
  );
};
