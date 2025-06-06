
/**
 * Available CDN URLs for the HERE Maps JavaScript SDK
 * Used for fallback scenarios if the primary CDN URL fails
 */
export const HERE_CDN_URLS = [
  'https://js.api.here.com/v3/3.1/mapsjs-bundle.js',
  'https://cdn.here.com/v3/3.1/mapsjs-bundle.js'
];

/**
 * CSP requirements for HERE Maps integration
 * This is for documentation purposes - the actual CSP is set in vercel.json
 */
export const HERE_MAPS_CSP_REQUIREMENTS = {
  scriptSrc: ["'self'", "https://js.api.here.com", "https://*.here.com", "'unsafe-inline'", "'unsafe-eval'"],
  connectSrc: ["'self'", "https://*.here.com", "https://*.hereapi.com"],
  styleSrc: ["'self'", "'unsafe-inline'", "https://js.api.here.com"],
  imgSrc: ["*", "data:", "blob:"],
  fontSrc: ["'self'", "data:"]
};
