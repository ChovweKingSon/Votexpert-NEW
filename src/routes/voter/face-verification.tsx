import * as React from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { rootRoute } from '../__root';
import { AuthLayout } from '@/components/templates';
import { FaceCapture } from '@/components/organisms';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms';
import { voterVerifyFace } from '@/api/services/voter.service';
import {
  $faceVerificationToken,
  setFaceVerificationToken,
  setTokens,
  setUser,
} from '@/stores/auth.store';
import { useStore } from '@nanostores/react';
import { AlertTriangle } from 'lucide-react';
import type { VoterFacePayload } from '@/types';

export const voterFaceVerificationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/voter/face-verification',
  component: FaceVerificationPage,
});

function FaceVerificationPage() {
  const navigate = useNavigate();
  const faceToken = useStore($faceVerificationToken);
  const [error, setError] = React.useState<string | undefined>();

  const verifyMutation = useMutation({
    mutationFn: voterVerifyFace,
    onSuccess: (data) => {
      if (data.success) {
        // Store tokens and user data
        setTokens({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        });
        setUser(data.voter, 'voter');

        // Clear the face verification token
        setFaceVerificationToken(null);

        // Navigate to elections
        navigate({ to: '/voter/elections' });
      } else {
        setError(data.message || 'Face verification failed. Please try again.');
      }
    },
    onError: (err: Error) => {
      setError(err.message || 'An error occurred. Please try again.');
    },
  });

  const handleCapture = (imageBase64: string) => {
    if (!faceToken) {
      setError('Verification session expired. Please start over.');
      return;
    }

    setError(undefined);
    const payload: VoterFacePayload = {
      face_image: imageBase64,
      face_verification_token: faceToken,
    };
    verifyMutation.mutate(payload);
  };

  // No token - invalid state
  if (!faceToken) {
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
              Your face verification session has expired.
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
      title="Face Verification"
      subtitle="Complete your identity verification"
    >
      <FaceCapture
        onCapture={handleCapture}
        isVerifying={verifyMutation.isPending}
        error={error}
      />
    </AuthLayout>
  );
}
