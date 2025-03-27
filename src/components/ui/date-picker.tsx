'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useController, Control, FieldPath, FieldValues } from 'react-hook-form';

type DatePickerProps<TFieldValues extends FieldValues = FieldValues> = {
  selected?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholderText?: string;
  disabled?: (date: Date) => boolean;
  name?: string;
  control?: Control<TFieldValues>;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
};

export function DatePicker<TFieldValues extends FieldValues = FieldValues>({
  selected,
  onChange,
  placeholderText = 'Select date',
  disabled,
  name,
  control,
  className,
  minDate = new Date('1900-01-01'),
  maxDate = new Date(),
}: DatePickerProps<TFieldValues>) {
  // Create a date filter function that combines the provided disabled function with min/max date constraints
  const dateFilter = React.useCallback(
    (date: Date) => {
      if (date < minDate || date > maxDate) return true;
      return disabled ? disabled(date) : false;
    },
    [disabled, minDate, maxDate]
  );

  // If control and name are provided, use react-hook-form
  if (control && name) {
    return (
      <ControlledDatePicker
        name={name as FieldPath<TFieldValues>}
        control={control}
        placeholderText={placeholderText}
        disabled={disabled}
        className={className}
        minDate={minDate}
        maxDate={maxDate}
      />
    );
  }

  // Otherwise, use as an uncontrolled component
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full pl-3 text-left font-normal',
            !selected && 'text-muted-foreground',
            className
          )}
        >
          {selected ? format(selected, 'PPP') : <span>{placeholderText}</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="single"
          selected={selected as Date | undefined}
          onSelect={onChange as (date: Date | undefined) => void}
          disabled={dateFilter}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

// Controlled version for react-hook-form
function ControlledDatePicker<TFieldValues extends FieldValues>({
  name,
  control,
  placeholderText,
  disabled,
  className,
  minDate,
  maxDate,
}: Omit<DatePickerProps<TFieldValues>, 'selected' | 'onChange'> & {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
}) {
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
  });

  // Create a date filter function that combines the provided disabled function with min/max date constraints
  const dateFilter = React.useCallback(
    (date: Date) => {
      if (date < (minDate || new Date('1900-01-01')) || date > (maxDate || new Date())) return true;
      return disabled ? disabled(date) : false;
    },
    [disabled, minDate, maxDate]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full pl-3 text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          {value ? format(value, 'PPP') : <span>{placeholderText}</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="single"
          selected={value as Date | undefined}
          onSelect={onChange as (date: Date | undefined) => void}
          disabled={dateFilter}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
