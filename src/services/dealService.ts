
/**
 * @deprecated This file is kept for backward compatibility
 * Please import from src/services/deal/ instead
 */

import { 
  submitOffer, 
  acceptOffer, 
  getOffersForOrder, 
  getCompetingOfferCount,
  SubmitOfferParams,
  Offer
} from './deal';

// Re-export types and functions for backward compatibility
export { 
  SubmitOfferParams,
  Offer,
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
