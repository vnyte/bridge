'use server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import {
  addVehicle as addVehicleInDB,
  updateVehicle as updateVehicleInDB,
  deleteVehicle as deleteVehicleInDB,
} from './db';
import { ActionReturnType } from '@/types/actions';
import { vehicleFormSchema } from '../schemas/vehicles';
import { getCurrentOrganizationBranchId } from '@/server/db/branch';

/**
 * Server action to add a new vehicle
 */
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

/**
 * Server action to update an existing vehicle
 */
export async function updateVehicle(
  id: string,
  unsafeData: z.infer<typeof vehicleFormSchema>
): ActionReturnType {
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

    await updateVehicleInDB(id, {
      ...data,
      branchId,
      createdBy: userId,
    });

    return {
      error: false,
      message: 'Vehicle updated successfully',
    };
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return {
      error: true,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

/**
 * Server action to delete (soft delete) a vehicle
 */
export async function deleteVehicle(id: string): ActionReturnType {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return { error: true, message: 'User not authenticated or not in an organization' };
    }

    const branchId = await getCurrentOrganizationBranchId();

    if (!branchId) {
      return { error: true, message: 'Branch not found' };
    }

    await deleteVehicleInDB(id, branchId);

    return {
      error: false,
      message: 'Vehicle deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return {
      error: true,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
