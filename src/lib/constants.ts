// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://1j0xg3xwse.execute-api.eu-north-1.amazonaws.com/prod';

// App Configuration
export const APP_NAME = 'VoteXpert';
export const APP_TAGLINE = 'Empowering Transparent Decisions.';

// Authentication
export const OTP_LENGTH = 6;
export const OTP_EXPIRY_SECONDS = 300; // 5 minutes
export const TOKEN_STORAGE_KEY = 'votexpert_tokens';
export const USER_STORAGE_KEY = 'votexpert_user';

// Election Status Labels
export const ELECTION_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  active: 'Active',
  ongoing: 'Ongoing',
  concluded: 'Concluded',
  cancelled: 'Cancelled',
  results_announced: 'Results Announced',
};

// Election Status Colors (Tailwind classes)
export const ELECTION_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-500',
  active: 'bg-blue-500',
  ongoing: 'bg-green-500',
  concluded: 'bg-purple-500',
  cancelled: 'bg-red-500',
  results_announced: 'bg-emerald-500',
};

// Routes
export const ROUTES = {
  // Public
  HOME: '/',

  // Voter
  VOTER_LOGIN: '/voter/login',
  VOTER_VERIFY_EMAIL: '/voter/verify-email',
  VOTER_OTP: '/voter/otp',
  VOTER_FACE_VERIFICATION: '/voter/face-verification',
  VOTER_ELECTIONS: '/voter/elections',
  VOTER_VOTE: '/voter/elections/:electionId/vote',
  VOTER_SUCCESS: '/voter/elections/:electionId/success',
  VOTER_RESULTS: '/voter/results/:electionId',

  // Admin
  ADMIN_LOGIN: '/admin/login',
  ADMIN_OTP: '/admin/otp',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_ELECTIONS: '/admin/elections',
  ADMIN_CREATE_ELECTION: '/admin/elections/create',
  ADMIN_ELECTION_DETAILS: '/admin/elections/:electionId',
  ADMIN_ELECTION_STATISTICS: '/admin/elections/:electionId/statistics',
} as const;

// Face Verification
export const FACE_SIMILARITY_THRESHOLD = 80; // Minimum similarity percentage

// Pagination
export const DEFAULT_PAGE_SIZE = 10;

// Date Formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATETIME_FORMAT = 'MMM dd, yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';
