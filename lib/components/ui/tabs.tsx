import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '../../utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'visio-cms-inline-flex visio-cms-h-10 visio-cms-items-center visio-cms-justify-center visio-cms-rounded-lg visio-cms-bg-dark-900 visio-cms-p-1 visio-cms-text-muted-foreground',
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'visio-cms-inline-flex  visio-cms-items-center visio-cms-justify-center visio-cms-whitespace-nowrap visio-cms-rounded-md visio-cms-px-3 visio-cms-py-2 visio-cms-text-xs visio-cms-font-regular visio-cms-ring-offset-background visio-cms-transition-all focus-visible:visio-cms-outline-none focus-visible:visio-cms-ring-2 focus-visible:visio-cms-ring-ring focus-visible:visio-cms-ring-offset-2 disabled:visio-cms-pointer-events-none disabled:visio-cms-opacity-50 data-[state=active]:visio-cms-bg-dark-800 data-[state=active]:visio-cms-text-foreground data-[state=active]:visio-cms-shadow',
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'visio-cms-mt-2 visio-cms-ring-offset-background focus-visible:visio-cms-outline-none focus-visible:visio-cms-ring-2 focus-visible:visio-cms-ring-ring focus-visible:visio-cms-ring-offset-2',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
