import { createRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { rootRoute } from '../../__root';

export const voterElectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/voter/elections',
  component: VoterElectionsPage,
});

function VoterElectionsPage() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Available Elections</CardTitle>
            <CardDescription>
              Select an election to cast your vote
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              Elections list will be implemented in Phase 5
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
