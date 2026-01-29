// Re-export all services from a single entry point

// Admin services
export {
  adminLogin,
  adminVerifyOtp,
  createElection,
  getElectionDetails,
  getElectionStatistics,
  updateElectionStatus,
} from './admin.service';

// Voter services
export {
  voterLoginInitiate,
  voterVerifyEmail,
  voterVerifyOtp,
  voterVerifyFace,
  getVoterProfile,
  getElectionInfo,
  getElectionCandidates,
  castVote,
} from './voter.service';

// Election services (public)
export { getElectionResults } from './election.service';
