import { createRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { CheckCircle } from 'lucide-react';
import { rootRoute } from '../../../__root';

export const voterElectionSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/voter/elections/$electionId/success',
  component: VoteSuccessPage,
});

function VoteSuccessPage() {
  const { electionId } = voterElectionSuccessRoute.useParams();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Vote Submitted!</CardTitle>
          <CardDescription>Election ID: {electionId}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Vote receipt will be implemented in Phase 5
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
