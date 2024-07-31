import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const alertVariants = cva(
  'visio-cms-relative visio-cms-bg-dark-800 visio-cms-text-xs visio-cms-w-full visio-cms-rounded-lg visio-cms-border visio-cms-px-4 visio-cms-py-1 visio-cms-text-sm [&>svg+div]:visio-cms-translate-y-[-3px] [&>svg]:visio-cms-absolute [&>svg]:visio-cms-left-4 [&>svg]:visio-cms-top-4 [&>svg]:visio-cms-text-foreground [&>svg~*]:visio-cms-pl-7',
  {
    variants: {
      variant: {
        default: 'visio-cms-bg-background visio-cms-text-foreground',
        destructive: 'visio-cms-text-destructive  [&>svg]:visio-cms-text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn(
        'visio-cms-mb-1 visio-cms-text-xs visio-cms-font-medium visio-cms-leading-none visio-cms-tracking-tight',
        className,
      )}
      {...props}
    />
  ),
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('visio-cms-text-sm [&_p]:visio-cms-leading-relaxed', className)} {...props} />
  ),
);
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
