'use server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import {
  addRTOService as addRTOServiceInDB,
  updateRTOService as updateRTOServiceInDB,
  deleteRTOService as deleteRTOServiceInDB,
} from './db';
import { ActionReturnType } from '@/types/actions';
import { rtoServiceFormSchema } from '../schemas/rto-services';
import { getCurrentOrganizationBranchId, getCurrentOrganizationTenantId } from '@/server/db/branch';
import { db } from '@/db';
import { RTOClientTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getRTOService } from './db';

/**
 * Server action to add a new RTO service
 */
export async function addRTOService(
  unsafeData: z.infer<typeof rtoServiceFormSchema>
): ActionReturnType {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return { error: true, message: 'User not authenticated or not in an organization' };
    }

    // Validate the data
    const { success, data, error: validationError } = rtoServiceFormSchema.safeParse(unsafeData);

    if (!success) {
      console.error('RTO service validation failed:', validationError.errors);
      console.error('Invalid data received:', JSON.stringify(unsafeData, null, 2));
      return {
        error: true,
        message: `Invalid RTO service data: ${validationError.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
      };
    }

    const branchId = await getCurrentOrganizationBranchId();
    const tenantId = await getCurrentOrganizationTenantId();

    if (!branchId || !tenantId) {
      return { error: true, message: 'Branch or tenant not found' };
    }

    // First, create the RTO client
    const rtoClientData = {
      ...data.clientInfo,
      branchId,
      tenantId,
      birthDate: data.clientInfo.birthDate.toISOString().split('T')[0], // Convert to YYYY-MM-DD
      // Handle permanent address - use current address if same
      permanentAddress: data.clientInfo.isCurrentAddressSameAsPermanentAddress
        ? data.clientInfo.address
        : data.clientInfo.permanentAddress || data.clientInfo.address,
      permanentCity: data.clientInfo.isCurrentAddressSameAsPermanentAddress
        ? data.clientInfo.city
        : data.clientInfo.permanentCity || data.clientInfo.city,
      permanentState: data.clientInfo.isCurrentAddressSameAsPermanentAddress
        ? data.clientInfo.state
        : data.clientInfo.permanentState || data.clientInfo.state,
      permanentPincode: data.clientInfo.isCurrentAddressSameAsPermanentAddress
        ? data.clientInfo.pincode
        : data.clientInfo.permanentPincode || data.clientInfo.pincode,
    };

    const [newRTOClient] = await db.insert(RTOClientTable).values(rtoClientData).returning();

    // Then create the RTO service
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { clientInfo, ...rtoServiceData } = data;
    await addRTOServiceInDB({
      ...rtoServiceData,
      rtoClientId: newRTOClient.id,
      branchId,
      tenantId,
    });

    return {
      error: false,
      message: 'RTO service and client added successfully',
    };
  } catch (error) {
    console.error('Error adding RTO service:', error);
    return {
      error: true,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

/**
 * Server action to update an existing RTO service
 */
export async function updateRTOService(
  id: string,
  unsafeData: z.infer<typeof rtoServiceFormSchema>
): ActionReturnType {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return { error: true, message: 'User not authenticated or not in an organization' };
    }

    // Validate the data
    const { success, data, error: validationError } = rtoServiceFormSchema.safeParse(unsafeData);

    if (!success) {
      console.error('RTO service validation failed:', validationError.errors);
      console.error('Invalid data received:', JSON.stringify(unsafeData, null, 2));
      return {
        error: true,
        message: `Invalid RTO service data: ${validationError.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
      };
    }

    const branchId = await getCurrentOrganizationBranchId();
    const tenantId = await getCurrentOrganizationTenantId();

    if (!branchId || !tenantId) {
      return { error: true, message: 'Branch or tenant not found' };
    }

    // Get the existing RTO service to find the RTO client ID
    const existingService = await getRTOService(id);
    if (!existingService) {
      return { error: true, message: 'RTO service not found' };
    }

    // Update the RTO client information
    if (existingService.rtoClientId) {
      const rtoClientData = {
        ...data.clientInfo,
        birthDate: data.clientInfo.birthDate.toISOString().split('T')[0],
        // Handle permanent address - use current address if same
        permanentAddress: data.clientInfo.isCurrentAddressSameAsPermanentAddress
          ? data.clientInfo.address
          : data.clientInfo.permanentAddress || data.clientInfo.address,
        permanentCity: data.clientInfo.isCurrentAddressSameAsPermanentAddress
          ? data.clientInfo.city
          : data.clientInfo.permanentCity || data.clientInfo.city,
        permanentState: data.clientInfo.isCurrentAddressSameAsPermanentAddress
          ? data.clientInfo.state
          : data.clientInfo.permanentState || data.clientInfo.state,
        permanentPincode: data.clientInfo.isCurrentAddressSameAsPermanentAddress
          ? data.clientInfo.pincode
          : data.clientInfo.permanentPincode || data.clientInfo.pincode,
      };

      await db
        .update(RTOClientTable)
        .set(rtoClientData)
        .where(eq(RTOClientTable.id, existingService.rtoClientId));
    }

    // Update the RTO service
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { clientInfo, ...rtoServiceData } = data;
    await updateRTOServiceInDB(id, {
      ...rtoServiceData,
      branchId,
      tenantId,
    });

    return {
      error: false,
      message: 'RTO service updated successfully',
    };
  } catch (error) {
    console.error('Error updating RTO service:', error);
    return {
      error: true,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

/**
 * Server action to delete an RTO service
 */
export async function deleteRTOService(id: string): ActionReturnType {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return { error: true, message: 'User not authenticated or not in an organization' };
    }

    const branchId = await getCurrentOrganizationBranchId();

    if (!branchId) {
      return { error: true, message: 'Branch not found' };
    }

    await deleteRTOServiceInDB(id, branchId);

    return {
      error: false,
      message: 'RTO service deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting RTO service:', error);
    return {
      error: true,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

/**
 * Server action to update RTO service status
 */
export async function updateRTOServiceStatus(
  id: string,
  status:
    | 'PENDING'
    | 'DOCUMENT_COLLECTION'
    | 'APPLICATION_SUBMITTED'
    | 'UNDER_REVIEW'
    | 'APPROVED'
    | 'REJECTED'
    | 'COMPLETED'
    | 'CANCELLED'
): ActionReturnType {
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return { error: true, message: 'User not authenticated or not in an organization' };
    }

    await updateRTOServiceInDB(id, { status });

    return {
      error: false,
      message: 'RTO service status updated successfully',
    };
  } catch (error) {
    console.error('Error updating RTO service status:', error);
    return {
      error: true,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
