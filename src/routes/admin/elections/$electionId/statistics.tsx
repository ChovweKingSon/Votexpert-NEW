import { createRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { rootRoute } from '../../../__root';

export const adminElectionStatisticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/elections/$electionId/statistics',
  component: ElectionStatisticsPage,
});

function ElectionStatisticsPage() {
  const { electionId } = adminElectionStatisticsRoute.useParams();

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Live Statistics</CardTitle>
            <CardDescription>Election ID: {electionId}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              Live statistics will be implemented in Phase 6
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
