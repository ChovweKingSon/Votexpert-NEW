import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 30 minutes
      gcTime: 30 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 3,
      // Delay between retries (exponential backoff)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for fresh data
      refetchOnWindowFocus: true,
      // Don't refetch on mount if data is fresh
      refetchOnMount: true,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
    },
  },
});

// Query keys factory for consistent key management (DRY)
export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },

  // Admin
  admin: {
    all: ['admin'] as const,
    profile: () => [...queryKeys.admin.all, 'profile'] as const,
  },

  // Voter
  voter: {
    all: ['voter'] as const,
    profile: () => [...queryKeys.voter.all, 'profile'] as const,
  },

  // Elections
  elections: {
    all: ['elections'] as const,
    lists: () => [...queryKeys.elections.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.elections.lists(), filters] as const,
    details: () => [...queryKeys.elections.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.elections.details(), id] as const,
    statistics: (id: string) =>
      [...queryKeys.elections.detail(id), 'statistics'] as const,
    candidates: (id: string) =>
      [...queryKeys.elections.detail(id), 'candidates'] as const,
    results: (id: string) =>
      [...queryKeys.elections.detail(id), 'results'] as const,
  },
} as const;
