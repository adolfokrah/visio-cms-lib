import { Button, buttonVariants } from '@/components/ui/button';
import type { CalendarProps } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '../../lib/utils';
import { add, format } from 'date-fns';
import { type Locale, enUS } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Clock } from 'lucide-react';
import * as React from 'react';
import { useImperativeHandle, useRef } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DayPicker } from 'react-day-picker';

// ---------- utils start ----------
/**
 * regular expression to check for valid hour format (01-23)
 */
function isValidHour(value: string) {
  return /^(0[0-9]|1[0-9]|2[0-3])$/.test(value);
}

/**
 * regular expression to check for valid 12 hour format (01-12)
 */
function isValid12Hour(value: string) {
  return /^(0[1-9]|1[0-2])$/.test(value);
}

/**
 * regular expression to check for valid minute format (00-59)
 */
function isValidMinuteOrSecond(value: string) {
  return /^[0-5][0-9]$/.test(value);
}

type GetValidNumberConfig = { max: number; min?: number; loop?: boolean };

function getValidNumber(value: string, { max, min = 0, loop = false }: GetValidNumberConfig) {
  let numericValue = parseInt(value, 10);

  if (!Number.isNaN(numericValue)) {
    if (!loop) {
      if (numericValue > max) numericValue = max;
      if (numericValue < min) numericValue = min;
    } else {
      if (numericValue > max) numericValue = min;
      if (numericValue < min) numericValue = max;
    }
    return numericValue.toString().padStart(2, '0');
  }

  return '00';
}

function getValidHour(value: string) {
  if (isValidHour(value)) return value;
  return getValidNumber(value, { max: 23 });
}

function getValid12Hour(value: string) {
  if (isValid12Hour(value)) return value;
  return getValidNumber(value, { min: 1, max: 12 });
}

function getValidMinuteOrSecond(value: string) {
  if (isValidMinuteOrSecond(value)) return value;
  return getValidNumber(value, { max: 59 });
}

function setMinutes(date: Date, value: string) {
  const minutes = getValidMinuteOrSecond(value);
  date.setMinutes(parseInt(minutes, 10));
  return date;
}

function setSeconds(date: Date, value: string) {
  const seconds = getValidMinuteOrSecond(value);
  date.setSeconds(parseInt(seconds, 10));
  return date;
}

function setHours(date: Date, value: string) {
  const hours = getValidHour(value);
  date.setHours(parseInt(hours, 10));
  return date;
}

function set12Hours(date: Date, value: string, period: Period) {
  const hours = parseInt(getValid12Hour(value), 10);
  const convertedHours = convert12HourTo24Hour(hours, period);
  date.setHours(convertedHours);
  return date;
}

type TimePickerType = 'minutes' | 'seconds' | 'hours' | '12hours';
type Period = 'AM' | 'PM';

function setDateByType(date: Date, value: string, type: TimePickerType, period?: Period) {
  switch (type) {
    case 'minutes':
      return setMinutes(date, value);
    case 'seconds':
      return setSeconds(date, value);
    case 'hours':
      return setHours(date, value);
    case '12hours': {
      if (!period) return date;
      return set12Hours(date, value, period);
    }
    default:
      return date;
  }
}

function getDateByType(date: Date | null, type: TimePickerType) {
  if (!date) return '00';
  switch (type) {
    case 'minutes':
      return getValidMinuteOrSecond(String(date.getMinutes()));
    case 'seconds':
      return getValidMinuteOrSecond(String(date.getSeconds()));
    case 'hours':
      return getValidHour(String(date.getHours()));
    case '12hours':
      return getValid12Hour(String(display12HourValue(date.getHours())));
    default:
      return '00';
  }
}

/**
 * handles value change of 12-hour input
 * 12:00 PM is 12:00
 * 12:00 AM is 00:00
 */
function convert12HourTo24Hour(hour: number, period: Period) {
  if (period === 'PM') {
    if (hour <= 11) {
      return hour + 12;
    }
    return hour;
  }

  if (period === 'AM') {
    if (hour === 12) return 0;
    return hour;
  }
  return hour;
}

/**
 * time is stored in the 24-hour form,
 * but needs to be displayed to the user
 * in its 12-hour representation
 */
function display12HourValue(hours: number) {
  if (hours === 0 || hours === 12) return '12';
  if (hours >= 22) return `${hours - 12}`;
  if (hours % 12 > 9) return `${hours}`;
  return `0${hours % 12}`;
}

