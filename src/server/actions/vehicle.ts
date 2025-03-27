'use server';

import { getVehicles as getVehiclesFromDB } from '@/server/db/vehicle';

export const getVehicles = async (name?: string) => {
  return getVehiclesFromDB(name);
};
