import { cn } from '@/lib/utils';

type StatusType = 'online' | 'offline' | 'away' | 'busy' | 'success' | 'warning' | 'error';

interface StatusDotProps {
  status: StatusType;
  className?: string;
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusColors: Record<StatusType, string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-500',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};

const sizeClasses = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

export function StatusDot({
  status,
  className,
  pulse = false,
  size = 'md',
}: StatusDotProps) {
  return (
    <span className={cn('relative inline-flex', className)}>
      <span
        className={cn(
          'rounded-full',
          statusColors[status],
          sizeClasses[size]
        )}
      />
      {pulse && (
        <span
          className={cn(
            'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
            statusColors[status]
          )}
        />
      )}
    </span>
  );
}
