import * as React from 'react';

import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'visio-cms-flex visio-cms-h-9 visio-cms-w-full visio-cms-rounded-md visio-cms-border visio-cms-border-input visio-cms-bg-dark-900 visio-cms-px-3 visio-cms-py-1 visio-cms-text-xs visio-cms-font-regular visio-cms-shadow-sm visio-cms-transition-colors file:visio-cms-border-0 file:visio-cms-bg-transparent file:visio-cms-text-xs file:visio-cms-font-regular placeholder:visio-cms-text-muted-foreground focus-visible:visio-cms-outline-none  disabled:visio-cms-cursor-not-allowed disabled:visio-cms-opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