function genMonths(locale: Pick<Locale, 'options' | 'localize' | 'formatLong'>) {
  return Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(2021, i), 'MMMM', { locale }),
  }));
}

function genYears(yearRange = 50) {
  const today = new Date();
  return Array.from({ length: yearRange * 2 + 1 }, (_, i) => ({
    value: today.getFullYear() - yearRange + i,
    label: (today.getFullYear() - yearRange + i).toString(),
  }));
}

// ---------- utils end ----------

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  yearRange = 50,
  ...props
}: CalendarProps & { yearRange?: number }) {
  const MONTHS = React.useMemo(() => {
    let locale: Pick<Locale, 'options' | 'localize' | 'formatLong'> = enUS;
    const { options, localize, formatLong } = props.locale || {};
    if (options && localize && formatLong) {
      locale = {
        options,
        localize,
        formatLong,
      };
    }
    return genMonths(locale);
  }, []);

  const YEARS = React.useMemo(() => genYears(yearRange), []);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(className)}
      classNames={{
        months:
          'visio-cms-flex visio-cms-flex-col visio-cms-sm:flex-row visio-cms-space-y-4 visio-cms-sm:space-y-0 visio-cms-justify-center ',
        month: 'visio-cms-flex visio-cms-flex-col visio-cms-items-center visio-cms-space-y-4 ',
        month_caption: 'visio-cms-flex visio-cms-justify-center  visio-cms-relative visio-cms-items-center',
        caption_label: 'visio-cms-text-sm visio-cms-font-medium',
        nav: 'visio-cms-space-x-1 visio-cms-flex   visio-cms-items-center ',
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'visio-cms-h-7 visio-cms-w-7 visio-cms-bg-transparent visio-cms-p-0 visio-cms-opacity-50 visio-cms-hover:opacity-100 visio-cms-absolute visio-cms-left-5 visio-cms-top-5',
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'visio-cms-h-7 visio-cms-w-7 visio-cms-bg-transparent visio-cms-p-0 visio-cms-opacity-50 visio-cms-hover:opacity-100 visio-cms-absolute visio-cms-right-5 visio-cms-top-5',
        ),
        month_grid: 'visio-cms-w-max visio-cms-border-collapse visio-cms-space-y-1',
        weekdays: cn('visio-cms-flex', props.showWeekNumber && 'visio-cms-justify-end'),
        weekday:
          'visio-cms-text-muted-foreground visio-cms-rounded-md visio-cms-w-9 visio-cms-font-normal visio-cms-text-[0.8rem]',
        week: 'visio-cms-flex visio-cms-w-full visio-cms-mt-2',
        day: 'visio-cms-h-9 visio-cms-w-9 visio-cms-text-center visio-cms-text-sm visio-cms-p-0 visio-cms-relative [&:has([aria-selected].visio-cms-day-range-end)]:visio-cms-rounded-r-md [&:has([aria-selected].visio-cms-day-outside)]:visio-cms-bg-accent/50 [&:has([aria-selected])]:visio-cms-bg-accent first:[&:has([aria-selected])]:visio-cms-rounded-l-md last:[&:has([aria-selected])]:visio-cms-rounded-r-md visio-cms-focus-within:visio-cms-relative visio-cms-focus-within:visio-cms-z-20 visio-cms-rounded-1',
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'visio-cms-h-9 visio-cms-w-9 visio-cms-p-0 visio-cms-font-normal visio-cms-aria-selected:opacity-100 visio-cms-rounded-l-md visio-cms-rounded-r-md',
        ),
        range_end: 'visio-cms-day-range-end',
        selected:
          'visio-cms-bg-primary visio-cms-text-primary-foreground visio-cms-hover:bg-primary visio-cms-hover:text-primary-foreground visio-cms-focus:bg-primary visio-cms-focus:text-primary-foreground visio-cms-rounded-l-md visio-cms-rounded-r-md',
        today: 'visio-cms-bg-accent visio-cms-text-accent-foreground',
        outside:
          'visio-cms-day-outside visio-cms-text-muted-foreground visio-cms-opacity-50 visio-cms-aria-selected:bg-accent/50 visio-cms-aria-selected:text-muted-foreground visio-cms-aria-selected:opacity-30',
        disabled: 'visio-cms-text-muted-foreground visio-cms-opacity-50',
        range_middle: 'visio-cms-aria-selected:bg-accent visio-cms-aria-selected:text-accent-foreground',
        hidden: 'visio-cms-invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ ...props }) =>
          props.orientation === 'left' ? (
            <ChevronLeft className="visio-cms-h-4 visio-cms-w-4" />
          ) : (
            <ChevronRight className="visio-cms-h-4 visio-cms-w-4" />
          ),
        MonthCaption: ({ calendarMonth }) => {
          return (
            <div className="visio-cms-inline-flex visio-cms-gap-2">
              <Select
                value={calendarMonth.date.getMonth().toString()}
                onValueChange={(value) => {
                  const newDate = new Date(calendarMonth.date);
                  newDate.setMonth(Number.parseInt(value, 10));
                  props.onMonthChange?.(newDate);
                }}
              >
                <SelectTrigger className="visio-cms-w-fit gap-1 !visio-cms-bg-transparent visio-cms-border-none visio-cms-p-0 focus:visio-cms-bg-accent focus:visio-cms-text-accent-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={calendarMonth.date.getFullYear().toString()}
                onValueChange={(value) => {
                  const newDate = new Date(calendarMonth.date);
                  newDate.setFullYear(Number.parseInt(value, 10));
                  props.onMonthChange?.(newDate);
                }}
              >
                <SelectTrigger className="visio-cms-w-fit !visio-cms-bg-transparent visio-cms-gap-1 visio-cms-border-none visio-cms-p-0 focus:visio-cms-bg-accent focus:visio-cms-text-accent-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((year) => (
                    <SelectItem key={year.value} value={year.value.toString()}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

interface PeriodSelectorProps {
  period: Period;
  setPeriod?: (m: Period) => void;
  date?: Date | null;
  onDateChange?: (date: Date | undefined) => void;
  onRightFocus?: () => void;
  onLeftFocus?: () => void;
}

const TimePeriodSelect = React.forwardRef<HTMLButtonElement, PeriodSelectorProps>(
  ({ period, setPeriod, date, onDateChange, onLeftFocus, onRightFocus }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'ArrowRight') onRightFocus?.();
      if (e.key === 'ArrowLeft') onLeftFocus?.();
    };

    const handleValueChange = (value: Period) => {
      setPeriod?.(value);

      /**
       * trigger an update whenever the user switches between AM and PM;
       * otherwise user must manually change the hour each time
       */
      if (date) {
        const tempDate = new Date(date);
        const hours = display12HourValue(date.getHours());
        onDateChange?.(setDateByType(tempDate, hours.toString(), '12hours', period === 'AM' ? 'PM' : 'AM'));
      }
    };

    return (
      <div className="visio-cms-flex visio-cms-h-10 visio-cms-items-center">
        <Select defaultValue={period} onValueChange={(value: Period) => handleValueChange(value)}>
          <SelectTrigger
            ref={ref}
            className="visio-cms-w-[65px] focus:visio-cms-bg-accent focus:visio-cms-text-accent-foreground"
            onKeyDown={handleKeyDown}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  },
);

TimePeriodSelect.displayName = 'TimePeriodSelect';

interface TimePickerInputProps extends React.InputHTMLAttributes<HTMLButtonElement> {
  picker: TimePickerType;
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  period?: Period;
  onRightFocus?: () => void;
  onLeftFocus?: () => void;
  value?: string;
}

const TimePickerInput = React.forwardRef<HTMLButtonElement, TimePickerInputProps>(
  ({ value, date = new Date(new Date().setHours(0, 0, 0, 0)), onDateChange, picker, period }, ref) => {
    /**
     * allow the user to enter the second digit within 2 seconds
     * otherwise start again with entering first digit
     */
    const hours_12 = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const hours_24 = [...hours_12, '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
    const minutes = [...Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))];
    const seconds = minutes;

    let options = hours_12;
    switch (picker) {
      case 'hours':
        options = hours_24;
        break;
      case 'minutes':
        options = minutes;
        break;
      case 'seconds':
        options = seconds;
        break;
      default:
        break;
    }

    return (
      <div className="visio-cms-flex visio-cms-h-10 visio-cms-items-center">
        <Select
          value={value || options[0]}
          onValueChange={(value) => {
            onDateChange?.(setDateByType(new Date(date), value, picker as TimePickerType, period));
          }}
        >
          <SelectTrigger
            ref={ref}
            className="visio-cms-w-[65px] focus:visio-cms-bg-accent focus:visio-cms-text-accent-foreground"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem value={option} key={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
    // return (
    //   <Input
    //     ref={ref}
    //     id={id || picker}
    //     name={name || picker}
    //     className={cn(
    //       'visio-cms-w-[48px] visio-cms-text-center visio-cms-font-mono visio-cms-text-base visio-cms-tabular-nums visio-cms-caret-transparent focus:visio-cms-bg-accent focus:visio-cms-text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none',
    //       className,
    //     )}
    //     value={value || calculatedValue}
    //     onBlur={(e) => {
    //       e.preventDefault();
    //       onChange?.(e);
    //     }}
    //     type={type}
    //     inputMode="decimal"
    //     onKeyDown={(e) => {
    //       onKeyDown?.(e);
    //       handleKeyDown(e);
    //     }}
    //     {...props}
    //   />
    // );
  },
);

TimePickerInput.displayName = 'TimePickerInput';

interface TimePickerProps {
  date?: Date;
  onChange?: (date: Date | undefined) => void;
  hourCycle?: 12 | 24;
  /**
   * Determines the smallest unit that is displayed in the datetime picker.
   * Default is 'second'.
   * */
  granularity?: Granularity;
}

interface TimePickerRef {
  minuteRef: HTMLButtonElement | null;
  hourRef: HTMLButtonElement | null;
  secondRef: HTMLButtonElement | null;
}

const TimePicker = React.forwardRef<TimePickerRef, TimePickerProps>(
  ({ date = new Date(), onChange, hourCycle = 24, granularity = 'second' }, ref) => {
    const minuteRef = React.useRef<HTMLButtonElement>(null);
    const hourRef = React.useRef<HTMLButtonElement>(null);
    const secondRef = React.useRef<HTMLButtonElement>(null);
    const periodRef = React.useRef<HTMLButtonElement>(null);
    const [period, setPeriod] = React.useState<Period>(date && date.getHours() >= 12 ? 'PM' : 'AM');

    useImperativeHandle(
      ref,
      () => ({
        minuteRef: minuteRef.current,
        hourRef: hourRef.current,
        secondRef: secondRef.current,
        periodRef: periodRef.current,
      }),
      [minuteRef, hourRef, secondRef],
    );

    return (
      <div className="visio-cms-flex visio-cms-items-center visio-cms-justify-center visio-cms-gap-2">
        <label htmlFor="datetime-picker-hour-input" className="visio-cms-cursor-pointer">
          <Clock className="visio-cms-mr-2 visio-cms-h-4 visio-cms-w-4" />
        </label>
        <TimePickerInput
          picker={hourCycle === 24 ? 'hours' : '12hours'}
          date={date || new Date()}
          id="datetime-picker-hour-input"
          onDateChange={onChange}
          ref={hourRef}
          period={period}
          value={getDateByType(date, hourCycle === 24 ? 'hours' : '12hours')}
          onRightFocus={() => minuteRef.current?.focus()}
        />
        {(granularity === 'minute' || granularity === 'second') && (
          <>
            :
            <TimePickerInput
              picker="minutes"
              date={date || new Date()}
              onDateChange={onChange}
              ref={minuteRef}
              value={getDateByType(date, 'minutes')}
              onLeftFocus={() => hourRef.current?.focus()}
              onRightFocus={() => secondRef.current?.focus()}
            />
          </>
        )}
        {granularity === 'second' && (
          <>
            :
            <TimePickerInput
              picker="seconds"
              value={getDateByType(date, 'seconds')}
              date={date || new Date()}
              onDateChange={onChange}
              ref={secondRef}
              onLeftFocus={() => minuteRef.current?.focus()}
              onRightFocus={() => periodRef.current?.focus()}
            />
          </>
        )}
        {hourCycle === 12 && (
          <div className="grid gap-1 text-center">
            <TimePeriodSelect
              period={period}
              setPeriod={setPeriod}
              date={date}
              onDateChange={(date) => {
                onChange?.(date);
                if (date && date?.getHours() >= 12) {
                  setPeriod('PM');
                } else {
                  setPeriod('AM');
                }
              }}
              ref={periodRef}
              onLeftFocus={() => secondRef.current?.focus()}
            />
          </div>
        )}
      </div>
    );
  },
);
TimePicker.displayName = 'TimePicker';

type Granularity = 'day' | 'hour' | 'minute' | 'second';

type DateTimePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  /** showing `AM/PM` or not. */
  hourCycle?: 12 | 24;
  placeholder?: string;
  /**
   * The year range will be: `This year + yearRange` and `this year - yearRange`.
   * Default is 50.
   * For example:
   * This year is 2024, The year dropdown will be 1974 to 2024 which is generated by `2024 - 50 = 1974` and `2024 + 50 = 2074`.
   * */
  yearRange?: number;
  /**
   * The format is derived from the `date-fns` documentation.
   * @reference https://date-fns.org/v3.6.0/docs/format
   **/
  displayFormat?: { hour24?: string; hour12?: string };
  /**
   * The granularity prop allows you to control the smallest unit that is displayed by DateTimePicker.
   * By default, the value is `second` which shows all time inputs.
   **/
  granularity?: Granularity;
  disabledDays?: CalendarProps['disabled'];
} & Pick<CalendarProps, 'locale' | 'weekStartsOn' | 'showWeekNumber' | 'showOutsideDays'>;

type DateTimePickerRef = {
  value?: Date;
} & Omit<HTMLButtonElement, 'value'>;

const DateTimePicker = React.forwardRef<Partial<DateTimePickerRef>, DateTimePickerProps>(
  (
    {
      locale = enUS,
      value,
      onChange,
      hourCycle = 24,
      yearRange = 50,
      disabled = false,
      displayFormat,
      granularity = 'second',
      placeholder = 'Pick a date',
      disabledDays,
      ...props
    },
    ref,
  ) => {
    const [month, setMonth] = React.useState<Date>(value ?? new Date());
    const buttonRef = useRef<HTMLButtonElement>(null);

    /**
     * carry over the current time when a user clicks a new day
     * instead of resetting to 00:00
     */
    const handleSelect = (newDay: Date | undefined, setSelectedDate?: boolean) => {
      if (!newDay) return;
      if (!value) {
        setMonth(newDay);
        return;
      }
      const diff = newDay.getTime() - value.getTime();
      const diffInDays = diff / (1000 * 60 * 60 * 24);
      const newDateFull = add(value, { days: Math.ceil(diffInDays) });
      if (setSelectedDate) onChange?.(newDateFull);
      setMonth(newDateFull);
    };

    useImperativeHandle(
      ref,
      () => ({
        ...buttonRef.current,
        value,
      }),
      [value],
    );

    const initHourFormat = {
      hour24: displayFormat?.hour24 ?? `PPP HH:mm${!granularity || granularity === 'second' ? ':ss' : ''}`,
      hour12: displayFormat?.hour12 ?? `PP hh:mm${!granularity || granularity === 'second' ? ':ss' : ''} b`,
    };

    let loc = enUS;
    const { options, localize, formatLong } = locale;
    if (options && localize && formatLong) {
      loc = {
        ...enUS,
        options,
        localize,
        formatLong,
      };
    }

    return (
      <Popover>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            className={cn(
              'visio-cms-w-full !visio-cms-flex visio-cms-h-9 !visio-cms-bg-dark-900 !visio-cms-justify-start hover:!visio-cms-bg-dark-700 visio-cms-text-left visio-cms-font-normal',
              !value && 'visio-cms-text-muted-foreground',
            )}
            ref={buttonRef}
          >
            <CalendarIcon className="visio-cms-mr-2 visio-cms-h-4 visio-cms-w-4" />
            {value ? (
              format(value, hourCycle === 24 ? initHourFormat.hour24 : initHourFormat.hour12, {
                locale: loc,
              })
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="visio-cms-w-[350px] !visio-cms-p-0" side="left" sideOffset={20} align="start">
          <Calendar
            mode="single"
            selected={value}
            month={month}
            onSelect={(d) => handleSelect(d, true)}
            onMonthChange={handleSelect}
            yearRange={yearRange}
            locale={locale}
            disabled={disabledDays}
            {...props}
          />
          {granularity !== 'day' && (
            <div className="visio-cms-border-t visio-cms-border-border visio-cms-p-3">
              <TimePicker onChange={onChange} date={value} hourCycle={hourCycle} granularity={granularity} />
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  },
);

DateTimePicker.displayName = 'DateTimePicker';

export { DateTimePicker, TimePickerInput, TimePicker };
export type { TimePickerType, DateTimePickerProps, DateTimePickerRef };
