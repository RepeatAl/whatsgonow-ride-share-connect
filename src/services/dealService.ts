
/**
 * @deprecated This file is kept for backward compatibility
 * Please import from src/services/deal/ subdirectories directly
 */

import { submitOffer } from './deal/submitOffer';
import { acceptOffer } from './deal/acceptOffer';
import { getOffersForOrder, getCompetingOfferCount } from './deal/getOffers';

import type { SubmitOfferParams, Offer } from './deal/types';

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
