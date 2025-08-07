'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQueryState } from 'nuqs';
import { RTO_SERVICE_STATUS_LABELS } from '../types';

export function RTOServiceStatusFilter() {
  const [status, setStatus] = useQueryState('status', {
    shallow: false,
    defaultValue: 'all',
  });

  return (
    <Select
      value={status ?? 'all'}
      onValueChange={(value) => setStatus(value === 'all' ? null : value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {Object.entries(RTO_SERVICE_STATUS_LABELS).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
