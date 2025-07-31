import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { TypographyH4 } from '@/components/ui/typography';
import { RTOServiceSearchBar } from '@/features/rto-services/components/search-bar';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function RTOServicesTableLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-10">
      <TypographyH4>RTO Services</TypographyH4>
      <div className="flex justify-between items-center">
        <Suspense fallback={<div>Loading search...</div>}>
          <RTOServiceSearchBar />
        </Suspense>
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
