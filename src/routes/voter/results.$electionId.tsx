import { createRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { rootRoute } from '../__root';

export const voterResultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/voter/results/$electionId',
  component: ResultsPage,
});

function ResultsPage() {
  const { electionId } = voterResultsRoute.useParams();

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Election Results</CardTitle>
            <CardDescription>Election ID: {electionId}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              Results display will be implemented in Phase 5
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
