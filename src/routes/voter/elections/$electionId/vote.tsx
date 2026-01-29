import { createRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { rootRoute } from '../../../__root';

export const voterElectionVoteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/voter/elections/$electionId/vote',
  component: VotingPage,
});

function VotingPage() {
  const { electionId } = voterElectionVoteRoute.useParams();

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Cast Your Vote</CardTitle>
            <CardDescription>Election ID: {electionId}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              Voting ballot will be implemented in Phase 5
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
