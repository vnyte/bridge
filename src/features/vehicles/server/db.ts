import { db } from '@/db';
import { VehicleTable } from '@/db/schema';
import { CACHE_TAGS, revalidateDbCache } from '@/lib/cache';
import { eq } from 'drizzle-orm';

export const addVehicle = async (data: typeof VehicleTable.$inferInsert) => {
  const [vehicle] = await db.insert(VehicleTable).values(data).returning();

  revalidateDbCache({
    tag: CACHE_TAGS.vehicles,
    branchId: data.branchId,
  });

  return vehicle;
};

export const updateVehicle = async (id: string, data: typeof VehicleTable.$inferInsert) => {
  try {
    const [vehicle] = await db
      .update(VehicleTable)
      .set(data)
      .where(eq(VehicleTable.id, id))
      .returning();

    revalidateDbCache({
      tag: CACHE_TAGS.vehicles,
      branchId: data.branchId,
    });

    revalidateDbCache({
      tag: CACHE_TAGS.vehicles,
      id: vehicle.id,
    });

    return vehicle;
  } catch (error) {
    console.log(error);
  }
};
