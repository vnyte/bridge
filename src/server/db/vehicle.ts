import { db } from '@/db';
import { VehicleTable } from '@/db/schema';
import { dbCache, getUserTag, CACHE_TAGS } from '@/lib/cache';
import { auth } from '@clerk/nextjs/server';
import { eq, ilike, and } from 'drizzle-orm';
import { getCurrentOrganizationBranchId } from '@/server/db/branch';

const _getVehicles = async (orgId: string, name?: string) => {
  // Create a base condition for the organization
  const conditions = [eq(VehicleTable.branchId, orgId)];

  // Only add the name filter if name is defined and not empty
  if (name) {
    conditions.push(ilike(VehicleTable.name, `%${name}%`));
  }

  const vehicles = await db.query.VehicleTable.findMany({
    where: and(...conditions),
  });

  return vehicles;
};

export const getVehicles = async (name?: string) => {
  const { userId } = await auth();
  const branchId = await getCurrentOrganizationBranchId();

  if (!userId || !branchId) {
    return [];
  }

  const cacheFn = dbCache(_getVehicles, {
    tags: [getUserTag(userId, CACHE_TAGS.vehicles)],
  });

  return cacheFn(branchId, name);
};
