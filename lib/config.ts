// Backend configuration - production URL priority
// Force production URL and ignore environment variables
export const BACKEND_URL = 'https://vehicle-rental-backend-deployment.onrender.com'

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  login: `${BACKEND_URL}/login`,
  signup: `${BACKEND_URL}/signup`,
  verifyToken: `${BACKEND_URL}/verify-token`,
  logout: `${BACKEND_URL}/logout`,
  verifyEmail: `${BACKEND_URL}/user/verifyEmail`,

  // User Profile & Management
  userByUsername: `${BACKEND_URL}/user`,
  profileByUsername: (username: string) => `${BACKEND_URL}/profile/${username}`,
  profileEnhanced: (username: string) => `${BACKEND_URL}/profile/${username}/enhanced`,
  profileUpdate: `${BACKEND_URL}/profile`,
  
  // Profile Image Management (updated to match your specs)
  profileUploadImage: `${BACKEND_URL}/profile/upload-image`,
  profileEditImage: `${BACKEND_URL}/profile/edit-image`,
  profileEdit: `${BACKEND_URL}/profile`,
  profileDeleteImage: `${BACKEND_URL}/profile/delete-image`,

  // Fleet Management
  fleet: `${BACKEND_URL}/fleet`,
  fleetAvailable: `${BACKEND_URL}/fleet/available`,
  fleetAvailableByPage: `${BACKEND_URL}/fleet/available`,
  fleetByCategory: `${BACKEND_URL}/fleet/category`,
  vehicleById: `${BACKEND_URL}/vehicle`,

  // Vehicle Rental (updated to match your specs)
  rent: `${BACKEND_URL}/rent`,
  rentalsUser: `${BACKEND_URL}/rentals/user`,
  rentalsActive: `${BACKEND_URL}/rentals/active`,
  
  // Vehicle Return (updated to match your specs)
  returnVehicle: `${BACKEND_URL}/rentals/return`,
  
  // Return Affordability Check (updated to match your specs)
  checkReturnAffordability: (rentalId: number) => `${BACKEND_URL}/rentals/${rentalId}/check-return`,
  
  // Late Fee Calculation (updated to match your specs)
  calculateLateFees: `${BACKEND_URL}/rentals/calculate-late-fees`,
  
  // Rental Status Update (updated to match your specs)
  updateRentalStatus: (rentalId: number) => `${BACKEND_URL}/rentals/${rentalId}/status`,
  
  // Rental Details (updated to match your specs)
  getRentalDetails: (rentalId: number) => `${BACKEND_URL}/rentals/${rentalId}/details`,

  // Balance Management (updated to match your specs)
  balance: `${BACKEND_URL}/balance`,
  balanceAdd: `${BACKEND_URL}/balance/add`,
  balanceDebit: `${BACKEND_URL}/balance/debit`,

  // Late Fee Management (updated to match your specs)
  lateFeesUser: `${BACKEND_URL}/late-fees/user`,
  lateFeesPay: `${BACKEND_URL}/late-fees/pay`,
}

// Helper function to get current backend URL
export const getCurrentBackendUrl = () => BACKEND_URL

// Helper function to check if running in development mode
export const isDevMode = () => false // Always false as production URL is forced

// Production configuration - no logging 