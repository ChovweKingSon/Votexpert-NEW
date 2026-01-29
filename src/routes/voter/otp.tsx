import { createRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { rootRoute } from '../__root';

export const voterOtpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/voter/otp',
  component: VoterOtpPage,
});

function VoterOtpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Verify OTP</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">
            OTP verification will be implemented in Phase 5
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
