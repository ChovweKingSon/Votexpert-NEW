import { cn } from '@/lib/utils';
import { CandidateCard } from '@/components/molecules';
import { EmptyState, Skeleton } from '@/components/atoms';
import { Users } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  position: string;
  photoUrl?: string;
  bio?: string;
  manifesto?: string;
}

interface PositionGroup {
  position: string;
  candidates: Candidate[];
}

interface CandidateListProps {
  positions: PositionGroup[];
  isLoading?: boolean;
  selectedCandidates?: Record<string, string>; // position -> candidateId
  onSelectCandidate?: (position: string, candidateId: string) => void;
  selectionDisabled?: boolean;
  className?: string;
}

function CandidateListSkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-7 w-48" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CandidateList({
  positions,
  isLoading = false,
  selectedCandidates = {},
  onSelectCandidate,
  selectionDisabled = false,
  className,
}: CandidateListProps) {
  if (isLoading) {
    return <CandidateListSkeleton />;
  }

  if (positions.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No Candidates"
        description="No candidates have been registered for this election yet."
      />
    );
  }

  const totalCandidates = positions.reduce(
    (sum, group) => sum + group.candidates.length,
    0
  );

  if (totalCandidates === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No Candidates"
        description="No candidates have been registered for this election yet."
      />
    );
  }

  return (
    <div className={cn('space-y-8', className)}>
      {positions.map((group) => (
        <div key={group.position}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            {group.position}
            <span className="text-sm font-normal text-muted-foreground">
              ({group.candidates.length} candidate{group.candidates.length !== 1 ? 's' : ''})
            </span>
          </h3>

          {group.candidates.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No candidates for this position.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  name={candidate.name}
                  position={candidate.position}
                  photoUrl={candidate.photoUrl}
                  bio={candidate.bio}
                  manifesto={candidate.manifesto}
                  isSelected={selectedCandidates[group.position] === candidate.id}
                  onSelect={
                    onSelectCandidate
                      ? () => onSelectCandidate(group.position, candidate.id)
                      : undefined
                  }
                  disabled={selectionDisabled}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
