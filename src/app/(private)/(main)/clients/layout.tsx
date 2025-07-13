import { Suspense } from 'react';
import { TypographyH4 } from '@/components/ui/typography';
import { ClientFilters } from '@/features/clients/components/filters';

export default function ClientsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-10">
      <TypographyH4>Clients</TypographyH4>
      <Suspense fallback={<div>Loading filters...</div>}>
        <ClientFilters />
      </Suspense>
      {children}
    </div>
  );
}
