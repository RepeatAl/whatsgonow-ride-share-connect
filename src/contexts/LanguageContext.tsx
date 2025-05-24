
// This file is maintained for backward compatibility
// New code should import from src/contexts/language/OptimizedLanguageProvider.tsx

import { useOptimizedLanguage } from './language/OptimizedLanguageProvider';

// Re-export the optimized hook for backward compatibility
export const useLanguage = useOptimizedLanguage;

// For any remaining legacy imports, use the optimized provider
export { OptimizedLanguageProvider as LanguageProvider } from './language/OptimizedLanguageProvider';

// Re-export the context type for backward compatibility
export type { LanguageContextType } from './language/types';

export default { LanguageProvider: OptimizedLanguageProvider, useLanguage };

// Import statement fix to avoid circular dependency
import { OptimizedLanguageProvider } from './language/OptimizedLanguageProvider';
