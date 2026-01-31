import * as React from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { rootRoute } from '../../../__root';
import { VoterLayout } from '@/components/templates';
import { ElectionDetailsCard, CandidateList } from '@/components/organisms';
import { AlertMessage } from '@/components/molecules';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/atoms';
import { getElectionInfo, getElectionCandidates, getVoterProfile } from '@/api/services/voter.service';
import { $user, $isAuthenticated, logout } from '@/stores/auth.store';
import { useStore } from '@nanostores/react';
import { Vote, BarChart3, ArrowLeft } from 'lucide-react';
import type { Voter, ElectionStatus } from '@/types';

export const voterElectionDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/voter/elections/$electionId',
  component: ElectionDetailsPage,
});

function ElectionDetailsPage() {
  const navigate = useNavigate();
  const { electionId } = voterElectionDetailsRoute.useParams();
  const user = useStore($user) as Voter | null;
  const isAuthenticated = useStore($isAuthenticated);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/voter/login' });
    }
  }, [isAuthenticated, navigate]);

  // Fetch election info
  const { data: electionData, error: electionError } = useQuery({
    queryKey: ['election', electionId],
    queryFn: () => getElectionInfo(electionId),
    enabled: isAuthenticated && !!electionId,
  });

  // Fetch candidates
  const { data: candidatesData, isLoading: candidatesLoading } = useQuery({
    queryKey: ['election', electionId, 'candidates'],
    queryFn: () => getElectionCandidates(electionId),
    enabled: isAuthenticated && !!electionId,
  });

  // Fetch voter profile for voting status
  const { data: profileData } = useQuery({
    queryKey: ['voter', 'profile'],
    queryFn: getVoterProfile,
    enabled: isAuthenticated,
  });

  const handleLogout = () => {
    logout();
    navigate({ to: '/voter/login' });
  };

  const handleStartVoting = () => {
    navigate({ to: '/voter/elections/$electionId/vote', params: { electionId } });
  };

  const handleViewResults = () => {
    navigate({ to: '/voter/results/$electionId', params: { electionId } });
  };

  const handleBack = () => {
    navigate({ to: '/voter/elections' });
  };

  const election = electionData?.election;
  const hasVoted = profileData?.voter?.has_voted ?? false;
  const canVote = election?.voter_status?.can_vote ?? false;

  // Transform candidates for display
  const positions = React.useMemo(() => {
    if (!candidatesData?.positions) return [];
    return candidatesData.positions.map((pos) => ({
      position: pos.position,
      candidates: pos.candidates.map((c) => ({
        id: c.candidate_id,
        name: c.name,
        position: c.position,
        photoUrl: c.photo_url,
        bio: c.bio,
        manifesto: c.manifesto,
      })),
    }));
  }, [candidatesData]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <VoterLayout
      voterName={user?.name || 'Voter'}
      voterEmail={user?.email}
      electionName={election?.election_name}
      onLogout={handleLogout}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back button */}
        <Button variant="ghost" onClick={handleBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Elections
        </Button>

        {electionError && (
          <AlertMessage variant="error">
            Failed to load election details. Please try again later.
          </AlertMessage>
        )}

        {/* Election Details */}
        {election && (
          <ElectionDetailsCard
            name={election.election_name}
            description={election.description}
            status={election.status as ElectionStatus}
            startTime={election.start_time}
            endTime={election.end_time}
            positions={election.positions}
          />
        )}

        {/* Voting Status & Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Voting Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasVoted ? (
              <>
                <AlertMessage variant="success">
                  You have already cast your vote in this election.
                </AlertMessage>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleViewResults} className="flex-1">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Results
                  </Button>
                </div>
              </>
            ) : canVote ? (
              <>
                <AlertMessage variant="info">
                  You are eligible to vote in this election. Time remaining: {election?.voter_status?.time_remaining || 'N/A'}
                </AlertMessage>
                <Button onClick={handleStartVoting} className="w-full" size="lg">
                  <Vote className="mr-2 h-5 w-5" />
                  Start Voting
                </Button>
              </>
            ) : (
              <AlertMessage variant="warning">
                Voting is not currently available for this election.
              </AlertMessage>
            )}
          </CardContent>
        </Card>

        {/* Candidates Preview */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Candidates</h2>
          <CandidateList
            positions={positions}
            isLoading={candidatesLoading}
          />
        </div>
      </div>
    </VoterLayout>
  );
}
