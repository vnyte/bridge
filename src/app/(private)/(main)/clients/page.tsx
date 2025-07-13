import { Clients } from '@/features/clients/components/table/clients';

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; paymentStatus?: string; columns?: string }>;
}) {
  const params = await searchParams;
  return (
    <div>
      <Clients name={params.name} paymentStatus={params.paymentStatus} />
    </div>
  );
}
