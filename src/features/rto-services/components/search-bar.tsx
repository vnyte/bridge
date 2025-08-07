'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQueryState } from 'nuqs';

export function RTOServiceSearchBar() {
  const [client, setClient] = useQueryState('client', { defaultValue: '' });

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search by client name, code, or phone..."
        value={client}
        onChange={(e) => setClient(e.target.value || null)}
        className="pl-10"
      />
    </div>
  );
}
