'use server';

import { auth } from '@clerk/nextjs/server';
import { DEFAULT_WORKING_DAYS, DEFAULT_OPERATING_HOURS } from '@/lib/constants/business';
import { db } from '@/db';
import { BranchTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { branchSettingsSchema, type BranchSettings } from '../types';

export async function getBranchSettings(branchId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const branch = await db
      .select({
        workingDays: BranchTable.workingDays,
        operatingHours: BranchTable.operatingHours,
        defaultRtoOffice: BranchTable.defaultRtoOffice,
      })
      .from(BranchTable)
      .where(eq(BranchTable.id, branchId))
      .limit(1);

    if (!branch[0]) {
      throw new Error('Branch not found');
    }

    return {
      success: true,
      data: {
        workingDays: branch[0].workingDays || DEFAULT_WORKING_DAYS,
        operatingHours: branch[0].operatingHours || DEFAULT_OPERATING_HOURS,
        defaultRtoOffice: branch[0].defaultRtoOffice || '',
      },
    };
  } catch (error) {
    console.error('Error fetching branch settings:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch branch settings',
    };
  }
}

export async function updateBranchSettings(branchId: string, settings: BranchSettings) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Validate the settings
    const validatedSettings = branchSettingsSchema.parse(settings);

    // Update the branch settings
    await db
      .update(BranchTable)
      .set({
        workingDays: validatedSettings.workingDays,
        operatingHours: validatedSettings.operatingHours,
        defaultRtoOffice: validatedSettings.defaultRtoOffice || null,
        updatedAt: new Date(),
      })
      .where(eq(BranchTable.id, branchId));

    return {
      success: true,
      message: 'Branch settings updated successfully',
    };
  } catch (error) {
    console.error('Error updating branch settings:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update branch settings',
    };
  }
}
