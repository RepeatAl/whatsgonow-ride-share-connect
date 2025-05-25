
// Route constants for the application
export const ROUTES = {
  landing: '/',
  login: '/login',
  register: '/register',
  registerSuccess: '/register/success',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  faq: '/faq',
  support: '/support',
  mobileUpload: (sessionId: string) => `/mobile-upload/${sessionId}`,
  uploadComplete: '/upload-complete',
  delivery: (token: string) => `/delivery/${token}`,
  invoiceDownload: (token: string) => `/invoice-download/${token}`,
  preRegister: '/pre-register',
  preRegisterSuccess: '/pre-register/success',
  
  // Protected routes
  dashboard: '/dashboard',
  dashboardSender: '/dashboard/sender',
  dashboardDriver: '/dashboard/driver',
  dashboardCm: '/dashboard/cm',
  profile: '/profile',
  completeProfile: '/complete-profile',
  
  // Order related
  orders: '/orders',
  orderDrafts: '/orders/drafts',
  editOrderDraft: (draftId: string) => `/orders/drafts/${draftId}/edit`,
  myOrders: '/orders/mine',
  createOrder: '/create-order',
  deal: (orderId: string) => `/deal/${orderId}`,
  
  // Transport
  offerTransport: '/offer-transport',
  
  // Rides - NEW
  rides: '/rides',
  createRide: '/rides/create',
  editRide: (rideId: string) => `/rides/${rideId}/edit`,
  
  // Feedback
  feedback: '/feedback',
  
  // Admin routes
  admin: '/admin',
  adminDashboard: '/admin/dashboard',
  adminValidation: '/admin/validation',
  adminFeedback: '/admin/feedback',
  adminPreRegistrations: '/admin/pre-registrations',
  adminUsers: '/admin/users',
  trustManagement: '/trust-management',
  
  // Dev/Test
  adminInvoiceTest: '/admin/invoice-test',
  emailTest: '/email-test',
  rlsTest: '/rls-test',
  
  // Error pages
  notFound: '/404',
};

// Public routes that don't require authentication
export const publicRoutes = [
  ROUTES.landing,
  ROUTES.login,
  ROUTES.register,
  ROUTES.registerSuccess,
  ROUTES.forgotPassword,
  ROUTES.resetPassword,
  ROUTES.faq,
  ROUTES.support,
  '/mobile-upload',
  ROUTES.uploadComplete,
  '/delivery',
  '/invoice-download',
  ROUTES.preRegister,
  ROUTES.preRegisterSuccess,
  ROUTES.notFound,
];

// Function to check if a route is public
export const isPublicRoute = (path: string): boolean => {
  // Extract path without language prefix for matching
  const pathParts = path.split('/').filter(Boolean);
  const pathWithoutLang = pathParts.length > 1 ? `/${pathParts.slice(1).join('/')}` : '/';
  
  // Check exact matches first
  if (publicRoutes.includes(pathWithoutLang)) return true;
  
  // Check path patterns (like /delivery/:token)
  if (pathWithoutLang.startsWith('/delivery/')) return true;
  if (pathWithoutLang.startsWith('/invoice-download/')) return true;
  if (pathWithoutLang.startsWith('/mobile-upload/')) return true;
  
  return false;
};

export default ROUTES;
