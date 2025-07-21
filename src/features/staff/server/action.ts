'use server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { addStaff as addStaffInDB, updateStaff as updateStaffInDB } from './db';
import { ActionReturnType } from '@/types/actions';
import { staffFormSchema } from '../schemas/staff';
import { getCurrentOrganizationBranchId } from '@/server/db/branch';

/**
 * Server action to add a new staff member
 */
export async function addStaff(unsafeData: z.infer<typeof staffFormSchema>): ActionReturnType {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return { error: true, message: 'User not authenticated or not in an organization' };
    }

    // Validate the data
    const { success, data } = staffFormSchema.safeParse(unsafeData);

    if (!success) {
      return { error: true, message: 'Invalid staff data' };
    }

    const branchId = await getCurrentOrganizationBranchId();

    if (!branchId) {
      return { error: true, message: 'Branch not found' };
    }

    await addStaffInDB({
      ...data,
      branchId,
      createdBy: userId,
      assignedVehicleId: data.assignedVehicleId || null,
      licenseNumber: data.licenseNumber || null,
      licenseIssueDate: data.licenseIssueDate || null,
      experienceYears: data.experienceYears || null,
      educationLevel: data.educationLevel || null,
    });

    return {
      error: false,
      message: 'Staff member added successfully',
    };
  } catch (error) {
    console.error('Error adding staff:', error);
    return {
      error: true,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

/**
 * Server action to update an existing staff member
 */
export async function updateStaff(
  id: string,
  unsafeData: z.infer<typeof staffFormSchema>
): ActionReturnType {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return { error: true, message: 'User not authenticated or not in an organization' };
    }

    // Validate the data
    const { success, data } = staffFormSchema.safeParse(unsafeData);

    if (!success) {
      return { error: true, message: 'Invalid staff data' };
    }

    const branchId = await getCurrentOrganizationBranchId();

    if (!branchId) {
      return { error: true, message: 'Branch not found' };
    }

    await updateStaffInDB(id, {
      ...data,
      branchId,
      createdBy: userId,
      assignedVehicleId: data.assignedVehicleId || null,
      licenseNumber: data.licenseNumber || null,
      licenseIssueDate: data.licenseIssueDate || null,
      experienceYears: data.experienceYears || null,
      educationLevel: data.educationLevel || null,
    });

    return {
      error: false,
      message: 'Staff member updated successfully',
    };
  } catch (error) {
    console.error('Error updating staff:', error);
    return {
      error: true,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
