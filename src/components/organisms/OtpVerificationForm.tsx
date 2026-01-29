import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms';
import { OtpInput, AlertMessage } from '@/components/molecules';
import { Loader2, Mail } from 'lucide-react';
import { OTP_LENGTH, OTP_EXPIRY_SECONDS } from '@/lib/constants';

interface OtpVerificationFormProps {
  email?: string;
  onSubmit: (otp: string) => void;
  onResend?: () => void;
  isLoading?: boolean;
  isResending?: boolean;
  error?: string;
  className?: string;
}

export function OtpVerificationForm({
  email,
  onSubmit,
  onResend,
  isLoading = false,
  isResending = false,
  error,
  className,
}: OtpVerificationFormProps) {
  const [otp, setOtp] = React.useState('');
  const [timeLeft, setTimeLeft] = React.useState(OTP_EXPIRY_SECONDS);
  const [canResend, setCanResend] = React.useState(false);

  // Countdown timer
  React.useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === OTP_LENGTH) {
      onSubmit(otp);
    }
  };

  const handleResend = () => {
    if (onResend && canResend) {
      onResend();
      setTimeLeft(OTP_EXPIRY_SECONDS);
      setCanResend(false);
      setOtp('');
    }
  };

  // Auto-submit when OTP is complete
  React.useEffect(() => {
    if (otp.length === OTP_LENGTH && !isLoading) {
      onSubmit(otp);
    }
  }, [otp, isLoading, onSubmit]);

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Verify Your Email</CardTitle>
        <CardDescription>
          {email
            ? `We've sent a ${OTP_LENGTH}-digit code to ${email}`
            : `Enter the ${OTP_LENGTH}-digit code sent to your email`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <AlertMessage variant="error">
              {error}
            </AlertMessage>
          )}

          <OtpInput
            length={OTP_LENGTH}
            value={otp}
            onChange={setOtp}
            disabled={isLoading}
            error={!!error}
          />

          {/* Timer */}
          <div className="text-center">
            {timeLeft > 0 ? (
              <p className="text-sm text-muted-foreground">
                Code expires in{' '}
                <span className="font-medium text-foreground">
                  {formatTime(timeLeft)}
                </span>
              </p>
            ) : (
              <p className="text-sm text-destructive">
                Code has expired. Please request a new one.
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || otp.length !== OTP_LENGTH}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify Code
          </Button>

          {/* Resend option */}
          {onResend && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend || isResending}
                  className={cn(
                    'font-medium',
                    canResend && !isResending
                      ? 'text-primary hover:underline cursor-pointer'
                      : 'text-muted-foreground cursor-not-allowed'
                  )}
                >
                  {isResending ? 'Sending...' : 'Resend code'}
                </button>
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
