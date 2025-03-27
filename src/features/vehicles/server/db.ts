import { db } from '@/db';
import { VehicleTable } from '@/db/schema';
import { CACHE_TAGS, revalidateDbCache } from '@/lib/cache';

export const addVehicle = async (data: typeof VehicleTable.$inferInsert) => {
  const [vehicle] = await db.insert(VehicleTable).values(data).returning();

  revalidateDbCache({
    tag: CACHE_TAGS.vehicles,
    userId: data.createdBy,
  });

  return vehicle;
};
