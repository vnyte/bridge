import { db } from '@/db';
import { VehicleTable } from '@/db/schema';
import { CACHE_TAGS, dbCache, getUserTag, revalidateDbCache } from '@/lib/cache';
import { auth } from '@clerk/nextjs/server';
import { and, eq, ilike } from 'drizzle-orm';

const _getVehicles = async (orgId: string, name?: string) => {
  // Create a base condition for the organization
  const conditions = [eq(VehicleTable.orgId, orgId)];

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
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return [];
  }

  const cacheFn = dbCache(_getVehicles, {
    tags: [getUserTag(userId, CACHE_TAGS.vehicles)],
  });

  return cacheFn(orgId, name);
};

export const addVehicle = async (data: typeof VehicleTable.$inferInsert) => {
  const [vehicle] = await db.insert(VehicleTable).values(data).returning();

  revalidateDbCache({
    tag: CACHE_TAGS.vehicles,
    userId: data.createdBy,
  });

  return vehicle;
};
