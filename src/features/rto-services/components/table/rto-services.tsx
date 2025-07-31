import { Suspense } from 'react';
import { getRTOServices } from '../../server/db';
import { type RTOServiceStatus, type RTOServiceType } from '../../types';
import { DataTable } from './data-table';
import { columns } from './columns';
import { getCurrentOrganizationBranchId } from '@/server/db/branch';

type RTOServicesProps = {
  status?: string;
  serviceType?: string;
  client?: string;
};

export async function RTOServices({ status, serviceType, client }: RTOServicesProps) {
  const branchId = await getCurrentOrganizationBranchId();

  if (!branchId) {
    return <div>No branch found</div>;
  }

  const filters = {
    ...(status && { status: status as RTOServiceStatus }),
    ...(serviceType && { serviceType: serviceType as RTOServiceType }),
    ...(client && { client }),
  };

  const data = await getRTOServices(branchId, filters);

  return (
    <Suspense fallback={<div>Loading RTO services...</div>}>
      <DataTable columns={columns} data={data} />
    </Suspense>
  );
}
