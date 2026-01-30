import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge,
  ProgressBar,
  Skeleton,
} from '@/components/atoms';
import { getInitials } from '@/lib/utils';
import { Trophy, Medal } from 'lucide-react';

interface CandidateResult {
  id: string;
  name: string;
  photoUrl?: string;
  votes: number;
  percentage: number;
  rank: number;
}

interface PositionResultsCardProps {
  position: string;
  totalVotes: number;
  candidates: CandidateResult[];
  winnerId?: string;
  isLoading?: boolean;
  className?: string;
}

function ResultsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-full" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  );
}

export function PositionResultsCard({
  position,
  totalVotes,
  candidates,
  winnerId,
  isLoading = false,
  className,
}: PositionResultsCardProps) {
  // Sort candidates by rank
  const sortedCandidates = [...candidates].sort((a, b) => a.rank - b.rank);
  const winner = sortedCandidates.find((c) => c.id === winnerId) || sortedCandidates[0];

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <Trophy className="h-3 w-3" />
          Winner
        </Badge>
      );
    }
    if (rank === 2) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Medal className="h-3 w-3" />
          2nd
        </Badge>
      );
    }
    if (rank === 3) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Medal className="h-3 w-3" />
          3rd
        </Badge>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{position}</CardTitle>
            <CardDescription>
              {totalVotes} total vote{totalVotes !== 1 ? 's' : ''} cast
            </CardDescription>
          </div>
          {winner && !isLoading && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Winner</p>
              <p className="font-semibold text-foreground">{winner.name}</p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ResultsSkeleton />
        ) : (
          <div className="space-y-4">
            {sortedCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className={cn(
                  'flex items-center gap-4 p-3 rounded-lg transition-colors',
                  candidate.id === winnerId && 'bg-primary/5 border border-primary/20'
                )}
              >
                {/* Avatar */}
                <Avatar className="h-12 w-12">
                  {candidate.photoUrl && (
                    <AvatarImage src={candidate.photoUrl} alt={candidate.name} />
                  )}
                  <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
                </Avatar>

                {/* Info and progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground truncate">
                      {candidate.name}
                    </p>
                    {getRankBadge(candidate.rank)}
                  </div>
                  <ProgressBar
                    value={candidate.percentage}
                    variant={candidate.id === winnerId ? 'success' : 'default'}
                    size="sm"
                  />
                </div>

                {/* Votes */}
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">
                    {candidate.percentage.toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {candidate.votes} vote{candidate.votes !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
