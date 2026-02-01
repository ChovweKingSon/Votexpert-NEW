import * as React from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { rootRoute } from '../__root';
import { AdminLayout } from '@/components/templates';
import { DataTable } from '@/components/organisms';
import { AlertMessage } from '@/components/molecules';
import { Button, Badge } from '@/components/atoms';
import { getAdminCandidates } from '@/api/services/admin.service';
import { $user, $isAuthenticated, $isAdmin, logout } from '@/stores/auth.store';
import { useStore } from '@nanostores/react';
import { Plus } from 'lucide-react';
import type { Admin } from '@/types';

export const adminCandidatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/candidates',
  component: AdminCandidatesPage,
});

function AdminCandidatesPage() {
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
    queryKey: ['admin', 'candidates'],
    queryFn: getAdminCandidates,
    enabled: isAuthenticated && isAdmin,
  });

  const handleLogout = () => {
    logout();
    navigate({ to: '/admin/login' });
  };

  const handleNavigate = (path: string) => {
    navigate({ to: path });
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  type Candidate = {
    candidate_id: string;
    name: string;
    position: string;
    election_id: string;
    election_name: string;
    bio: string;
    photo_url: string;
    status: string;
  };

  const columns = [
    { key: 'name' as const, header: 'Name' },
    { key: 'position' as const, header: 'Position' },
    { key: 'election_name' as const, header: 'Election' },
    {
      key: 'status' as const,
      header: 'Status',
      render: (item: Candidate) => (
        <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
          {item.status || 'pending'}
        </Badge>
      )
    },
  ];

  return (
    <AdminLayout
      adminName={user?.username || 'Admin'}
      adminEmail={user?.email}
      currentPath="/admin/candidates"
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Candidates</h1>
            <p className="text-muted-foreground">
              Manage all candidates across elections
            </p>
          </div>
          <Button onClick={() => handleNavigate('/admin/elections/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Add via Election
          </Button>
        </div>

        {error && (
          <AlertMessage variant="error">
            Failed to load candidates. Please try again later.
          </AlertMessage>
        )}

        <DataTable
          columns={columns}
          data={data?.candidates || []}
          keyField="candidate_id"
          isLoading={isLoading}
          emptyMessage="No candidates found. Add candidates when creating an election."
        />
      </div>
    </AdminLayout>
  );
}
