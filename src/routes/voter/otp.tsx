import * as React from 'react';
import { createRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { rootRoute } from '../__root';
import { AuthLayout } from '@/components/templates';
import { OtpVerificationForm } from '@/components/organisms';
import { AlertMessage } from '@/components/molecules';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms';
import { voterVerifyOtp } from '@/api/services/voter.service';
import { setFaceVerificationToken } from '@/stores/auth.store';
import { Mail } from 'lucide-react';
import type { VoterOtpPayload } from '@/types';

interface OtpSearchParams {
  token?: string;
  awaiting?: string;
  voter_id?: string;
}

export const voterOtpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/voter/otp',
  component: VoterOtpPage,
  validateSearch: (search: Record<string, unknown>): OtpSearchParams => ({
    token: search.token as string | undefined,
    awaiting: search.awaiting as string | undefined,
    voter_id: search.voter_id as string | undefined,
  }),
});

function VoterOtpPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/voter/otp' });
  const [error, setError] = React.useState<string | undefined>();

  // Check if we're awaiting email verification
  const isAwaitingEmail = search.awaiting === 'email';
  const verificationToken = search.token;

  const verifyMutation = useMutation({
    mutationFn: voterVerifyOtp,
    onSuccess: (data) => {
      if (data.success && data.face_verification_required) {
        // Store face verification token and redirect
        setFaceVerificationToken(data.face_verification_token);
        navigate({ to: '/voter/face-verification' });
      } else if (data.success) {
        // No face verification needed, go to elections
        navigate({ to: '/voter/elections' });
      } else {
        setError(data.message || 'OTP verification failed. Please try again.');
      }
    },
    onError: (err: Error) => {
      setError(err.message || 'An error occurred. Please try again.');
    },
  });

  const handleSubmit = (otp: string) => {
    if (!verificationToken) {
      setError('Verification token missing. Please start over from login.');
      return;
    }

    setError(undefined);
    const payload: VoterOtpPayload = {
      token: verificationToken,
      otp,
    };
    verifyMutation.mutate(payload);
  };

  const handleResend = () => {
    // In a real implementation, this would call an API to resend the OTP
    // For now, we'll just show a message
    setError(undefined);
  };

  // Show waiting for email screen if user just submitted login
  if (isAwaitingEmail && !verificationToken) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="We've sent a verification link to your email"
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Verification Email Sent</CardTitle>
            <CardDescription>
              Please check your email and click the verification link to continue.
              The link will expire in 10 minutes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AlertMessage variant="info">
              After clicking the link in your email, you'll be redirected back here to enter your OTP code.
            </AlertMessage>
            <p className="text-sm text-muted-foreground text-center">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => navigate({ to: '/voter/login' })}
                className="text-primary hover:underline"
              >
                try again
              </button>
            </p>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  // No token provided - invalid state
  if (!verificationToken) {
    return (
      <AuthLayout
        title="Session Expired"
        subtitle="Please start the login process again"
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Invalid Session</CardTitle>
            <CardDescription>
              Your verification session has expired or is invalid.
              Please start over from the login page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => navigate({ to: '/voter/login' })}
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
      title="Verify Your Identity"
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
