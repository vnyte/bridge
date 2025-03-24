import { db } from '@/db';
import { VehicleTable } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { and, eq, ilike } from 'drizzle-orm';

export const getVehicles = async (name?: string) => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return [];
  }

  const vehicles = await db.query.VehicleTable.findMany({
    where: and(eq(VehicleTable.orgId, orgId), ilike(VehicleTable.name, `%${name}%`)),
  });

  return vehicles;
};

export const addVehicle = async (data: typeof VehicleTable.$inferInsert) => {
  const [vehicle] = await db.insert(VehicleTable).values(data).returning();

  return vehicle;
};
