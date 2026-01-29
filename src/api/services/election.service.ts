import { publicApiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type { ElectionResultsResponse } from '@/types';

// Public election endpoints (no auth required)

export async function getElectionResults(
  electionId: string
): Promise<ElectionResultsResponse> {
  const response = await publicApiClient.get<ElectionResultsResponse>(
    ENDPOINTS.ELECTION_RESULTS(electionId)
  );
  return response.data;
}
