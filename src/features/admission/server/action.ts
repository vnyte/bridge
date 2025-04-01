'use server';
import { z } from 'zod';
import {
  learningLicenseSchema,
  LearningLicenseValues,
  DrivingLicenseValues,
  personalInfoSchema,
  drivingLicenseSchema,
} from '../types';
import { auth } from '@clerk/nextjs/server';
import { getCurrentOrganizationBranchId } from '@/server/db/branch';
import { ActionReturnType } from '@/types/actions';
import { upsertClientInDB, upsertLearningLicenseInDB, upsertDrivingLicenseInDB } from './db';

export const createClient = async (
  unsafeData: z.infer<typeof personalInfoSchema>
): Promise<ActionReturnType & { clientId?: string }> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: true, message: 'User not authenticated or not in an organization' };
  }

  const branchId = await getCurrentOrganizationBranchId();

  if (!branchId) {
    return { error: true, message: 'Branch not found' };
  }

  try {
    const { isExistingClient, clientId } = await upsertClientInDB({
      ...unsafeData,
      branchId,
    });

    return {
      error: false,
      message: isExistingClient
        ? 'Client information updated successfully'
        : 'Client created successfully',
      clientId,
    };
  } catch (error) {
    console.error('Error creating client:', error);
    return { error: true, message: 'Failed to create client' };
  }
};

export const createLearningLicense = async (data: LearningLicenseValues): ActionReturnType => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: true, message: 'User not authenticated or not in an organization' };
  }

  const branchId = await getCurrentOrganizationBranchId();

  if (!branchId) {
    return { error: true, message: 'Branch not found' };
  }

  try {
    // Validate the learning license data
    const parseResult = learningLicenseSchema.safeParse(data);

    if (!parseResult.success) {
      return { error: true, message: 'Invalid learning license data' };
    }

    // Create or update the learning license
    const { isExistingLicense } = await upsertLearningLicenseInDB(parseResult.data);

    const action = isExistingLicense ? 'updated' : 'created';
    return {
      error: false,
      message: `Learning license ${action} successfully`,
    };
  } catch (error) {
    console.error('Error processing learning license data:', error);
    return { error: true, message: 'Failed to save learning license information' };
  }
};

export const createDrivingLicense = async (data: DrivingLicenseValues): ActionReturnType => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: true, message: 'User not authenticated or not in an organization' };
  }

  const branchId = await getCurrentOrganizationBranchId();

  if (!branchId) {
    return { error: true, message: 'Branch not found' };
  }

  try {
    // Validate the driving license data
    const parseResult = drivingLicenseSchema.safeParse(data);

    console.log('parseResult', parseResult.error);

    if (!parseResult.success) {
      return { error: true, message: 'Invalid driving license data' };
    }

    // Create or update the driving license
    const { isExistingLicense } = await upsertDrivingLicenseInDB(parseResult.data);

    const action = isExistingLicense ? 'updated' : 'created';
    return {
      error: false,
      message: `Driving license ${action} successfully`,
    };
  } catch (error) {
    console.error('Error processing driving license data:', error);
    return { error: true, message: 'Failed to save driving license information' };
  }
};
