import { atom, map, computed } from 'nanostores';

// Vote receipt type
export interface VoteReceiptData {
  vote_id: string;
  timestamp: string;
  positions_voted: number;
  electionName: string;
}

// Vote receipt state
export const $voteReceipt = atom<VoteReceiptData | null>(null);

export function setVoteReceipt(receipt: VoteReceiptData) {
  $voteReceipt.set(receipt);
}

export function clearVoteReceipt() {
  $voteReceipt.set(null);
}

// Current election context
export const $currentElectionId = atom<string | null>(null);
export const $currentElectionName = atom<string>('');

// Selected candidates during voting (position -> candidateId)
export const $selectedCandidates = map<Record<string, string>>({});

// Voting flow state
export const $currentPositionIndex = atom<number>(0);
export const $totalPositions = atom<number>(0);
export const $isReviewingVote = atom<boolean>(false);

// Computed values
export const $hasSelectedCandidate = computed(
  [$selectedCandidates, $currentPositionIndex],
  (candidates, index) => {
    const positions = Object.keys(candidates);
    return positions.length > index;
  }
);

export const $votingProgress = computed(
  [$selectedCandidates, $totalPositions],
  (candidates, total) => {
    if (total === 0) return 0;
    return Math.round((Object.keys(candidates).length / total) * 100);
  }
);

export const $canSubmitVote = computed(
  [$selectedCandidates, $totalPositions],
  (candidates, total) => {
    return Object.keys(candidates).length === total && total > 0;
  }
);

// Actions
export function setCurrentElection(id: string, name: string) {
  $currentElectionId.set(id);
  $currentElectionName.set(name);
  // Reset voting state when changing election
  resetVotingState();
}

export function selectCandidate(position: string, candidateId: string) {
  $selectedCandidates.setKey(position, candidateId);
}

export function deselectCandidate(position: string) {
  const current = $selectedCandidates.get();
  const { [position]: _, ...rest } = current;
  $selectedCandidates.set(rest);
}

export function setPositionIndex(index: number) {
  $currentPositionIndex.set(index);
}

export function nextPosition() {
  const current = $currentPositionIndex.get();
  const total = $totalPositions.get();
  if (current < total - 1) {
    $currentPositionIndex.set(current + 1);
  }
}

export function previousPosition() {
  const current = $currentPositionIndex.get();
  if (current > 0) {
    $currentPositionIndex.set(current - 1);
  }
}

export function setTotalPositions(total: number) {
  $totalPositions.set(total);
}

export function setReviewingVote(reviewing: boolean) {
  $isReviewingVote.set(reviewing);
}

export function resetVotingState() {
  $selectedCandidates.set({});
  $currentPositionIndex.set(0);
  $isReviewingVote.set(false);
}

export function clearElectionContext() {
  $currentElectionId.set(null);
  $currentElectionName.set('');
  resetVotingState();
  $totalPositions.set(0);
}

// Get all selected candidates as vote payload
export function getVotePayload(): Record<string, string> {
  return { ...$selectedCandidates.get() };
}
