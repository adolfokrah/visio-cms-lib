import { cn } from '../../lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('visio-cms-animate-pulse visio-cms-rounded-md visio-cms-bg-dark-700', className)} {...props} />
  );
}

export { Skeleton };
