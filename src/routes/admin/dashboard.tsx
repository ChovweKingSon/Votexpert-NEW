import * as React from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { rootRoute } from '../__root';
import { AdminLayout } from '@/components/templates';
import { ElectionDashboardStats, ElectionList } from '@/components/organisms';
import { AlertMessage } from '@/components/molecules';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/atoms';
import { getAdminElections } from '@/api/services/admin.service';
import { $user, $isAuthenticated, $isAdmin, logout } from '@/stores/auth.store';
import { useStore } from '@nanostores/react';
import { Plus } from 'lucide-react';
import type { Admin, ElectionStatus } from '@/types';

export const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/dashboard',
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const navigate = useNavigate();
  const user = useStore($user) as Admin | null;
  const isAuthenticated = useStore($isAuthenticated);
  const isAdmin = useStore($isAdmin);

  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate({ to: '/admin/login' });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Fetch elections data
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'elections'],
    queryFn: getAdminElections,
    enabled: isAuthenticated && isAdmin,
  });

  // Transform API data and compute stats
  const { elections, stats } = React.useMemo(() => {
    if (!data?.elections) {
      return {
        elections: [],
        stats: { totalElections: 0, activeElections: 0, totalVoters: 0, totalVotesCast: 0 },
      };
    }

    const electionsList = data.elections.map((e) => ({
      id: e.election_id,
      name: e.election_name,
      description: e.description,
      status: e.status as ElectionStatus,
      startTime: e.election_start_time,
      endTime: e.election_end_time,
      totalVoters: e.total_voters,
      votesCast: e.votes_cast,
    }));

    const activeStatuses = ['active', 'ongoing'];
    const computedStats = {
      totalElections: electionsList.length,
      activeElections: electionsList.filter((e) => activeStatuses.includes(e.status)).length,
      totalVoters: electionsList.reduce((sum, e) => sum + (e.totalVoters || 0), 0),
      totalVotesCast: electionsList.reduce((sum, e) => sum + (e.votesCast || 0), 0),
    };

    return { elections: electionsList.slice(0, 5), stats: computedStats };
  }, [data?.elections]);

  const handleLogout = () => {
    logout();
    navigate({ to: '/admin/login' });
  };

  const handleNavigate = (path: string) => {
    navigate({ to: path });
  };

  const handleElectionClick = (electionId: string) => {
    navigate({ to: '/admin/elections/$electionId', params: { electionId } });
  };

  const handleCreateElection = () => {
    navigate({ to: '/admin/elections/create' });
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <AdminLayout
      adminName={user?.username || 'Admin'}
      adminEmail={user?.email}
      currentPath="/admin/dashboard"
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.username || 'Admin'}
            </p>
          </div>
          <Button onClick={handleCreateElection}>
            <Plus className="mr-2 h-4 w-4" />
            Create Election
          </Button>
        </div>

        {error && (
          <AlertMessage variant="error">
            Failed to load dashboard data. Please try again later.
          </AlertMessage>
        )}

        {/* Stats */}
        <ElectionDashboardStats
          totalElections={stats.totalElections}
          activeElections={stats.activeElections}
          totalVoters={stats.totalVoters}
          totalVotesCast={stats.totalVotesCast}
          isLoading={isLoading}
        />

        {/* Recent Elections */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Elections</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigate('/admin/elections')}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <ElectionList
              elections={elections}
              isLoading={isLoading}
              emptyMessage="No elections yet. Create your first election!"
              onElectionClick={handleElectionClick}
              getActionLabel={() => 'Manage'}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
