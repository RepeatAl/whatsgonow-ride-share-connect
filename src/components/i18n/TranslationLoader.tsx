
import React, { Suspense, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';

interface TranslationLoaderProps {
  children: ReactNode;
  namespaces?: string[];
  fallback?: ReactNode;
}

/**
 * TranslationLoader ensures translations are loaded before rendering children
 * It handles loading states and namespaces in a consistent way across the application
 */
export const TranslationLoader: React.FC<TranslationLoaderProps> = ({
  children,
  namespaces = ['common'],
  fallback,
}) => {
  const TranslationContent = () => {
    const { t, ready, i18n } = useTranslation(namespaces);
    
    if (!ready) {
      console.log(`[i18n] Waiting for namespaces to load: ${namespaces.join(', ')}`);
      return (
        <div className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      );
    }
    
    // Check if all required namespaces are loaded
    const allNamespacesLoaded = namespaces.every(ns => 
      i18n.hasResourceBundle(i18n.language, ns)
    );
    
    if (!allNamespacesLoaded) {
      console.warn(`[i18n] Some namespaces not fully loaded: ${namespaces.join(', ')}`);
      // Continue anyway but log warning
    }

    return <>{children}</>;
  };

  return (
    <Suspense fallback={fallback || (
      <div className="p-4">
        <div className="space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    )}>
      <TranslationContent />
    </Suspense>
  );
};

export default TranslationLoader;
