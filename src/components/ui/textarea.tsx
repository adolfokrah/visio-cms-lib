import * as React from 'react';

import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'visio-cms-flex visio-cms-font-regular visio-cms-min-h-[60px] visio-cms-w-full visio-cms-rounded-md visio-cms-border visio-cms-border-input visio-cms-bg-dark-900 visio-cms-px-3 visio-cms-py-2 visio-cms-text-xs visio-cms-shadow-sm placeholder:visio-cms-text-muted-foreground focus-visible:visio-cms-outline-none disabled:visio-cms-cursor-not-allowed disabled:visio-cms-opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
