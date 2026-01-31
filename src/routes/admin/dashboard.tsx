import * as React from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { rootRoute } from '../__root';
import { AdminLayout } from '@/components/templates';
import { ElectionDashboardStats, ElectionList } from '@/components/organisms';
import { AlertMessage } from '@/components/molecules';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/atoms';
import { $user, $isAuthenticated, $isAdmin, logout } from '@/stores/auth.store';
import { useStore } from '@nanostores/react';
import { Plus } from 'lucide-react';
import type { Admin, ElectionStatus } from '@/types';

// Mock function - would be replaced with actual API call
async function getAdminDashboard() {
  // In a real implementation, this would fetch dashboard data from the API
  return {
    success: true,
    stats: {
      totalElections: 5,
      activeElections: 2,
      totalVoters: 1250,
      totalVotesCast: 890,
    },
    recentElections: [
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
    ],
  };
}

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

  // Fetch dashboard data
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: getAdminDashboard,
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
          totalElections={data?.stats.totalElections || 0}
          activeElections={data?.stats.activeElections || 0}
          totalVoters={data?.stats.totalVoters || 0}
          totalVotesCast={data?.stats.totalVotesCast || 0}
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
              elections={data?.recentElections || []}
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
