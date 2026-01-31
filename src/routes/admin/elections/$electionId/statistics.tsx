import * as React from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { rootRoute } from '../../../__root';
import { AdminLayout } from '@/components/templates';
import { DashboardStats } from '@/components/organisms';
import { AlertMessage } from '@/components/molecules';
import { Button, Card, CardContent, CardHeader, CardTitle, ProgressBar } from '@/components/atoms';
import { getElectionStatistics } from '@/api/services/admin.service';
import { $user, $isAuthenticated, $isAdmin, logout } from '@/stores/auth.store';
import { useStore } from '@nanostores/react';
import { ArrowLeft, RefreshCw, Users, Vote, BarChart3, Clock, TrendingUp } from 'lucide-react';
import type { Admin } from '@/types';

export const adminElectionStatisticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/elections/$electionId/statistics',
  component: ElectionStatisticsPage,
});

function ElectionStatisticsPage() {
  const navigate = useNavigate();
  const { electionId } = adminElectionStatisticsRoute.useParams();
  const user = useStore($user) as Admin | null;
  const isAuthenticated = useStore($isAuthenticated);
  const isAdmin = useStore($isAdmin);

  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate({ to: '/admin/login' });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Fetch statistics with auto-refresh
  const { data, isLoading, error, refetch, dataUpdatedAt } = useQuery({
    queryKey: ['admin', 'election', electionId, 'statistics'],
    queryFn: () => getElectionStatistics(electionId),
    enabled: isAuthenticated && isAdmin && !!electionId,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleLogout = () => {
    logout();
    navigate({ to: '/admin/login' });
  };

  const handleNavigate = (path: string) => {
    navigate({ to: path });
  };

  const handleBack = () => {
    navigate({ to: '/admin/elections/$electionId', params: { electionId } });
  };

  const handleRefresh = () => {
    refetch();
  };

  const stats = data?.statistics;
  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'N/A';

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const statsItems = stats
    ? [
        { label: 'Total Voters', value: stats.total_voters, icon: Users },
        { label: 'Votes Cast', value: stats.votes_cast, icon: Vote },
        { label: 'Pending Votes', value: stats.pending_votes, icon: Clock },
        {
          label: 'Turnout',
          value: `${stats.turnout_percentage.toFixed(1)}%`,
          icon: TrendingUp,
        },
      ]
    : [];

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
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Live Statistics</h1>
              <p className="text-sm text-muted-foreground">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {error && (
          <AlertMessage variant="error">
            Failed to load statistics. Please try again.
          </AlertMessage>
        )}

        {/* Stats Overview */}
        <DashboardStats stats={statsItems} isLoading={isLoading} />

        {/* Turnout Progress */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Voter Turnout Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProgressBar
                value={stats.turnout_percentage}
                showLabel
                size="lg"
                variant={stats.turnout_percentage >= 50 ? 'success' : 'default'}
              />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.votes_cast}</p>
                  <p className="text-sm text-muted-foreground">Votes Cast</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.pending_votes}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.total_voters}</p>
                  <p className="text-sm text-muted-foreground">Total Eligible</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Votes by Position */}
        {stats && stats.votes_by_position && (
          <Card>
            <CardHeader>
              <CardTitle>Votes by Position</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.votes_by_position).map(([position, votes]) => (
                  <div key={position} className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{position}</span>
                    <span className="text-muted-foreground">{votes} votes</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Auto-refresh notice */}
        <p className="text-sm text-muted-foreground text-center">
          Statistics automatically refresh every 30 seconds
        </p>
      </div>
    </AdminLayout>
  );
}
