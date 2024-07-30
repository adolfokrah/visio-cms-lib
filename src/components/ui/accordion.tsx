import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';

import { cn } from '../../lib/utils';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('visio-cms-border-b visio-cms-border-dark-700', className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="visio-cms-flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'visio-cms-flex visio-cms-text-white visio-cms-flex-1 visio-cms-items-center visio-cms-justify-between visio-cms-py-4 visio-cms-text-xs visio-cms-font-regular visio-cms-transition-all [&[data-state=open]>svg]:visio-cms-rotate-180',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="visio-cms-h-4 visio-cms-w-4 visio-cms-shrink-0 visio-cms-text-muted-foreground visio-cms-transition-transform visio-cms-duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="visio-cms-overflow-hidden visio-cms-text-white visio-cms-text-xs data-[state=closed]:visio-cms-animate-accordion-up data-[state=open]:visio-cms-animate-accordion-down"
    {...props}
  >
    <div className={cn('visio-cms-pb-4 visio-cms-pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
