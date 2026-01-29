import { cn } from '@/lib/utils';

interface SeparatorProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

export function Separator({
  className,
  orientation = 'horizontal',
  label,
}: SeparatorProps) {
  if (label) {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground uppercase">{label}</span>
        <div className="flex-1 h-px bg-border" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
        className
      )}
    />
  );
}
