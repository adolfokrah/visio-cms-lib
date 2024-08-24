import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from '../../lib/utils';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'visio-cms-z-[9999] visio-cms-text-xs visio-cms-font-regular visio-cms-w-72 visio-cms-rounded-md visio-cms-border visio-cms-border-dark-700 visio-cms-bg-popover visio-cms-p-4 visio-cms-text-popover-foreground visio-cms-shadow-md visio-cms-outline-none data-[state=open]:visio-cms-animate-in data-[state=closed]:visio-cms-animate-out data-[state=closed]:visio-cms-fade-out-0 data-[state=open]:visio-cms-fade-in-0 data-[state=closed]:visio-cms-zoom-out-95 data-[state=open]:visio-cms-zoom-in-95 data-[side=bottom]:visio-cms-slide-in-from-top-2 data-[side=left]:visio-cms-slide-in-from-right-2 data-[side=right]:visio-cms-slide-in-from-left-2 data-[side=top]:visio-cms-slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
