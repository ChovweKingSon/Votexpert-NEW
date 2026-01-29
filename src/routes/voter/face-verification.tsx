import { createRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { rootRoute } from '../__root';

export const voterFaceVerificationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/voter/face-verification',
  component: FaceVerificationPage,
});

function FaceVerificationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Face Verification</CardTitle>
          <CardDescription>
            Position your face in the camera frame
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">
            Face verification will be implemented in Phase 5
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
