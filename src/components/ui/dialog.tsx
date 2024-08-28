import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';

import { cn } from '../../lib/utils';
import { Separator } from './separator';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'visio-cms-fixed visio-cms-inset-0 visio-cms-z-50 visio-cms-bg-dark-900 visio-cms-opacity-55 visio-cms- data-[state=open]:visio-cms-animate-in data-[state=closed]:visio-cms-animate-out data-[state=closed]:visio-cms-fade-out-0 data-[state=open]:visio-cms-fade-in-0',
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { onCloseButtonClicked?: () => void }
>(({ className, children, onCloseButtonClicked, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'visio-cms-fixed visio-cms-left-[50%] visio-cms-top-[50%] visio-cms-z-[50] visio-cms-grid visio-cms-w-full visio-cms-max-w-lg visio-cms-translate-x-[-50%] visio-cms-translate-y-[-50%] visio-cms-gap-4 visio-cms-border visio-cms-border-dark-700 visio-cms-bg-dark-800 visio-cms-p-6 visio-cms-shadow-none visio-cms-duration-200 data-[state=open]:visio-cms-animate-in data-[state=closed]:visio-cms-animate-out data-[state=closed]:visio-cms-fade-out-0 data-[state=open]:visio-cms-fade-in-0 data-[state=closed]:visio-cms-zoom-out-95 data-[state=open]:visio-cms-zoom-in-95 data-[state=closed]:visio-cms-slide-out-to-left-1/2 data-[state=closed]:visio-cms-slide-out-to-top-[48%] data-[state=open]:visio-cms-slide-in-from-left-1/2 data-[state=open]:visio-cms-slide-in-from-top-[48%] sm:visio-cms-rounded-lg',
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        onClick={onCloseButtonClicked}
        className=" visio-cms-text-white visio-cms-absolute visio-cms-right-4 visio-cms-top-4 visio-cms-rounded-sm visio-cms-opacity-70 visio-cms-ring-offset-background visio-cms-transition-opacity hover:visio-cms-opacity-100 focus:visio-cms-outline-none focus:visio-cms-ring-2 focus:visio-cms-ring-ring focus:visio-cms-ring-offset-2 disabled:visio-cms-pointer-events-none data-[state=open]:visio-cms-bg-accent data-[state=open]:visio-cms-text-muted-foreground"
      >
        <Cross2Icon className="visio-cms-h-4 visio-cms-w-4" />
        <span className="visio-cms-sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'visio-cms-flex visio-cms-flex-col visio-cms-space-y-1.5 visio-cms-text-center sm:visio-cms-text-left',
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'visio-cms-flex visio-cms-flex-col-reverse sm:visio-cms-flex-row sm:visio-cms-justify-end sm:visio-cms-space-x-2',
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'visio-cms-text-lg visio-cms-text-white visio-cms-font-semibold visio-cms-leading-none visio-cms-tracking-tight',
      className,
    )}
    {...props}
  >
    {props.children}
    <Separator className="visio-cms-bg-dark-700 visio-cms-my-4" />
  </DialogPrimitive.Title>
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('visio-cms-text-sm visio-cms-text-muted-foreground', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
