import * as React from 'react';
import { CaretSortIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import * as SelectPrimitive from '@radix-ui/react-select';

import { cn } from '../../lib/utils';

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'visio-cms-flex visio-cms-text-white visio-cms-h-9 visio-cms-w-full visio-cms-items-center visio-cms-justify-between visio-cms-whitespace-nowrap visio-cms-rounded-md visio-cms-border visio-cms-border-input visio-cms-bg-dark-900 visio-cms-px-3 visio-cms-py-2 visio-cms-text-xs visio-cms-shadow-sm placeholder:visio-cms-text-muted-foreground focus:visio-cms-outline-none  disabled:visio-cms-cursor-not-allowed disabled:visio-cms-opacity-50 [&>span]:visio-cms-line-clamp-1',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <CaretSortIcon className="visio-cms-h-4 visio-cms-w-4 visio-cms-opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'visio-cms-flex visio-cms-cursor-default visio-cms-items-center visio-cms-justify-center visio-cms-py-1',
      className,
    )}
    {...props}
  >
    <ChevronUpIcon />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'visio-cms-flex visio-cms-cursor-default visio-cms-items-center visio-cms-justify-center visio-cms-py-1',
      className,
    )}
    {...props}
  >
    <ChevronDownIcon />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'visio-cms-relative visio-cms-z-[9999] visio-cms-max-h-96 visio-cms-min-w-[8rem] visio-cms-overflow-hidden visio-cms-rounded-md visio-cms-border visio-cms-bg-dark-900 visio-cms-text-popover-foreground visio-cms-shadow-md data-[state=open]:visio-cms-animate-in data-[state=closed]:visio-cms-animate-out data-[state=closed]:visio-cms-fade-out-0 data-[state=open]:visio-cms-fade-in-0 data-[state=closed]:visio-cms-zoom-out-95 data-[state=open]:visio-cms-zoom-in-95 data-[side=bottom]:visio-cms-slide-in-from-top-2 data-[side=left]:visio-cms-slide-in-from-right-2 data-[side=right]:visio-cms-slide-in-from-left-2 data-[side=top]:visio-cms-slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:visio-cms-translate-y-1 data-[side=left]:visio-cms--translate-x-1 data-[side=right]:visio-cms-translate-x-1 data-[side=top]:visio-cms--translate-y-1',
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'visio-cms-p-1',
          position === 'popper' &&
            'visio-cms-h-[var(--radix-select-trigger-height)] visio-cms-w-full visio-cms-min-w-[var(--radix-select-trigger-width)]',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('visio-cms-px-2 visio-cms-py-1.5 visio-cms-text-xs visio-cms-font-regular', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'visio-cms-relative visio-cms-flex visio-cms-w-full visio-cms-cursor-default visio-cms-select-none visio-cms-items-center visio-cms-rounded-sm visio-cms-py-1.5 visio-cms-pl-2 visio-cms-pr-8 visio-cms-text-xs visio-cms-outline-none focus:visio-cms-bg-dark-800 focus:visio-cms-text-accent-foreground data-[disabled]:visio-cms-pointer-events-none data-[disabled]:visio-cms-opacity-50',
      className,
    )}
    {...props}
  >
    <span className="visio-cms-absolute visio-cms-right-2 visio-cms-flex visio-cms-h-3.5 visio-cms-w-3.5 visio-cms-items-center visio-cms-justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="visio-cms-h-4 visio-cms-w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('visio-cms--mx-1 visio-cms-my-1 visio-cms-h-px visio-cms-bg-muted', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
