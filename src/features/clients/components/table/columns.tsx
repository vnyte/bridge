'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export type Client = {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  phoneNumber: string;
  email?: string | null;
  address: string;
  city: string;
  state: string;
  createdAt: Date;
  paymentStatus?: 'PENDING' | 'PARTIALLY_PAID' | 'FULLY_PAID' | null;
};

const getPaymentStatusBadge = (status?: string | null) => {
  if (!status) {
    return <Badge variant="secondary">No Payment</Badge>;
  }

  switch (status) {
    case 'PENDING':
      return <Badge variant="destructive">Pending</Badge>;
    case 'PARTIALLY_PAID':
      return <Badge variant="secondary">Partially Paid</Badge>;
    case 'FULLY_PAID':
      return <Badge variant="default">Fully Paid</Badge>;
    default:
      return <Badge variant="secondary">No Payment</Badge>;
  }
};

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const { firstName, middleName, lastName } = row.original;
      return `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`;
    },
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      return row.original.email || '-';
    },
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => {
      const { city, state } = row.original;
      return `${city}, ${state}`;
    },
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment Status',
    cell: ({ row }) => {
      return getPaymentStatusBadge(row.original.paymentStatus);
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined Date',
    cell: ({ row }) => {
      return format(new Date(row.original.createdAt), 'MMM dd, yyyy');
    },
  },
];
