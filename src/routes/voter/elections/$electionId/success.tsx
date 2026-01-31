import * as React from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { rootRoute } from '../../../__root';
import { VoterLayout } from '@/components/templates';
import { VoteReceipt } from '@/components/organisms';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms';
import { $user, $isAuthenticated, logout } from '@/stores/auth.store';
import { $voteReceipt, clearVoteReceipt } from '@/stores/election.store';
import { useStore } from '@nanostores/react';
import { AlertTriangle } from 'lucide-react';
import type { Voter } from '@/types';

export const voterElectionSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/voter/elections/$electionId/success',
  component: VoteSuccessPage,
});

function VoteSuccessPage() {
  const navigate = useNavigate();
  const { electionId } = voterElectionSuccessRoute.useParams();
  const user = useStore($user) as Voter | null;
  const isAuthenticated = useStore($isAuthenticated);
  const voteReceipt = useStore($voteReceipt);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/voter/login' });
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    clearVoteReceipt();
    navigate({ to: '/voter/login' });
  };

  const handleViewResults = () => {
    navigate({ to: '/voter/results/$electionId', params: { electionId } });
  };

  const handleGoHome = () => {
    clearVoteReceipt();
    navigate({ to: '/voter/elections' });
  };

  if (!isAuthenticated) {
    return null;
  }

  // No receipt - show error state
  if (!voteReceipt) {
    return (
      <VoterLayout
        voterName={user?.name || 'Voter'}
        voterEmail={user?.email}
        onLogout={handleLogout}
      >
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <CardTitle>No Vote Receipt</CardTitle>
              <CardDescription>
                We couldn't find your vote receipt. This page is only accessible
                immediately after voting.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button
                onClick={handleGoHome}
                className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
              >
                Go to Elections
              </button>
            </CardContent>
          </Card>
        </div>
      </VoterLayout>
    );
  }

  return (
    <VoterLayout
      voterName={user?.name || 'Voter'}
      voterEmail={user?.email}
      onLogout={handleLogout}
    >
      <div className="max-w-md mx-auto py-8">
        <VoteReceipt
          voteId={voteReceipt.vote_id}
          timestamp={voteReceipt.timestamp}
          positionsVoted={voteReceipt.positions_voted}
          electionName={voteReceipt.electionName}
          onViewResults={handleViewResults}
          onGoHome={handleGoHome}
        />
      </div>
    </VoterLayout>
  );
}
