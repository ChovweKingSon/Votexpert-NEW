import * as React from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { rootRoute } from '../../__root';
import { AdminLayout } from '@/components/templates';
import { ElectionForm, FileUpload } from '@/components/organisms';
import { AlertMessage } from '@/components/molecules';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms';
import { createElection } from '@/api/services/admin.service';
import { $user, $isAuthenticated, $isAdmin, logout } from '@/stores/auth.store';
import { useStore } from '@nanostores/react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import type { Admin, CreateElectionPayload } from '@/types';

export const adminElectionsCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/elections/create',
  component: CreateElectionPage,
});

function CreateElectionPage() {
  const navigate = useNavigate();
  const user = useStore($user) as Admin | null;
  const isAuthenticated = useStore($isAuthenticated);
  const isAdmin = useStore($isAdmin);

  const [error, setError] = React.useState<string | undefined>();
  const [candidatesCsv, setCandidatesCsv] = React.useState<string | null>(null);
  const [votersCsv, setVotersCsv] = React.useState<string | null>(null);
  const [createdElectionId, setCreatedElectionId] = React.useState<string | null>(null);

  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate({ to: '/admin/login' });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const createMutation = useMutation({
    mutationFn: createElection,
    onSuccess: (data) => {
      if (data.success) {
        setCreatedElectionId(data.election_id);
      } else {
        setError(data.message || 'Failed to create election. Please try again.');
      }
    },
    onError: (err: Error) => {
      setError(err.message || 'An error occurred. Please try again.');
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

  const handleSubmit = (data: {
    name: string;
    description: string;
    startTime: string;
    endTime: string;
    resultAnnouncementTime: string;
    positions: string[];
  }) => {
    setError(undefined);

    const payload: CreateElectionPayload = {
      election_name: data.name,
      description: data.description,
      election_start_time: data.startTime,
      election_end_time: data.endTime,
      result_announcement_time: data.resultAnnouncementTime || undefined,
      positions: JSON.stringify(
        data.positions.map((pos) => ({ position_name: pos, max_candidates: 10 }))
      ),
      candidates_csv_base64: candidatesCsv || undefined,
      voters_csv_base64: votersCsv || undefined,
    };

    createMutation.mutate(payload);
  };

  const handleCandidatesFile = (_file: File, base64: string) => {
    setCandidatesCsv(base64);
  };

  const handleVotersFile = (_file: File, base64: string) => {
    setVotersCsv(base64);
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  // Success state
  if (createdElectionId) {
    return (
      <AdminLayout
        adminName={user?.username || 'Admin'}
        adminEmail={user?.email}
        currentPath="/admin/elections"
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      >
        <div className="max-w-md mx-auto py-8">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl text-green-600 dark:text-green-400">
                Election Created!
              </CardTitle>
              <CardDescription>
                Your election has been created successfully.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Election ID</p>
                <p className="font-mono font-medium">{createdElectionId}</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  Back to Elections
                </Button>
                <Button
                  onClick={() =>
                    navigate({
                      to: '/admin/elections/$electionId',
                      params: { electionId: createdElectionId },
                    })
                  }
                  className="flex-1"
                >
                  View Election
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      adminName={user?.username || 'Admin'}
      adminEmail={user?.email}
      currentPath="/admin/elections"
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back button */}
        <Button variant="ghost" onClick={handleBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Elections
        </Button>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Election</h1>
          <p className="text-muted-foreground">
            Set up a new election with positions, candidates, and voters
          </p>
        </div>

        {error && (
          <AlertMessage variant="error">{error}</AlertMessage>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Election Form */}
          <div className="lg:col-span-2">
            <ElectionForm
              onSubmit={handleSubmit}
              isLoading={createMutation.isPending}
              error={error}
              mode="create"
            />
          </div>

          {/* File Uploads */}
          <FileUpload
            title="Candidates CSV"
            description="Upload a CSV file with candidate details"
            accept=".csv"
            maxSize={5}
            onFileSelect={handleCandidatesFile}
            successMessage={candidatesCsv ? 'Candidates file ready' : undefined}
          />

          <FileUpload
            title="Voters CSV"
            description="Upload a CSV file with voter details"
            accept=".csv"
            maxSize={10}
            onFileSelect={handleVotersFile}
            successMessage={votersCsv ? 'Voters file ready' : undefined}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
