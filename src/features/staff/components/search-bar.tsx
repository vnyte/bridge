'use client';
import { Input } from '@/components/ui/input';
import { useQueryState } from 'nuqs';

export const StaffSearchBar = () => {
  const [name, setName] = useQueryState('name', {
    shallow: false,
    throttleMs: 500,
  });

  return (
    <Input
      value={name || ''}
      onChange={(e) => setName(e.target.value)}
      placeholder="Search staff"
      className="w-60"
    />
  );
};
