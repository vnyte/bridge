import { RTOServices } from '@/features/rto-services/components/table/rto-services';

export default async function RTOServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; serviceType?: string; client?: string }>;
}) {
  const params = await searchParams;
  return (
    <div>
      <RTOServices status={params.status} serviceType={params.serviceType} client={params.client} />
    </div>
  );
}
