import { cn } from '@/lib/utils';
import { StatCard } from '@/components/molecules';
import { Skeleton } from '@/components/atoms';
import { Users, Vote, BarChart3, Calendar, type LucideIcon } from 'lucide-react';

interface StatItem {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface DashboardStatsProps {
  stats: StatItem[];
  isLoading?: boolean;
  className?: string;
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-6 border rounded-lg space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardStats({
  stats,
  isLoading = false,
  className,
}: DashboardStatsProps) {
  if (isLoading) {
    return <StatsSkeleton />;
  }

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          description={stat.description}
          trend={stat.trend}
        />
      ))}
    </div>
  );
}

// Pre-configured dashboard stats for common use cases
interface ElectionDashboardStatsProps {
  totalElections: number;
  activeElections: number;
  totalVoters: number;
  totalVotesCast: number;
  isLoading?: boolean;
  className?: string;
}

export function ElectionDashboardStats({
  totalElections,
  activeElections,
  totalVoters,
  totalVotesCast,
  isLoading = false,
  className,
}: ElectionDashboardStatsProps) {
  const stats: StatItem[] = [
    {
      label: 'Total Elections',
      value: totalElections,
      icon: Calendar,
    },
    {
      label: 'Active Elections',
      value: activeElections,
      icon: Vote,
      description: activeElections > 0 ? 'In progress' : 'None active',
    },
    {
      label: 'Registered Voters',
      value: totalVoters,
      icon: Users,
    },
    {
      label: 'Total Votes Cast',
      value: totalVotesCast,
      icon: BarChart3,
    },
  ];

  return (
    <DashboardStats stats={stats} isLoading={isLoading} className={className} />
  );
}
