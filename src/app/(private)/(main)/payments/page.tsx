import { Payments } from '@/features/payments/components/table/payments';

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; paymentStatus?: string }>;
}) {
  const params = await searchParams;
  return (
    <div>
      <Payments name={params.name} paymentStatus={params.paymentStatus} />
    </div>
  );
}
