import { Vehicles } from '@/features/vehicles/components/table/vehicles';

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<{ name: string }>;
}) {
  const params = await searchParams;
  return (
    <div>
      <Vehicles name={params.name} />
    </div>
  );
}
