import { cn } from '@/lib/utils';
import { Vote } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
};

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
};

export function Logo({ className, size = 'md', showText = false }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'rounded-xl bg-primary/10 flex items-center justify-center',
          sizeClasses[size]
        )}
      >
        <Vote className={cn('text-primary', size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-7 h-7' : size === 'lg' ? 'w-9 h-9' : 'w-12 h-12')} />
      </div>
      {showText && (
        <span className={cn('font-bold text-primary', textSizeClasses[size])}>
          VoteXpert
        </span>
      )}
    </div>
  );
}
