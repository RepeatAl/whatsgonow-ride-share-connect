
import React, { memo } from 'react';
import { useStabilizedAuthContext } from '@/contexts/StabilizedAuthContext';
import { useOptimizedAuthRedirect } from '@/hooks/useOptimizedAuthRedirect';
import { Loader2 } from 'lucide-react';

interface StabilizedLayoutProps {
  children: React.ReactNode;
}

const StabilizedLayout = memo(({ children }: StabilizedLayoutProps) => {
  const { user, profile, isReady, isLoading } = useStabilizedAuthContext();
  
  // Use optimized auth redirect
  useOptimizedAuthRedirect(user, profile, isReady);

  // Show loading state until everything is ready
  if (!isReady || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Laden...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
});

StabilizedLayout.displayName = 'StabilizedLayout';

export default StabilizedLayout;
