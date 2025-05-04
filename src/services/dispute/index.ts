
/**
 * @deprecated Please import directly from specific files:
 * - import { createDispute } from '@/services/dispute/createDispute';
 * - import { resolveDispute } from '@/services/dispute/resolveDispute';
 * - import { handleForceMajeure } from '@/services/dispute/forceMajeure';
 * - import type { DisputeReason, DisputeStatus } from '@/services/dispute/types';
 */

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
