import { Vehicles } from '@/features/vehicles/components/table/vehicles';

export default function VehiclesPage({ searchParams }: { searchParams: { name: string } }) {
  return (
    <div>
      <Vehicles searchParams={searchParams} />
    </div>
  );
}
