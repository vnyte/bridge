import { db } from '@/db';
import { VehicleTable } from '@/db/schema';
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

  return await _getVehicles(branchId, name);
};

const _getVehicle = async (id: string) => {
  const vehicle = await db.query.VehicleTable.findFirst({
    where: eq(VehicleTable.id, id),
  });

  return vehicle;
};

export const getVehicle = async (id: string) => {
  const { userId } = await auth();

  if (!userId || !id || id.trim() === '') {
    return null;
  }

  return await _getVehicle(id);
};

export type Vehicle = Awaited<ReturnType<typeof getVehicle>>;
