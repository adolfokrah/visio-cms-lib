import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

import { cn } from '../../lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'visio-cms-peer visio-cms-inline-flex visio-cms-h-5 visio-cms-w-9 visio-cms-shrink-0 visio-cms-cursor-pointer visio-cms-items-center visio-cms-rounded-full visio-cms-border-2 visio-cms-border-transparent visio-cms-shadow-sm visio-cms-transition-colors focus-visible:visio-cms-outline-none focus-visible:visio-cms-ring-2 focus-visible:visio-cms-ring-ring focus-visible:visio-cms-ring-offset-2 focus-visible:visio-cms-ring-offset-background disabled:visio-cms-cursor-not-allowed disabled:visio-cms-opacity-50 data-[state=checked]:visio-cms-bg-primary data-[state=unchecked]:visio-cms-bg-input',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'visio-cms-pointer-events-none visio-cms-block visio-cms-h-4 visio-cms-w-4 visio-cms-rounded-full visio-cms-bg-dark-700 visio-cms-shadow-lg visio-cms-ring-0 visio-cms-transition-transform data-[state=checked]:visio-cms-translate-x-4 data-[state=unchecked]:visio-cms-translate-x-0',
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
