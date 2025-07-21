import { Suspense } from 'react';
import { StaffDataTable } from './data-table';
import { columns } from './columns';
import { getStaff } from '@/server/db/staff';

export async function Staff({ name, role }: { name?: string; role?: string }) {
  const data = await getStaff(name, role);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StaffDataTable columns={columns} data={data} />
    </Suspense>
  );
}
