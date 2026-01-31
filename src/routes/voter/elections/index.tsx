import * as React from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { rootRoute } from '../../__root';
import { VoterLayout } from '@/components/templates';
import { ElectionList } from '@/components/organisms';
import { AlertMessage } from '@/components/molecules';
import { getVoterProfile } from '@/api/services/voter.service';
import { $user, $isAuthenticated, logout } from '@/stores/auth.store';
import { useStore } from '@nanostores/react';
import type { Voter, ElectionStatus } from '@/types';

export const voterElectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/voter/elections',
  component: VoterElectionsPage,
});

function VoterElectionsPage() {
  const navigate = useNavigate();
  const user = useStore($user) as Voter | null;
  const isAuthenticated = useStore($isAuthenticated);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/voter/login' });
    }
  }, [isAuthenticated, navigate]);

  // Fetch voter profile (includes election info)
  const { data, isLoading, error } = useQuery({
    queryKey: ['voter', 'profile'],
    queryFn: getVoterProfile,
    enabled: isAuthenticated,
  });

  const handleLogout = () => {
    logout();
    navigate({ to: '/voter/login' });
  };

  const handleElectionClick = (electionId: string) => {
    navigate({ to: '/voter/elections/$electionId', params: { electionId } });
  };

  // Transform election data for the list
  const elections = React.useMemo(() => {
    if (!data?.election) return [];

    const election = data.election;
    return [
      {
        id: election.election_id,
        name: election.election_name,
        status: election.status as ElectionStatus,
        startTime: new Date().toISOString(), // Placeholder - would come from API
        endTime: new Date(Date.now() + 86400000).toISOString(), // Placeholder
      },
    ];
  }, [data]);

  const getActionLabel = (election: { id: string; status: string }) => {
    if (data?.voter?.has_voted) {
      return 'View Receipt';
    }
    if (election.status === 'ongoing' || election.status === 'active') {
      return 'Cast Vote';
    }
    return 'View Details';
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <VoterLayout
      voterName={user?.name || 'Voter'}
      voterEmail={user?.email}
      onLogout={handleLogout}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Your Elections</h1>
          <p className="text-muted-foreground">
            Select an election to cast your vote
          </p>
        </div>

        {/* Voting status message */}
        {data?.voter?.has_voted && (
          <AlertMessage variant="success">
            You have already cast your vote in this election. Thank you for participating!
          </AlertMessage>
        )}

        {error && (
          <AlertMessage variant="error">
            Failed to load elections. Please try again later.
          </AlertMessage>
        )}

        <ElectionList
          elections={elections}
          isLoading={isLoading}
          emptyMessage="No elections available at this time."
          onElectionClick={handleElectionClick}
          getActionLabel={getActionLabel}
        />
      </div>
    </VoterLayout>
  );
}
