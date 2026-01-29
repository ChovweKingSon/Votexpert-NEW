import { createRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { rootRoute } from '../__root';

export const adminOtpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/otp',
  component: AdminOtpPage,
});

function AdminOtpPage() {
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
            Admin OTP verification will be implemented in Phase 6
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
