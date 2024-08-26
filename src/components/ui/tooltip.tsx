import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '../../lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'visio-cms-z-50  visio-cms-relative visio-cms-rounded-md visio-cms-bg-blue-500 visio-cms-px-3 visio-cms-py-1.5 visio-cms-text-xs visio-cms-text-primary-foreground visio-cms-animate-in visio-cms-fade-in-0 visio-cms-zoom-in-95 data-[state=closed]:visio-cms-animate-out data-[state=closed]:visio-cms-fade-out-0 data-[state=closed]:visio-cms-zoom-out-95 data-[side=bottom]:visio-cms-slide-in-from-top-2 data-[side=left]:visio-cms-slide-in-from-right-2 data-[side=right]:visio-cms-slide-in-from-left-2 data-[side=top]:visio-cms-slide-in-from-bottom-2',
      className,
    )}
    {...props}
  >
    {props.children}
    <TooltipPrimitive.Arrow className="visio-cms-fill-blue-500" />
  </TooltipPrimitive.Content>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
