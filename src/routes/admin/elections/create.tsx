import { createRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { rootRoute } from '../../__root';

export const adminElectionsCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/elections/create',
  component: CreateElectionPage,
});

function CreateElectionPage() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create Election</CardTitle>
            <CardDescription>
              Set up a new election with candidates and voters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              Election creation form will be implemented in Phase 6
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
