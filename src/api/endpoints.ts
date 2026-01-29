// API Endpoints - Single source of truth for all API routes

export const ENDPOINTS = {
  // Admin Authentication
  ADMIN_LOGIN: '/admin/login',
  ADMIN_VERIFY_OTP: '/admin/verify-otp',

  // Admin Elections
  ADMIN_ELECTIONS: '/admin/elections',
  ADMIN_ELECTION_DETAILS: (id: string) => `/admin/elections/${id}`,
  ADMIN_ELECTION_STATISTICS: (id: string) => `/admin/elections/${id}/statistics`,
  ADMIN_ELECTION_STATUS: (id: string) => `/admin/elections/${id}/status`,

  // Voter Authentication
  VOTER_LOGIN_INITIATE: '/voter/login/initiate',
  VOTER_VERIFY_EMAIL: (token: string) => `/voter/verify/${token}`,
  VOTER_VERIFY_OTP: '/voter/verify/otp',
  VOTER_VERIFY_FACE: '/voter/verify/face',

  // Voter Profile & Elections
  VOTER_PROFILE: '/voter/profile',
  VOTER_ELECTION_INFO: (id: string) => `/voter/elections/${id}`,
  VOTER_ELECTION_CANDIDATES: (id: string) => `/voter/elections/${id}/candidates`,
  VOTER_CAST_VOTE: (id: string) => `/voter/elections/${id}/vote`,

  // Public
  ELECTION_RESULTS: (id: string) => `/elections/${id}/results`,
} as const;
