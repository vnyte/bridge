'use client';

import { Combobox, ComboboxOption } from '@/components/ui/combobox';
import { cn } from '@/lib/utils';

const INDIAN_STATES: ComboboxOption[] = [
  { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
  { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh' },
  { value: 'Assam', label: 'Assam' },
  { value: 'Bihar', label: 'Bihar' },
  { value: 'Chhattisgarh', label: 'Chhattisgarh' },
  { value: 'Goa', label: 'Goa' },
  { value: 'Gujarat', label: 'Gujarat' },
  { value: 'Haryana', label: 'Haryana' },
  { value: 'Himachal Pradesh', label: 'Himachal Pradesh' },
  { value: 'Jharkhand', label: 'Jharkhand' },
  { value: 'Karnataka', label: 'Karnataka' },
  { value: 'Kerala', label: 'Kerala' },
  { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
  { value: 'Maharashtra', label: 'Maharashtra' },
  { value: 'Manipur', label: 'Manipur' },
  { value: 'Meghalaya', label: 'Meghalaya' },
  { value: 'Mizoram', label: 'Mizoram' },
  { value: 'Nagaland', label: 'Nagaland' },
  { value: 'Odisha', label: 'Odisha' },
  { value: 'Punjab', label: 'Punjab' },
  { value: 'Rajasthan', label: 'Rajasthan' },
  { value: 'Sikkim', label: 'Sikkim' },
  { value: 'Tamil Nadu', label: 'Tamil Nadu' },
  { value: 'Telangana', label: 'Telangana' },
  { value: 'Tripura', label: 'Tripura' },
  { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
  { value: 'Uttarakhand', label: 'Uttarakhand' },
  { value: 'West Bengal', label: 'West Bengal' },
  { value: 'Andaman and Nicobar Islands', label: 'Andaman and Nicobar Islands' },
  { value: 'Chandigarh', label: 'Chandigarh' },
  {
    value: 'Dadra and Nagar Haveli and Daman and Diu',
    label: 'Dadra and Nagar Haveli and Daman and Diu',
  },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Jammu and Kashmir', label: 'Jammu and Kashmir' },
  { value: 'Ladakh', label: 'Ladakh' },
  { value: 'Lakshadweep', label: 'Lakshadweep' },
  { value: 'Puducherry', label: 'Puducherry' },
];

interface StateSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export function StateSelect({
  value,
  onValueChange,
  placeholder = 'Select state...',
  error,
  className,
  disabled = false,
}: StateSelectProps) {
  return (
    <div className="w-full">
      <Combobox
        options={INDIAN_STATES}
        value={value}
        onValueChange={onValueChange}
        placeholder={placeholder}
        searchPlaceholder="Search states..."
        emptyText="No state found."
        className={cn(error && 'border-destructive focus:border-destructive', className)}
        disabled={disabled}
      />
      {error && <div className="text-sm text-destructive mt-1">{error}</div>}
    </div>
  );
}
