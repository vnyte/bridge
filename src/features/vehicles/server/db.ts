import { db } from '@/db';
import { VehicleTable } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export const addVehicle = async (data: typeof VehicleTable.$inferInsert) => {
  const [vehicle] = await db.insert(VehicleTable).values(data).returning();

  return vehicle;
};

export const updateVehicle = async (id: string, data: typeof VehicleTable.$inferInsert) => {
  try {
    const [vehicle] = await db
      .update(VehicleTable)
      .set(data)
      .where(eq(VehicleTable.id, id))
      .returning();

    return vehicle;
  } catch (error) {
    console.log(error);
  }
};

export const deleteVehicle = async (id: string, branchId: string) => {
  try {
    const [vehicle] = await db
      .update(VehicleTable)
      .set({ deletedAt: new Date() })
      .where(and(eq(VehicleTable.id, id), eq(VehicleTable.branchId, branchId)))
      .returning();

    return vehicle;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
