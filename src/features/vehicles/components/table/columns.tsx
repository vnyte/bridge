'use client';

import { ColumnDef } from '@tanstack/react-table';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Vehicle = {
  id: string;
  name: string;
  number: string;
  pucExpiry: string | null;
  insuranceExpiry: string | null;
  registrationExpiry: string | null;
  rent: number;
};

export const columns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'number',
    header: 'Number',
  },
  {
    accessorKey: 'rent',
    header: 'Rent',
  },
  {
    accessorKey: 'pucExpiry',
    header: 'PUC Expiry',
  },
  {
    accessorKey: 'insuranceExpiry',
    header: 'Insurance Expiry',
  },
  {
    accessorKey: 'registrationExpiry',
    header: 'Registration Expiry',
  },
];
