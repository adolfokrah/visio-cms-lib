import * as React from 'react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('visio-cms-p-3', className)}
      classNames={{
        months:
          'visio-cms-flex visio-cms-flex-col sm:visio-cms-flex-row visio-cms-space-y-4 sm:visio-cms-space-x-4 sm:visio-cms-space-y-0',
        month: 'visio-cms-space-y-4',
        caption: 'visio-cms-flex visio-cms-justify-center visio-cms-pt-1 visio-cms-relative visio-cms-items-center',
        caption_label: 'visio-cms-text-sm visio-cms-font-medium',
        nav: 'visio-cms-space-x-1 visio-cms-flex visio-cms-items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'visio-cms-h-7 visio-cms-w-7 visio-cms-bg-transparent visio-cms-p-0 visio-cms-opacity-50 hover:visio-cms-opacity-100',
        ),
        nav_button_previous: 'visio-cms-absolute visio-cms-left-1',
        nav_button_next: 'visio-cms-absolute visio-cms-right-1',
        table: 'visio-cms-w-full visio-cms-border-collapse visio-cms-space-y-1',
        head_row: 'visio-cms-flex',
        head_cell:
          'visio-cms-text-muted-foreground visio-cms-rounded-md visio-cms-w-8 visio-cms-font-normal visio-cms-text-[0.8rem]',
        row: 'visio-cms-flex visio-cms-w-full visio-cms-mt-2',
        cell: cn(
          'visio-cms-relative visio-cms-p-0 visio-cms-text-center visio-cms-text-sm focus-within:visio-cms-relative focus-within:visio-cms-z-20 [&:has([aria-selected])]:visio-cms-bg-accent [&:has([aria-selected].day-outside)]:visio-cms-bg-accent/50 [&:has([aria-selected].day-range-end)]:visio-cms-rounded-r-md',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:visio-cms-rounded-r-md [&:has(>.day-range-start)]:visio-cms-rounded-l-md first:[&:has([aria-selected])]:visio-cms-rounded-l-md last:[&:has([aria-selected])]:visio-cms-rounded-r-md'
            : '[&:has([aria-selected])]:visio-cms-rounded-md',
        ),
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'visio-cms-h-8 visio-cms-w-8 visio-cms-p-0 visio-cms-font-normal aria-selected:visio-cms-opacity-100 hover:!visio-cms-bg-dark-700',
        ),
        day_range_start: 'visio-cms-day-range-start',
        day_range_end: 'visio-cms-day-range-end',
        day_selected:
          'visio-cms-bg-dark-900 visio-cms-text-primary-foreground hover:visio-cms-bg-dark-900 hover:visio-cms-text-primary-foreground focus:visio-cms-bg-dark-900 focus:visio-cms-text-primary-foreground',
        day_today: 'visio-cms-bg-dark-700 visio-cms-text-accent-foreground',
        day_outside:
          'visio-cms-day-outside visio-cms-text-muted-foreground visio-cms-opacity-50 visio-cms- aria-selected:visio-cms-bg-accent/50 aria-selected:visio-cms-text-muted-foreground aria-selected:visio-cms-opacity-30',
        day_disabled: 'visio-cms-text-muted-foreground visio-cms-opacity-50',
        day_range_middle: 'aria-selected:visio-cms-bg-accent aria-selected:visio-cms-text-accent-foreground',
        day_hidden: 'visio-cms-invisible',
        ...classNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
