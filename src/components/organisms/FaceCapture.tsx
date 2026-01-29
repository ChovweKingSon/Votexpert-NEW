import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms';
import { AlertMessage } from '@/components/molecules';
import { Camera, RefreshCw, Loader2, Check } from 'lucide-react';

interface FaceCaptureProps {
  onCapture: (imageBase64: string) => void;
  isVerifying?: boolean;
  error?: string;
  className?: string;
}

type CaptureState = 'idle' | 'streaming' | 'captured' | 'error';

export function FaceCapture({
  onCapture,
  isVerifying = false,
  error,
  className,
}: FaceCaptureProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  const [captureState, setCaptureState] = React.useState<CaptureState>('idle');
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null);
  const [cameraError, setCameraError] = React.useState<string | null>(null);

  // Start camera
  const startCamera = React.useCallback(async () => {
    setCameraError(null);
    setCaptureState('idle');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCaptureState('streaming');
      }
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError(
        'Unable to access camera. Please ensure camera permissions are granted.'
      );
      setCaptureState('error');
    }
  }, []);

  // Stop camera
  const stopCamera = React.useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas (mirror for selfie)
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0);

    // Get base64 image
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageBase64);
    setCaptureState('captured');

    // Stop camera after capture
    stopCamera();
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Confirm and submit
  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  // Start camera on mount
  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Face Verification</CardTitle>
        <CardDescription>
          Position your face within the frame and take a photo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(error || cameraError) && (
          <AlertMessage variant="error">
            {error || cameraError}
          </AlertMessage>
        )}

        {/* Camera/Preview container */}
        <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden">
          {/* Video stream */}
          <video
            ref={videoRef}
            className={cn(
              'absolute inset-0 w-full h-full object-cover',
              // Mirror the video for selfie view
              'transform scale-x-[-1]',
              captureState !== 'streaming' && 'hidden'
            )}
            playsInline
            muted
          />

          {/* Captured image preview */}
          {capturedImage && captureState === 'captured' && (
            <img
              src={capturedImage}
              alt="Captured face"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Face guide overlay */}
          {captureState === 'streaming' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-64 border-2 border-dashed border-white/50 rounded-full" />
            </div>
          )}

          {/* Loading state */}
          {captureState === 'idle' && !cameraError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}

          {/* Error state */}
          {captureState === 'error' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Action buttons */}
        <div className="flex gap-3">
          {captureState === 'streaming' && (
            <Button onClick={capturePhoto} className="flex-1" size="lg">
              <Camera className="mr-2 h-5 w-5" />
              Capture Photo
            </Button>
          )}

          {captureState === 'captured' && (
            <>
              <Button
                variant="outline"
                onClick={retakePhoto}
                className="flex-1"
                disabled={isVerifying}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retake
              </Button>
              <Button
                onClick={confirmPhoto}
                className="flex-1"
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                {isVerifying ? 'Verifying...' : 'Confirm'}
              </Button>
            </>
          )}

          {captureState === 'error' && (
            <Button onClick={startCamera} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Ensure good lighting and look directly at the camera</p>
        </div>
      </CardContent>
    </Card>
  );
}
