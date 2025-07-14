'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQueryState } from 'nuqs';

const paymentStatusOptions = [
  { value: 'ALL', label: 'All Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PARTIALLY_PAID', label: 'Partially Paid' },
  { value: 'FULLY_PAID', label: 'Fully Paid' },
  { value: 'OVERDUE', label: 'Overdue' },
];

export const PaymentFilters = () => {
  const [name, setName] = useQueryState('name', {
    shallow: false,
    throttleMs: 500,
  });

  const [paymentStatus, setPaymentStatus] = useQueryState('paymentStatus', {
    shallow: false,
    defaultValue: 'ALL',
  });

  return (
    <div className="flex gap-4">
      <Input
        value={name || ''}
        onChange={(e) => setName(e.target.value)}
        placeholder="Search by client name"
        className="w-96"
      />

      <Select
        value={paymentStatus || 'ALL'}
        onValueChange={(value) => setPaymentStatus(value === 'ALL' ? null : value)}
      >
        <SelectTrigger className="w-60">
          <SelectValue placeholder="Payment Status" />
        </SelectTrigger>
        <SelectContent>
          {paymentStatusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
