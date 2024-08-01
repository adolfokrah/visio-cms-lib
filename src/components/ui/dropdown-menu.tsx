'use client';

import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { CheckIcon, ChevronRightIcon, DotFilledIcon } from '@radix-ui/react-icons';

import { cn } from '../../lib/utils';

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'visio-cms-flex visio-cms-cursor-default visio-cms-select-none visio-cms-items-center visio-cms-rounded-sm visio-cms-px-2 visio-cms-py-1.5 visio-cms-text-sm visio-cms-outline-none focus:visio-cms-bg-accent data-[state=open]:visio-cms-bg-accent',
      inset && 'visio-cms-pl-8',
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRightIcon className="visio-cms-ml-auto visio-cms-h-4 visio-cms-w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'visio-cms-z-50 visio-cms-min-w-[8rem] visio-cms-overflow-hidden visio-cms-rounded-md visio-cms-border visio-cms-bg-popover visio-cms-p-1 visio-cms-text-popover-foreground visio-cms-shadow-lg data-[state=open]:visio-cms-animate-in data-[state=closed]:visio-cms-animate-out data-[state=closed]:visio-cms-fade-out-0 data-[state=open]:visio-cms-fade-in-0 data-[state=closed]:visio-cms-zoom-out-95 data-[state=open]:visio-cms-zoom-in-95 data-[side=bottom]:visio-cms-slide-in-from-top-2 data-[side=left]:visio-cms-slide-in-from-right-2 data-[side=right]:visio-cms-slide-in-from-left-2 data-[side=top]:visio-cms-slide-in-from-bottom-2',
      className,
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'visio-cms-z-50 visio-cms-min-w-[8rem] visio-cms-overflow-hidden visio-cms-rounded-md visio-cms-border visio-cms-border-dark-700 visio-cms-bg-popover visio-cms-p-1 visio-cms-text-popover-foreground visio-cms-shadow-md',
        'data-[state=open]:visio-cms-animate-in data-[state=closed]:visio-cms-animate-out data-[state=closed]:visio-cms-fade-out-0 data-[state=open]:visio-cms-fade-in-0 data-[state=closed]:visio-cms-zoom-out-95 data-[state=open]:visio-cms-zoom-in-95 data-[side=bottom]:visio-cms-slide-in-from-top-2 data-[side=left]:visio-cms-slide-in-from-right-2 data-[side=right]:visio-cms-slide-in-from-left-2 data-[side=top]:visio-cms-slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'visio-cms-relative visio-cms-flex visio-cms-cursor-default visio-cms-select-none visio-cms-items-center visio-cms-rounded-sm visio-cms-px-2 visio-cms-py-1.5 visio-cms-text-xs visio-cms-outline-none visio-cms-transition-colors focus:visio-cms-bg-dark-700 focus:visio-cms-text-accent-foreground data-[disabled]:visio-cms-pointer-events-none data-[disabled]:visio-cms-opacity-50',
      inset && 'visio-cms-pl-8',
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'visio-cms-relative visio-cms-flex visio-cms-cursor-default visio-cms-select-none visio-cms-items-center visio-cms-rounded-sm visio-cms-py-1.5 visio-cms-pl-8 visio-cms-pr-2 visio-cms-text-sm visio-cms-outline-none visio-cms-transition-colors focus:visio-cms-bg-accent focus:visio-cms-text-accent-foreground data-[disabled]:visio-cms-pointer-events-none data-[disabled]:visio-cms-opacity-50',
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="visio-cms-absolute visio-cms-left-2 visio-cms-flex visio-cms-h-3.5 visio-cms-w-3.5 visio-cms-items-center visio-cms-justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <CheckIcon className="visio-cms-h-4 visio-cms-w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'visio-cms-relative visio-cms-flex visio-cms-cursor-default visio-cms-select-none visio-cms-items-center visio-cms-rounded-sm visio-cms-py-1.5 visio-cms-pl-8 visio-cms-pr-2 visio-cms-text-sm visio-cms-outline-none visio-cms-transition-colors focus:visio-cms-bg-accent focus:visio-cms-text-accent-foreground data-[disabled]:visio-cms-pointer-events-none data-[disabled]:visio-cms-opacity-50',
      className,
    )}
    {...props}
  >
    <span className="visio-cms-absolute visio-cms-left-2 visio-cms-flex visio-cms-h-3.5 visio-cms-w-3.5 visio-cms-items-center visio-cms-justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <DotFilledIcon className="visio-cms-h-4 visio-cms-w-4 visio-cms-fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'visio-cms-px-2 visio-cms-py-1.5 visio-cms-text-sm visio-cms-font-semibold',
      inset && 'visio-cms-pl-8',
      className,
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('visio-cms--mx-1 visio-cms-my-1 visio-cms-h-px visio-cms-bg-muted', className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('visio-cms-ml-auto visio-cms-text-xs visio-cms-tracking-widest visio-cms-opacity-60', className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
