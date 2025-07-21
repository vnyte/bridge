import { Staff } from '@/features/staff/components/table/staff';

export default async function StaffTablePage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; role?: string }>;
}) {
  const params = await searchParams;
  return <Staff name={params.name} role={params.role} />;
}
