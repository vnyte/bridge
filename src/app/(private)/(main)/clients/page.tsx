import { Suspense } from 'react';
import { TypographyH4 } from '@/components/ui/typography';
import { ClientFilters } from '@/features/clients/components/filters';
import { Clients } from '@/features/clients/components/table/clients';

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; paymentStatus?: string; columns?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="space-y-10">
      <TypographyH4>Clients</TypographyH4>
      <Suspense fallback={<div>Loading filters...</div>}>
        <ClientFilters />
      </Suspense>
      <Clients name={params.name} paymentStatus={params.paymentStatus} />
    </div>
  );
}
