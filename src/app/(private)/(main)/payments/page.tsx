import { TypographyH4 } from '@/components/ui/typography';
import { Payments } from '@/features/payments/components/table/payments';

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; paymentStatus?: string }>;
}) {
  const params = await searchParams;
  return (
    <div>
      <TypographyH4 data-testid="payments-page-heading">Payments</TypographyH4>
      <Payments name={params.name} paymentStatus={params.paymentStatus} />
    </div>
  );
}
