import { db } from '@/db';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

export const _getCurrentOrganizationBranchId = async (orgId: string) => {
  const branch = await db.query.BranchTable.findFirst({
    where: (table) => eq(table.orgId, orgId),
  });

  return branch?.id || null;
};

export const getCurrentOrganizationBranchId = async () => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return null;
  }

  return _getCurrentOrganizationBranchId(orgId);
};

const _getCurrentOrganizationBranch = async (orgId: string) => {
  const branch = await db.query.BranchTable.findFirst({
    where: (table) => eq(table.orgId, orgId),
  });

  return branch || null;
};

export const getCurrentOrganizationBranch = async () => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return null;
  }

  return _getCurrentOrganizationBranch(orgId);
};

export const getCurrentOrganizationTenantId = async () => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return null;
  }

  const branch = await _getCurrentOrganizationBranch(orgId);
  return branch?.tenantId || null;
};
