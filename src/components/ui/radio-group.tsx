import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

import { cn } from '../../lib/utils';

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn('visio-cms-grid visio-cms-gap-2', className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'visio-cms-aspect-square  visio-cms-bg-white visio-cms-h-4 visio-cms-w-4 visio-cms-rounded-full  visio-cms-text-primary  focus:visio-cms-outline-none disabled:visio-cms-cursor-not-allowed disabled:visio-cms-opacity-50 visio-cms-grid visio-cms-place-items-center',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="visio-cms-grid visio-cms-items-center visio-cms-bg-primary visio-cms-rounded-full visio-cms-w-2 visio-cms-h-2" />
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
