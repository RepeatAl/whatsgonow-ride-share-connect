
/**
 * @deprecated This file is kept for backward compatibility
 * Please import from src/services/dispute/ subdirectories directly
 */

import { createDispute } from './dispute/createDispute';
import { resolveDispute } from './dispute/resolveDispute';
import { handleForceMajeure } from './dispute/forceMajeure';
import { DisputeReason, DisputeStatus } from './dispute/types';

// Re-export types and functions for backward compatibility
export { 
  DisputeReason,
  DisputeStatus,
  createDispute, 
  resolveDispute, 
  handleForceMajeure 
};

// Export default object for compatibility
export default {
  createDispute,
  resolveDispute,
  handleForceMajeure
};
