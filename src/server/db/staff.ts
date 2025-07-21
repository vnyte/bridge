import { db } from '@/db';
import { StaffTable, StaffRoleEnum } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, ilike, and, desc, or } from 'drizzle-orm';
import { getCurrentOrganizationBranchId } from '@/server/db/branch';

const _getStaff = async (branchId: string, name?: string, role?: string | 'ALL') => {
  const conditions = [eq(StaffTable.branchId, branchId)];

  if (name) {
    conditions.push(
      or(ilike(StaffTable.firstName, `%${name}%`), ilike(StaffTable.lastName, `%${name}%`))!
    );
  }

  if (role && role !== 'ALL') {
    conditions.push(eq(StaffTable.staffRole, role as (typeof StaffRoleEnum.enumValues)[number]));
  }

  const staff = await db.query.StaffTable.findMany({
    where: and(...conditions),
    with: {
      assignedVehicle: {
        columns: {
          name: true,
          number: true,
        },
      },
    },
    orderBy: [desc(StaffTable.createdAt)],
  });

  return staff;
};

export const getStaff = async (name?: string, role?: string | 'ALL') => {
  const { userId } = await auth();
  const branchId = await getCurrentOrganizationBranchId();

  if (!userId || !branchId) {
    return [];
  }

  return await _getStaff(branchId, name, role);
};

const _getStaffMember = async (id: string, branchId: string) => {
  const staff = await db.query.StaffTable.findFirst({
    where: and(eq(StaffTable.id, id), eq(StaffTable.branchId, branchId)),
    with: {
      assignedVehicle: true,
    },
  });

  return staff;
};

export const getStaffMember = async (id: string) => {
  const { userId } = await auth();
  const branchId = await getCurrentOrganizationBranchId();

  if (!userId || !branchId) {
    return null;
  }

  return await _getStaffMember(id, branchId);
};

export type Staff = Awaited<ReturnType<typeof getStaff>>[0];
export type StaffDetail = Awaited<ReturnType<typeof getStaffMember>>;
