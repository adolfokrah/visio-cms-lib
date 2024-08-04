import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

export default function CodeTag(props: ComponentProps<'code'>) {
  const { children, className, ...restProps } = props;
  return (
    <code
      className={cn(
        'visio-cms-bg-dark-900 visio-cms-p-1 visio-cms-rounded-lg visio-cms-border visio-cms-border-dark-700',
        className,
      )}
      {...restProps}
    >
      {children}
    </code>
  );
}
