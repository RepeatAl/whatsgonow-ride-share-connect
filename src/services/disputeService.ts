
/**
 * @deprecated This file is kept for backward compatibility
 * Please import from src/services/dispute/ instead
 */

import { 
  createDispute, 
  resolveDispute, 
  handleForceMajeure,
  DisputeReason,
  DisputeStatus
} from './dispute';

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
