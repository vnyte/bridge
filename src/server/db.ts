import { db } from '@/db';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

export const getCurrentOrganizationBranchId = async () => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error('User not authenticated or not in an organization');
  }

  const branch = await db.query.BranchTable.findFirst({
    where: (table) => eq(table.orgId, orgId),
  });

  return branch?.id || null;
};
