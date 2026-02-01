import * as React from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { rootRoute } from '../__root';
import { AdminLayout } from '@/components/templates';
import { AlertMessage } from '@/components/molecules';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/atoms';
import { getAdminElections } from '@/api/services/admin.service';
import { $user, $isAuthenticated, $isAdmin, logout } from '@/stores/auth.store';
import { useStore } from '@nanostores/react';
import { BarChart3, Trophy } from 'lucide-react';
import type { Admin, ElectionStatus } from '@/types';

export const adminResultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/results',
  component: AdminResultsPage,
});

function AdminResultsPage() {
  const navigate = useNavigate();
  const user = useStore($user) as Admin | null;
  const isAuthenticated = useStore($isAuthenticated);
  const isAdmin = useStore($isAdmin);

  React.useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate({ to: '/admin/login' });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'elections'],
    queryFn: getAdminElections,
    enabled: isAuthenticated && isAdmin,
  });

  const handleLogout = () => {
    logout();
    navigate({ to: '/admin/login' });
  };

  const handleNavigate = (path: string) => {
    navigate({ to: path });
  };

  const handleViewResults = (electionId: string) => {
    navigate({ to: '/admin/elections/$electionId/statistics', params: { electionId } });
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  // Filter elections that have concluded or announced results
  const electionsWithResults = React.useMemo(() => {
    if (!data?.elections) return [];
    return data.elections
      .filter((e) => ['concluded', 'results_announced'].includes(e.status))
      .map((e) => ({
        id: e.election_id,
        name: e.election_name,
        description: e.description,
        status: e.status as ElectionStatus,
        endTime: e.election_end_time,
        totalVoters: e.total_voters,
        votesCast: e.votes_cast,
      }));
  }, [data?.elections]);

  const ongoingElections = React.useMemo(() => {
    if (!data?.elections) return [];
    return data.elections
      .filter((e) => e.status === 'ongoing')
      .map((e) => ({
        id: e.election_id,
        name: e.election_name,
        status: e.status as ElectionStatus,
        votesCast: e.votes_cast,
        totalVoters: e.total_voters,
      }));
  }, [data?.elections]);

  return (
    <AdminLayout
      adminName={user?.username || 'Admin'}
      adminEmail={user?.email}
      currentPath="/admin/results"
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Election Results</h1>
          <p className="text-muted-foreground">
            View results and statistics for completed elections
          </p>
        </div>

        {error && (
          <AlertMessage variant="error">
            Failed to load results. Please try again later.
          </AlertMessage>
        )}

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Ongoing Elections */}
            {ongoingElections.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Live Elections
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {ongoingElections.map((election) => (
                    <Card key={election.id}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">{election.name}</CardTitle>
                        <Badge variant="default">Live</Badge>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Votes Cast</span>
                          <span className="font-medium">{election.votesCast} / {election.totalVoters}</span>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => handleViewResults(election.id)}
                        >
                          <BarChart3 className="mr-2 h-4 w-4" />
                          View Live Stats
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Elections */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Completed Elections
              </h2>
              {electionsWithResults.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No completed elections yet.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {electionsWithResults.map((election) => (
                    <Card key={election.id}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">{election.name}</CardTitle>
                        <Badge variant={election.status === 'results_announced' ? 'default' : 'secondary'}>
                          {election.status === 'results_announced' ? 'Published' : 'Concluded'}
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{election.description}</p>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Votes</span>
                          <span className="font-medium">{election.votesCast} / {election.totalVoters}</span>
                        </div>
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => handleViewResults(election.id)}
                        >
                          View Results
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
