'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function DatePicker({
  onSelect,
  selectedDate,
}: {
  onSelect: (date: Date) => void;
  selectedDate: Date | undefined;
}) {
  const [date, setDate] = React.useState<Date | undefined>(selectedDate);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'visio-cms-w-full !visio-cms-justify-start visio-cms-font-regular !visio-cms-bg-dark-900',
            !date && 'visio-cms-text-muted-foreground',
          )}
        >
          <CalendarIcon className="visio-cms-mr-2 visio-cms-h-4 visio-cms-w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="visio-cms-w-auto visio-cms-p-0" side="left" align="start" sideOffset={20}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            setDate(d);
            if (d) onSelect(d);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
