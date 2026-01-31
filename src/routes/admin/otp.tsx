import * as React from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { rootRoute } from '../__root';
import { AuthLayout } from '@/components/templates';
import { OtpVerificationForm } from '@/components/organisms';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms';
import { adminVerifyOtp } from '@/api/services/admin.service';
import { $sessionToken, setSessionToken, setTokens, setUser } from '@/stores/auth.store';
import { useStore } from '@nanostores/react';
import { AlertTriangle } from 'lucide-react';
import type { AdminOtpPayload } from '@/types';

export const adminOtpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/otp',
  component: AdminOtpPage,
});

function AdminOtpPage() {
  const navigate = useNavigate();
  const sessionToken = useStore($sessionToken);
  const [error, setError] = React.useState<string | undefined>();

  const verifyMutation = useMutation({
    mutationFn: adminVerifyOtp,
    onSuccess: (data) => {
      if (data.success) {
        // Store tokens and admin data
        setTokens({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        });
        setUser(data.admin, 'admin');

        // Clear session token
        setSessionToken(null);

        // Navigate to dashboard
        navigate({ to: '/admin/dashboard' });
      } else {
        setError('OTP verification failed. Please try again.');
      }
    },
    onError: (err: Error) => {
      setError(err.message || 'An error occurred. Please try again.');
    },
  });

  const handleSubmit = (otp: string) => {
    if (!sessionToken) {
      setError('Session expired. Please login again.');
      return;
    }

    setError(undefined);
    const payload: AdminOtpPayload = {
      session_token: sessionToken,
      otp,
    };
    verifyMutation.mutate(payload);
  };

  const handleResend = () => {
    // In a real implementation, this would call an API to resend the OTP
    setError(undefined);
  };

  // No session token - invalid state
  if (!sessionToken) {
    return (
      <AuthLayout
        title="Session Expired"
        subtitle="Please start the login process again"
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-xl">Session Expired</CardTitle>
            <CardDescription>
              Your login session has expired. Please start over.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => navigate({ to: '/admin/login' })}
              className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
            >
              Go to Login
            </button>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Two-Factor Authentication"
      subtitle="Enter the OTP code sent to your email"
    >
      <OtpVerificationForm
        onSubmit={handleSubmit}
        onResend={handleResend}
        isLoading={verifyMutation.isPending}
        error={error}
      />
    </AuthLayout>
  );
}
