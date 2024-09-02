'use client';

import * as React from 'react';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import { CheckIcon, ChevronRightIcon, DotFilledIcon } from '@radix-ui/react-icons';

import { cn } from '../../lib/utils';

const ContextMenu = ContextMenuPrimitive.Root;

const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

const ContextMenuGroup = ContextMenuPrimitive.Group;

const ContextMenuPortal = ContextMenuPrimitive.Portal;

const ContextMenuSub = ContextMenuPrimitive.Sub;

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'visio-cms-flex visio-cms-cursor-default visio-cms-select-none visio-cms-items-center visio-cms-rounded-sm visio-cms-px-2 visio-cms-py-1.5 visio-cms-text-sm visio-cms-outline-none focus:visio-cms-bg-accent focus:visio-cms-text-accent-foreground data-[state=open]:visio-cms-bg-accent data-[state=open]:visio-cms-text-accent-foreground',
      inset && 'visio-cms-pl-8',
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRightIcon className="visio-cms-ml-auto visio-cms-h-4 visio-cms-w-4" />
  </ContextMenuPrimitive.SubTrigger>
));
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'visio-cms-z-50 visio-cms-min-w-[8rem] visio-cms-overflow-hidden visio-cms-rounded-md visio-cms-border visio-cms-bg-popover visio-cms-p-1 visio-cms-text-popover-foreground visio-cms-shadow-lg data-[state=open]:visio-cms-animate-in data-[state=closed]:visio-cms-animate-out data-[state=closed]:visio-cms-fade-out-0 data-[state=open]:visio-cms-fade-in-0 data-[state=closed]:visio-cms-zoom-out-95 data-[state=open]:visio-cms-zoom-in-95 data-[side=bottom]:visio-cms-slide-in-from-top-2 data-[side=left]:visio-cms-slide-in-from-right-2 data-[side=right]:visio-cms-slide-in-from-left-2 data-[side=top]:visio-cms-slide-in-from-bottom-2',
      className,
    )}
    {...props}
  />
));
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        'visio-cms-z-50 visio-cms-min-w-[8rem] visio-cms-overflow-hidden visio-cms-rounded-md visio-cms-border visio-cms-bg-popover visio-cms-p-1 visio-cms-text-popover-foreground visio-cms-shadow-md data-[state=open]:visio-cms-animate-in data-[state=closed]:visio-cms-animate-out data-[state=closed]:visio-cms-fade-out-0 data-[state=open]:visio-cms-fade-in-0 data-[state=closed]:visio-cms-zoom-out-95 data-[state=open]:visio-cms-zoom-in-95 data-[side=bottom]:visio-cms-slide-in-from-top-2 data-[side=left]:visio-cms-slide-in-from-right-2 data-[side=right]:visio-cms-slide-in-from-left-2 data-[side=top]:visio-cms-slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      'visio-cms-relative visio-cms-flex visio-cms-cursor-default visio-cms-select-none visio-cms-items-center visio-cms-rounded-sm visio-cms-px-2 visio-cms-py-1.5 visio-cms-text-sm visio-cms-outline-none focus:visio-cms-bg-dark-700 focus:visio-cms-text-accent-foreground data-[disabled]:visio-cms-pointer-events-none data-[disabled]:visio-cms-opacity-50',
      inset && 'visio-cms-pl-8',
      className,
    )}
    {...props}
  />
));
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'visio-cms-relative visio-cms-flex visio-cms-cursor-default visio-cms-select-none visio-cms-items-center visio-cms-rounded-sm visio-cms-py-1.5 visio-cms-pl-8 visio-cms-pr-2 visio-cms-text-sm visio-cms-outline-none focus:visio-cms-bg-accent focus:visio-cms-text-accent-foreground data-[disabled]:visio-cms-pointer-events-none data-[disabled]:visio-cms-opacity-50',
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="visio-cms-absolute visio-cms-left-2 visio-cms-flex visio-cms-h-3.5 visio-cms-w-3.5 visio-cms-items-center visio-cms-justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <CheckIcon className="visio-cms-h-4 visio-cms-w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
));
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName;

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'visio-cms-relative visio-cms-flex visio-cms-cursor-default visio-cms-select-none visio-cms-items-center visio-cms-rounded-sm visio-cms-py-1.5 visio-cms-pl-8 visio-cms-pr-2 visio-cms-text-sm visio-cms-outline-none focus:visio-cms-bg-accent focus:visio-cms-text-accent-foreground data-[disabled]:visio-cms-pointer-events-none data-[disabled]:visio-cms-opacity-50',
      className,
    )}
    {...props}
  >
    <span className="visio-cms-absolute visio-cms-left-2 visio-cms-flex visio-cms-h-3.5 visio-cms-w-3.5 visio-cms-items-center visio-cms-justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <DotFilledIcon className="visio-cms-h-4 visio-cms-w-4 visio-cms-fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
));
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      'visio-cms-px-2 visio-cms-py-1.5 visio-cms-text-sm visio-cms-font-semibold visio-cms-text-foreground',
      inset && 'visio-cms-pl-8',
      className,
    )}
    {...props}
  />
));
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn('visio-cms--mx-1 visio-cms-my-1 visio-cms-h-px visio-cms-bg-border', className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'visio-cms-ml-auto visio-cms-text-xs visio-cms-tracking-widest visio-cms-text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
};
ContextMenuShortcut.displayName = 'ContextMenuShortcut';

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
