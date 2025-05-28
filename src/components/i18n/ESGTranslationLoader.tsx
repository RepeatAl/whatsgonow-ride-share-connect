
import React, { Suspense, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { loadNamespace } from '@/i18n/i18n';

interface ESGTranslationLoaderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ESGTranslationLoader ensures the 'landing' namespace is loaded before rendering ESG components
 * This prevents translation keys from being displayed instead of actual values
 */
export const ESGTranslationLoader: React.FC<ESGTranslationLoaderProps> = ({
  children,
  fallback,
}) => {
  const { ready, i18n } = useTranslation('landing');

  useEffect(() => {
    // Ensure landing namespace is loaded on mount
    const ensureNamespace = async () => {
      if (!i18n.hasResourceBundle(i18n.language, 'landing')) {
        console.debug('[ESG-i18n] Loading landing namespace for:', i18n.language);
        await loadNamespace('landing', i18n.language);
      }
    };

    ensureNamespace();
  }, [i18n.language, i18n]);

  const ESGContent = () => {
    if (!ready) {
      console.debug('[ESG-i18n] Waiting for landing namespace to load...');
      return (
        <div className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-8 w-2/3" />
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    // Check if landing namespace is fully loaded
    const hasLandingNamespace = i18n.hasResourceBundle(i18n.language, 'landing');
    
    if (!hasLandingNamespace) {
      console.warn('[ESG-i18n] Landing namespace not fully loaded for:', i18n.language);
    }

    return <>{children}</>;
  };

  return (
    <Suspense fallback={fallback || (
      <div className="p-4">
        <div className="space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )}>
      <ESGContent />
    </Suspense>
  );
};

export default ESGTranslationLoader;
