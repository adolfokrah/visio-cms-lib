import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const toggleVariants = cva(
  'visio-cms-inline-flex visio-cms-items-center visio-cms-justify-center visio-cms-rounded-md visio-cms-text-sm visio-cms-font-medium visio-cms-transition-colors hover:visio-cms-bg-muted hover:visio-cms-text-muted-foreground focus-visible:visio-cms-outline-none focus-visible:visio-cms-ring-1 focus-visible:visio-cms-ring-ring disabled:visio-cms-pointer-events-none disabled:visio-cms-opacity-50 data-[state=on]:visio-cms-bg-dark-800 data-[state=on]:visio-cms-text-accent-foreground',
  {
    variants: {
      variant: {
        default: 'visio-cms-bg-transparent',
        outline:
          'visio-cms-border visio-cms-border-input visio-cms-bg-transparent visio-cms-shadow-sm hover:visio-cms-bg-accent hover:visio-cms-text-accent-foreground',
      },
      size: {
        default: 'visio-cms-h-9 visio-cms-px-3',
        sm: 'visio-cms-h-8 visio-cms-px-2',
        lg: 'visio-cms-h-10 visio-cms-px-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root ref={ref} className={cn(toggleVariants({ variant, size, className }))} {...props} />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
