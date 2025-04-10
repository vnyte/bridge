import { db } from '@/db';
import { VehicleTable } from '@/db/schema';
import { dbCache, getBranchTag, CACHE_TAGS, getIdTag } from '@/lib/cache';
import { auth } from '@clerk/nextjs/server';
import { eq, ilike, and } from 'drizzle-orm';
import { getCurrentOrganizationBranchId } from '@/server/db/branch';

const _getVehicles = async (branchId: string, name?: string) => {
  // Create a base condition for the organization
  const conditions = [eq(VehicleTable.branchId, branchId)];

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
    tags: [getBranchTag(branchId, CACHE_TAGS.vehicles)],
  });

  return await cacheFn(branchId, name);
};

const _getVehicle = async (id: string) => {
  const vehicle = await db.query.VehicleTable.findFirst({
    where: eq(VehicleTable.id, id),
  });

  return vehicle;
};

export const getVehicle = async (id: string) => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const cacheFn = dbCache(_getVehicle, {
    tags: [getIdTag(id, CACHE_TAGS.vehicles)],
  });

  return await cacheFn(id);
};

export type Vehicle = Awaited<ReturnType<typeof getVehicle>>;
