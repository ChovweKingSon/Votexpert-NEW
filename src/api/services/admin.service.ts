import { apiClient, publicApiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type {
  AdminLoginResponse,
  AdminVerifyOtpResponse,
  CreateElectionPayload,
  CreateElectionResponse,
  ElectionDetails,
  Statistics,
  UpdateElectionStatusPayload,
  UpdateElectionStatusResponse,
} from '@/types';
import type { AdminLoginCredentials, AdminOtpPayload } from '@/types';

// Admin Authentication
export async function adminLogin(
  credentials: AdminLoginCredentials
): Promise<AdminLoginResponse> {
  const response = await publicApiClient.post<AdminLoginResponse>(
    ENDPOINTS.ADMIN_LOGIN,
    credentials
  );
  return response.data;
}

export async function adminVerifyOtp(
  payload: AdminOtpPayload
): Promise<AdminVerifyOtpResponse> {
  const response = await publicApiClient.post<AdminVerifyOtpResponse>(
    ENDPOINTS.ADMIN_VERIFY_OTP,
    payload
  );
  return response.data;
}

// Elections Management
export async function createElection(
  payload: CreateElectionPayload
): Promise<CreateElectionResponse> {
  const response = await apiClient.post<CreateElectionResponse>(
    ENDPOINTS.ADMIN_ELECTIONS,
    payload
  );
  return response.data;
}

export async function getElectionDetails(
  electionId: string
): Promise<{ success: boolean; election: ElectionDetails }> {
  const response = await apiClient.get<{ success: boolean; election: ElectionDetails }>(
    ENDPOINTS.ADMIN_ELECTION_DETAILS(electionId)
  );
  return response.data;
}

export async function getElectionStatistics(
  electionId: string
): Promise<{ success: boolean; statistics: Statistics }> {
  const response = await apiClient.get<{ success: boolean; statistics: Statistics }>(
    ENDPOINTS.ADMIN_ELECTION_STATISTICS(electionId)
  );
  return response.data;
}

export async function updateElectionStatus(
  electionId: string,
  payload: UpdateElectionStatusPayload
): Promise<UpdateElectionStatusResponse> {
  const response = await apiClient.patch<UpdateElectionStatusResponse>(
    ENDPOINTS.ADMIN_ELECTION_STATUS(electionId),
    payload
  );
  return response.data;
}
