'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TypographyH4 } from '@/components/ui/typography';
import { Plus } from 'lucide-react';
import { Suspense } from 'react';
import { StaffSearchBar } from './search-bar';

export function StaffHeader() {
  return (
    <div className="space-y-10">
      <TypographyH4>Staff</TypographyH4>
      <div className="flex justify-between items-center">
        <Suspense fallback={<div>Loading search...</div>}>
          <StaffSearchBar />
        </Suspense>
        <Link href="/staff/add">
          <Button>
            <Plus className="h-4 w-4" />
            Add Staff
          </Button>
        </Link>
      </div>
    </div>
  );
}
