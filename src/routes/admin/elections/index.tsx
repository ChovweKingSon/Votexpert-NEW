import * as React from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { rootRoute } from '../../__root';
import { AdminLayout } from '@/components/templates';
import { ElectionList } from '@/components/organisms';
import { AlertMessage } from '@/components/molecules';
import { Button } from '@/components/atoms';
import { $user, $isAuthenticated, $isAdmin, logout } from '@/stores/auth.store';
import { useStore } from '@nanostores/react';
import { Plus } from 'lucide-react';
import type { Admin, ElectionStatus } from '@/types';

// Mock function - would be replaced with actual API call
async function getAdminElections() {
  return {
    success: true,
    elections: [
      {
        id: '1',
        name: '2026 Board Elections',
        description: 'Annual board member elections',
        status: 'ongoing' as ElectionStatus,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 86400000 * 3).toISOString(),
        totalVoters: 500,
        votesCast: 320,
      },
      {
        id: '2',
        name: 'Alumni Association Elections',
        description: 'Election of new alumni representatives',
        status: 'active' as ElectionStatus,
        startTime: new Date(Date.now() + 86400000).toISOString(),
        endTime: new Date(Date.now() + 86400000 * 7).toISOString(),
        totalVoters: 750,
        votesCast: 0,
      },
      {
        id: '3',
        name: 'Student Council Elections 2025',
        description: 'Previous student council election',
        status: 'results_announced' as ElectionStatus,
        startTime: new Date(Date.now() - 86400000 * 30).toISOString(),
        endTime: new Date(Date.now() - 86400000 * 23).toISOString(),
        totalVoters: 1200,
        votesCast: 890,
      },
    ],
  };
}

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
          elections={data?.elections || []}
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
