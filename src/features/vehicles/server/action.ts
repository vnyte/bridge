'use server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { getCurrentOrganizationBranchId } from '@/server/db';
import { addVehicle as addVehicleInDB } from './db';
import { ActionReturnType } from '@/types/actions';
import { vehicleFormSchema } from '../schemas/vehicles';
import { revalidatePath } from 'next/cache';

export async function addVehicle(unsafeData: z.infer<typeof vehicleFormSchema>): ActionReturnType {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return { error: true, message: 'User not authenticated or not in an organization' };
    }

    // Validate the data
    const { success, data } = vehicleFormSchema.safeParse(unsafeData);

    if (!success) {
      return { error: true, message: 'Invalid vehicle data' };
    }

    const branchId = await getCurrentOrganizationBranchId();

    if (!branchId) {
      return { error: true, message: 'Branch not found' };
    }

    await addVehicleInDB({
      ...data,
      branchId,
      orgId,
      createdBy: userId,
    });

    return {
      error: false,
      message: 'Vehicle added successfully',
    };
  } catch (error) {
    console.error('Error adding vehicle:', error);
    return {
      error: true,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
