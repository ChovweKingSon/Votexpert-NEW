import * as React from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { rootRoute } from '../__root';
import { VoterLayout } from '@/components/templates';
import { ResultsSummary } from '@/components/organisms';
import { AlertMessage } from '@/components/molecules';
import { Button } from '@/components/atoms';
import { getElectionResults } from '@/api/services/election.service';
import { $user, $isAuthenticated, logout } from '@/stores/auth.store';
import { useStore } from '@nanostores/react';
import { ArrowLeft } from 'lucide-react';
import type { Voter } from '@/types';

export const voterResultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/voter/results/$electionId',
  component: ResultsPage,
});

function ResultsPage() {
  const navigate = useNavigate();
  const { electionId } = voterResultsRoute.useParams();
  const user = useStore($user) as Voter | null;
  const isAuthenticated = useStore($isAuthenticated);

  // Fetch election results
  const { data, isLoading, error } = useQuery({
    queryKey: ['election', electionId, 'results'],
    queryFn: () => getElectionResults(electionId),
  });

  const handleLogout = () => {
    logout();
    navigate({ to: '/voter/login' });
  };

  const handleBack = () => {
    if (isAuthenticated) {
      navigate({ to: '/voter/elections' });
    } else {
      navigate({ to: '/' });
    }
  };

  // Transform results data
  const positions = React.useMemo(() => {
    if (!data?.results) return [];
    return data.results.map((result) => ({
      position: result.position,
      totalVotes: result.total_votes,
      candidates: result.candidates.map((c) => ({
        id: c.candidate_id,
        name: c.name,
        photoUrl: c.photo_url,
        votes: c.votes,
        percentage: c.percentage,
        rank: c.rank,
      })),
      winnerId: result.winner.candidate_id,
    }));
  }, [data]);

  return (
    <VoterLayout
      voterName={user?.name}
      voterEmail={user?.email}
      onLogout={isAuthenticated ? handleLogout : undefined}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back button */}
        <Button variant="ghost" onClick={handleBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {isAuthenticated ? 'Back to Elections' : 'Back to Home'}
        </Button>

        {error && (
          <AlertMessage variant="error">
            Failed to load election results. Please try again later.
          </AlertMessage>
        )}

        <ResultsSummary
          electionName={data?.election?.election_name || 'Election'}
          electionStatus={data?.election?.status || 'concluded'}
          totalRegisteredVoters={data?.election?.total_registered_voters || 0}
          totalVotesCast={data?.election?.total_votes_cast || 0}
          voterTurnoutPercentage={data?.election?.voter_turnout_percentage || 0}
          positions={positions}
          generatedAt={data?.generated_at}
          resultsAvailable={data?.results_available ?? false}
          isLoading={isLoading}
        />
      </div>
    </VoterLayout>
  );
}
