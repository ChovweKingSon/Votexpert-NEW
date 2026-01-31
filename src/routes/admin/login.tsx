import * as React from 'react';
import { createRoute, useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { rootRoute } from '../__root';
import { AuthLayout } from '@/components/templates';
import { LoginForm } from '@/components/organisms';
import { adminLogin } from '@/api/services/admin.service';
import { setTokens, setUser } from '@/stores/auth.store';
import type { AdminLoginCredentials, Admin } from '@/types';

function decodeJwtPayload(token: string): Admin | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return {
      admin_id: decoded.admin_id,
      username: decoded.username,
      email: decoded.email,
    };
  } catch {
    return null;
  }
}

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
        // Decode JWT to get admin info
        const admin = decodeJwtPayload(data.token);
        if (!admin) {
          setError('Failed to decode authentication token.');
          return;
        }

        // Store tokens and user info
        setTokens({ accessToken: data.token, refreshToken: '' });
        setUser(admin, 'admin');

        navigate({ to: '/admin/dashboard' });
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
      username: data.username_or_email,
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
