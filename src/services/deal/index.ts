
// Re-export all deal service functionality
export * from './types';
export * from './submitOffer';
export * from './acceptOffer';
export * from './getOffers';

// Export as a service object for backward compatibility
import { submitOffer } from './submitOffer';
import { acceptOffer } from './acceptOffer';
import { getOffersForOrder, getCompetingOfferCount } from './getOffers';

export const dealService = {
  submitOffer,
  acceptOffer,
  getOffersForOrder,
  getCompetingOfferCount
};
