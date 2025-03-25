import { db } from '@/db';
import { CACHE_TAGS, dbCache, getUserTag } from '@/lib/cache';
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
    throw new Error('User not authenticated or not in an organization');
  }

  const cacheFn = dbCache(_getCurrentOrganizationBranchId, {
    tags: [getUserTag(userId, CACHE_TAGS.branch)],
  });

  return cacheFn(orgId);
};
