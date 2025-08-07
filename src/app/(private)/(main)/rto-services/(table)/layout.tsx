import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { TypographyH4 } from '@/components/ui/typography';
import { RTOServiceSearchBar } from '@/features/rto-services/components/search-bar';
import { RTOServiceStatusFilter } from '@/features/rto-services/components/status-filter';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function RTOServicesTableLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-10">
      <TypographyH4>RTO Services</TypographyH4>
      <div className="flex justify-between items-center">
        <div className="grid grid-cols-12 gap-4 items-center w-full">
          <div className="col-span-4">
            <Suspense fallback={<div>Loading search...</div>}>
              <RTOServiceSearchBar />
            </Suspense>
          </div>
          <div className="col-span-3">
            <Suspense fallback={<div>Loading filter...</div>}>
              <RTOServiceStatusFilter />
            </Suspense>
          </div>
        </div>
        <Link href="/rto-services/add">
          <Button>
            <Plus className="h-4 w-4" />
            Add RTO Service
          </Button>
        </Link>
      </div>
      {children}
    </div>
  );
}
