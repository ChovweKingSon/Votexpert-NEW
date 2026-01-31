import * as React from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rootRoute } from '../../../__root';
import { AdminLayout } from '@/components/templates';
import { ElectionDetailsCard, CandidateList } from '@/components/organisms';
import { AlertMessage } from '@/components/molecules';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/atoms';
import { getElectionDetails, updateElectionStatus } from '@/api/services/admin.service';
import { $user, $isAuthenticated, $isAdmin, logout } from '@/stores/auth.store';
import { useStore } from '@nanostores/react';
import { ArrowLeft, Play, Pause, BarChart3, CheckCircle } from 'lucide-react';
import type { Admin, ElectionStatus, UpdateElectionStatusPayload } from '@/types';

export const adminElectionDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/elections/$electionId',
  component: AdminElectionDetailsPage,
});

function AdminElectionDetailsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { electionId } = adminElectionDetailsRoute.useParams();
  const user = useStore($user) as Admin | null;
  const isAuthenticated = useStore($isAuthenticated);
  const isAdmin = useStore($isAdmin);
  const [error, setError] = React.useState<string | undefined>();

  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate({ to: '/admin/login' });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Fetch election details
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'election', electionId],
    queryFn: () => getElectionDetails(electionId),
    enabled: isAuthenticated && isAdmin && !!electionId,
  });

  // Update status mutation
  const statusMutation = useMutation({
    mutationFn: (payload: UpdateElectionStatusPayload) =>
      updateElectionStatus(electionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'election', electionId] });
      setError(undefined);
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to update election status.');
    },
  });

  const handleLogout = () => {
    logout();
    navigate({ to: '/admin/login' });
  };

  const handleNavigate = (path: string) => {
    navigate({ to: path });
  };

  const handleBack = () => {
    navigate({ to: '/admin/elections' });
  };

  const handleViewStatistics = () => {
    navigate({
      to: '/admin/elections/$electionId/statistics',
      params: { electionId },
    });
  };

  const handleStatusChange = (newStatus: ElectionStatus) => {
    statusMutation.mutate({ status: newStatus });
  };

  const election = data?.election;

  // Transform positions for display
  const positions = React.useMemo(() => {
    // In a real implementation, this would come from candidates API
    return [];
  }, []);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const getStatusActions = () => {
    if (!election) return null;

    switch (election.status) {
      case 'draft':
        return (
          <Button onClick={() => handleStatusChange('active')}>
            <Play className="mr-2 h-4 w-4" />
            Activate Election
          </Button>
        );
      case 'active':
        return (
          <div className="flex gap-2">
            <Button onClick={() => handleStatusChange('ongoing')} variant="default">
              <Play className="mr-2 h-4 w-4" />
              Start Voting
            </Button>
            <Button onClick={() => handleStatusChange('cancelled')} variant="destructive">
              Cancel
            </Button>
          </div>
        );
      case 'ongoing':
        return (
          <div className="flex gap-2">
            <Button onClick={handleViewStatistics} variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Live Statistics
            </Button>
            <Button onClick={() => handleStatusChange('concluded')} variant="secondary">
              <Pause className="mr-2 h-4 w-4" />
              End Voting
            </Button>
          </div>
        );
      case 'concluded':
        return (
          <Button onClick={() => handleStatusChange('results_announced')}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Announce Results
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <AdminLayout
      adminName={user?.username || 'Admin'}
      adminEmail={user?.email}
      currentPath="/admin/elections"
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      <div className="space-y-6">
        {/* Back button */}
        <Button variant="ghost" onClick={handleBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Elections
        </Button>

        {error && (
          <AlertMessage variant="error">{error}</AlertMessage>
        )}

        {isLoading ? (
          <Card>
            <CardContent className="p-8">
              <p className="text-center text-muted-foreground">Loading election details...</p>
            </CardContent>
          </Card>
        ) : election ? (
          <>
            {/* Election Details */}
            <ElectionDetailsCard
              name={election.election_name}
              description={election.description}
              status={election.status}
              startTime={election.election_start_time}
              endTime={election.election_end_time}
              resultAnnouncementTime={election.result_announcement_time}
              positions={election.positions?.map((p) => p.position_name)}
              statistics={{
                totalVoters: election.statistics?.total_voters || 0,
                totalCandidates: election.statistics?.total_candidates || 0,
                votesCast: election.statistics?.votes_cast || 0,
                voterTurnout: election.statistics?.voter_turnout || 0,
              }}
            />

            {/* Status Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Election Management</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Current Status:</span>
                  <Badge>{election.status}</Badge>
                </div>
                <div className="flex gap-2">
                  {getStatusActions()}
                  <Button onClick={handleViewStatistics} variant="outline">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Statistics
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Candidates */}
            <Card>
              <CardHeader>
                <CardTitle>Candidates</CardTitle>
              </CardHeader>
              <CardContent>
                <CandidateList
                  positions={positions}
                  isLoading={false}
                />
              </CardContent>
            </Card>
          </>
        ) : (
          <AlertMessage variant="error">Election not found.</AlertMessage>
        )}
      </div>
    </AdminLayout>
  );
}
