
/**
 * @deprecated This file is kept for backward compatibility
 * Please import from src/services/deal/ instead
 */

import { 
  submitOffer, 
  acceptOffer, 
  getOffersForOrder, 
  getCompetingOfferCount,
} from './deal';

import type { SubmitOfferParams, Offer } from './deal';

// Re-export types and functions for backward compatibility
export type { SubmitOfferParams, Offer };
export { 
  submitOffer, 
  acceptOffer, 
  getOffersForOrder, 
  getCompetingOfferCount
};

// Export default object for compatibility
export default {
  submitOffer,
  acceptOffer,
  getOffersForOrder,
  getCompetingOfferCount
};
