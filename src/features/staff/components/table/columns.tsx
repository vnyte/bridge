'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

export type Staff = {
  id: string;
  firstName: string;
  lastName: string;
  photo?: string | null;
  staffRole: 'instructor' | 'manager' | 'accountant';
  clerkRole: 'admin' | 'member';
  assignedVehicleId?: string | null;
  assignedVehicle?: {
    name: string;
    number: string;
  } | null;
  createdAt: Date;
};

const getStaffRoleBadge = (role: string) => {
  switch (role) {
    case 'instructor':
      return <Badge variant="default">Instructor</Badge>;
    case 'manager':
      return <Badge variant="secondary">Manager</Badge>;
    case 'accountant':
      return <Badge variant="outline">Accountant</Badge>;
    default:
      return <Badge variant="secondary">{role}</Badge>;
  }
};

const getClerkRoleBadge = (role: string) => {
  switch (role) {
    case 'admin':
      return <Badge variant="destructive">Admin</Badge>;
    case 'member':
      return <Badge variant="default">Member</Badge>;
    default:
      return <Badge variant="secondary">{role}</Badge>;
  }
};

export const columns: ColumnDef<Staff>[] = [
  {
    accessorKey: 'photo',
    header: 'Photo',
    cell: ({ row }) => {
      const { firstName, lastName, photo } = row.original;
      const initials = `${firstName[0]}${lastName[0]}`;
      return (
        <Avatar className="h-8 w-8">
          <AvatarImage src={photo || ''} alt={`${firstName} ${lastName}`} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const { firstName, lastName } = row.original;
      return `${firstName} ${lastName}`;
    },
  },
  {
    accessorKey: 'staffRole',
    header: 'Staff Role',
    cell: ({ row }) => {
      return getStaffRoleBadge(row.original.staffRole);
    },
  },
  {
    accessorKey: 'clerkRole',
    header: 'Access Level',
    cell: ({ row }) => {
      return getClerkRoleBadge(row.original.clerkRole);
    },
  },
  {
    accessorKey: 'assignedVehicle',
    header: 'Assigned Vehicle',
    cell: ({ row }) => {
      const vehicle = row.original.assignedVehicle;
      if (!vehicle) {
        return <span className="text-muted-foreground">-</span>;
      }
      return (
        <div className="space-y-1">
          <div className="font-medium">{vehicle.name}</div>
          <Badge variant="outline" className="text-xs">
            {vehicle.number}
          </Badge>
        </div>
      );
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
