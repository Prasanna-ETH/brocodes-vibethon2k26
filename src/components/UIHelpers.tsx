import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({ icon, title, description, action, className }: EmptyStateProps) => (
  <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
    <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4 text-muted-foreground">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
    {action}
  </div>
);

export const CardSkeleton = ({ className }: { className?: string }) => (
  <div className={cn('glass rounded-xl p-4 space-y-3', className)}>
    <div className="flex items-center gap-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <div className="flex gap-3">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-32 hidden md:block" />
        <Skeleton className="h-8 w-16 ml-auto" />
      </div>
    ))}
  </div>
);

export const MapSkeleton = ({ className }: { className?: string }) => (
  <div className={cn('rounded-xl overflow-hidden border border-border bg-muted/30', className)}>
    <div className="flex items-center justify-center h-full min-h-[300px]">
      <div className="text-center">
        <Skeleton className="w-12 h-12 rounded-full mx-auto mb-3" />
        <Skeleton className="h-4 w-32 mx-auto mb-2" />
        <Skeleton className="h-3 w-24 mx-auto" />
      </div>
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="glass rounded-xl p-4">
    <Skeleton className="w-6 h-6 mb-3" />
    <Skeleton className="h-8 w-16 mb-2" />
    <Skeleton className="h-3 w-24" />
  </div>
);
