
// Re-export all dispute service functionality
export * from './types';
export * from './createDispute';
export * from './resolveDispute';
export * from './forceMajeure';

// Export as a service object for backward compatibility
import { createDispute } from './createDispute';
import { resolveDispute } from './resolveDispute';
import { handleForceMajeure } from './forceMajeure';

export const disputeService = {
  createDispute,
  resolveDispute,
  handleForceMajeure
};
