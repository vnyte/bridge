import { Suspense } from 'react';
import { VehicleDataTable } from './data-table';
import { columns } from './columns';
import { getVehicles } from '../../server/db';

export async function Vehicles({ searchParams }: { searchParams: { name: string } }) {
  const data = await getVehicles(searchParams.name);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VehicleDataTable columns={columns} data={data} />
    </Suspense>
  );
}
