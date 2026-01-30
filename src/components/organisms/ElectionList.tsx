import { cn } from '@/lib/utils';
import { ElectionCard } from '@/components/molecules';
import { EmptyState, Skeleton } from '@/components/atoms';
import { Vote } from 'lucide-react';
import type { ElectionStatus } from '@/types';

interface Election {
  id: string;
  name: string;
  description?: string;
  status: ElectionStatus;
  startTime: string;
  endTime: string;
  totalVoters?: number;
  votesCast?: number;
}

interface ElectionListProps {
  elections: Election[];
  isLoading?: boolean;
  emptyMessage?: string;
  onElectionClick?: (electionId: string) => void;
  getActionLabel?: (election: Election) => string;
  className?: string;
}

function ElectionListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-5 border rounded-lg space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}

export function ElectionList({
  elections,
  isLoading = false,
  emptyMessage = 'No elections found',
  onElectionClick,
  getActionLabel,
  className,
}: ElectionListProps) {
  if (isLoading) {
    return <ElectionListSkeleton />;
  }

  if (elections.length === 0) {
    return (
      <EmptyState
        icon={Vote}
        title="No Elections"
        description={emptyMessage}
      />
    );
  }

  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}>
      {elections.map((election) => (
        <ElectionCard
          key={election.id}
          id={election.id}
          name={election.name}
          description={election.description}
          status={election.status}
          startTime={election.startTime}
          endTime={election.endTime}
          totalVoters={election.totalVoters}
          votesCast={election.votesCast}
          onAction={onElectionClick ? () => onElectionClick(election.id) : undefined}
          actionLabel={getActionLabel ? getActionLabel(election) : undefined}
        />
      ))}
    </div>
  );
}
