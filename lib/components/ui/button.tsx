import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../utils';

const buttonVariants = cva(
  'visio-cms-inline-flex visio-cms-items-center visio-cms-justify-center visio-cms-whitespace-nowrap visio-cms-rounded-md visio-cms-text-sm visio-cms-font-medium visio-cms-transition-colors focus-visible:visio-cms-outline-none focus-visible:visio-cms-ring-1 focus-visible:visio-cms-ring-ring disabled:visio-cms-pointer-events-none disabled:visio-cms-opacity-50',
  {
    variants: {
      variant: {
        default:
          'visio-cms-bg-primary visio-cms-text-primary-foreground visio-cms-shadow hover:visio-cms-bg-primary/90',
        destructive:
          'visio-cms-bg-destructive visio-cms-text-destructive-foreground visio-cms-shadow-sm hover:visio-cms-bg-destructive/90',
        outline:
          'visio-cms-border visio-cms-border-input visio-cms-bg-background visio-cms-shadow-sm hover:visio-cms-bg-accent hover:visio-cms-text-accent-foreground',
        secondary:
          'visio-cms-bg-secondary visio-cms-text-secondary-foreground visio-cms-shadow-sm hover:visio-cms-bg-secondary/80',
        ghost: 'hover:visio-cms-bg-accent hover:visio-cms-text-accent-foreground',
        link: 'visio-cms-text-primary visio-cms-underline-offset-4 hover:visio-cms-underline',
      },
      size: {
        default: 'visio-cms-h-9 visio-cms-px-4 visio-cms-py-2',
        sm: 'visio-cms-h-8 visio-cms-rounded-md visio-cms-px-3 visio-cms-text-xs',
        lg: 'visio-cms-h-10 visio-cms-rounded-md visio-cms-px-8',
        icon: 'visio-cms-h-9 visio-cms-w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
