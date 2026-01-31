import * as React from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { rootRoute } from '../../__root';
import { AdminLayout } from '@/components/templates';
import { ElectionList } from '@/components/organisms';
import { AlertMessage } from '@/components/molecules';
import { Button } from '@/components/atoms';
import { getAdminElections } from '@/api/services/admin.service';
import { $user, $isAuthenticated, $isAdmin, logout } from '@/stores/auth.store';
import { useStore } from '@nanostores/react';
import { Plus } from 'lucide-react';
import type { Admin, ElectionStatus } from '@/types';

export const adminElectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/elections',
  component: AdminElectionsPage,
});

function AdminElectionsPage() {
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

  // Fetch elections
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

  const handleElectionClick = (electionId: string) => {
    navigate({ to: '/admin/elections/$electionId', params: { electionId } });
  };

  const handleCreateElection = () => {
    navigate({ to: '/admin/elections/create' });
  };

  // Transform API data to match component interface
  const elections = React.useMemo(() => {
    if (!data?.elections) return [];
    return data.elections.map((e) => ({
      id: e.election_id,
      name: e.election_name,
      description: e.description,
      status: e.status as ElectionStatus,
      startTime: e.election_start_time,
      endTime: e.election_end_time,
      totalVoters: e.total_voters,
      votesCast: e.votes_cast,
    }));
  }, [data?.elections]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <AdminLayout
      adminName={user?.username || 'Admin'}
      adminEmail={user?.email}
      currentPath="/admin/elections"
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Elections</h1>
            <p className="text-muted-foreground">
              Manage all your elections
            </p>
          </div>
          <Button onClick={handleCreateElection}>
            <Plus className="mr-2 h-4 w-4" />
            Create Election
          </Button>
        </div>

        {error && (
          <AlertMessage variant="error">
            Failed to load elections. Please try again later.
          </AlertMessage>
        )}

        {/* Elections List */}
        <ElectionList
          elections={elections}
          isLoading={isLoading}
          emptyMessage="No elections yet. Create your first election!"
          onElectionClick={handleElectionClick}
          getActionLabel={(election) => {
            if (election.status === 'draft') return 'Edit';
            if (election.status === 'ongoing') return 'Monitor';
            if (election.status === 'results_announced') return 'View Results';
            return 'Manage';
          }}
        />
      </div>
    </AdminLayout>
  );
}
