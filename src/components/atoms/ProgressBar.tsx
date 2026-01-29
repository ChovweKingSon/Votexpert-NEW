import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const variantClasses = {
  default: 'bg-primary',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
};

export function ProgressBar({
  value,
  className,
  showLabel = false,
  size = 'md',
  variant = 'default',
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1 text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-foreground font-medium">{clampedValue}%</span>
        </div>
      )}
      <div
        className={cn('w-full bg-secondary rounded-full overflow-hidden', sizeClasses[size])}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            variantClasses[variant]
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
