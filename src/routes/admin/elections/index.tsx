import { createRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { rootRoute } from '../../__root';

export const adminElectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/elections',
  component: AdminElectionsPage,
});

function AdminElectionsPage() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Manage Elections</CardTitle>
            <CardDescription>
              View and manage all elections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              Elections management will be implemented in Phase 6
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
