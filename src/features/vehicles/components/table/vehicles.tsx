import { Suspense } from 'react';
import { VehicleDataTable } from './data-table';
import { columns } from './columns';
import { getVehicles } from '@/server/db/vehicle';

export async function Vehicles({ name }: { name?: string }) {
  const data = await getVehicles(name);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VehicleDataTable columns={columns} data={data} />
    </Suspense>
  );
}
