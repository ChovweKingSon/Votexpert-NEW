import { createRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { rootRoute } from '../__root';

export const voterLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/voter/login',
  component: VoterLoginPage,
});

function VoterLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Voter Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your ballot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">
            Login form will be implemented in Phase 5
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
