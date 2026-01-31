import * as React from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { rootRoute } from '../__root';
import { AuthLayout } from '@/components/templates';
import { LoginForm } from '@/components/organisms';
import { adminLogin } from '@/api/services/admin.service';
import { setSessionToken } from '@/stores/auth.store';
import type { AdminLoginCredentials } from '@/types';

export const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/login',
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | undefined>();

  const loginMutation = useMutation({
    mutationFn: adminLogin,
    onSuccess: (data) => {
      if (data.success) {
        // Store the session token for OTP verification
        setSessionToken(data.session_token);
        navigate({ to: '/admin/otp' });
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    },
    onError: (err: Error) => {
      setError(err.message || 'An error occurred. Please try again.');
    },
  });

  const handleSubmit = (data: Record<string, string>) => {
    setError(undefined);
    const credentials: AdminLoginCredentials = {
      username_or_email: data.username_or_email,
      password: data.password,
    };
    loginMutation.mutate(credentials);
  };

  return (
    <AuthLayout
      title="Admin Portal"
      subtitle="Enter your credentials to access the dashboard"
    >
      <LoginForm
        variant="admin"
        onSubmit={handleSubmit}
        isLoading={loginMutation.isPending}
        error={error}
      />
    </AuthLayout>
  );
}
